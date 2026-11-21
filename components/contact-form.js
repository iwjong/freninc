const prompts = {
  project: ["What are you planning?", "Tell us about the place, the people it serves and what you hope to make possible."],
  consulting: ["What would you like guidance on?", "Share the challenge, the decisions ahead and where an outside perspective could help."],
  collaboration: ["What could we create together?", "Introduce your practice, the kind of partnership you have in mind and what you would bring to it."],
  general: ["What would you like to talk about?", "For studio questions, speaking invitations or anything else, tell us a little more."],
};

export function initContactForm(form, signal) {
  const button = form.querySelector('[type="submit"]');
  const status = form.querySelector('.inquiry-status');
  const buttonLabel = button.textContent;
  let pending = false;
  let submission;
  const listen = (event, callback) => form.addEventListener(event, callback, { signal });
  const syncType = () => {
    const type = form.elements.inquiryType.value;
    form.querySelectorAll('[data-types]').forEach(fieldset => {
      fieldset.hidden = !fieldset.dataset.types.split(' ').includes(type);
      fieldset.disabled = fieldset.hidden;
    });
    const [title, hint] = prompts[type];
    form.querySelector('#inquiry-message-title').textContent = title;
    form.querySelector('#inquiry-message-hint').textContent = hint;
  };
  const setError = (name, message = '') => {
    const field = form.elements.namedItem(name);
    const output = form.querySelector(`#error-${name}`);
    if (!field || !output) return;
    field.setAttribute('aria-invalid', String(Boolean(message)));
    output.textContent = message;
  };
  form.querySelectorAll('input[name], textarea[name]').forEach(field => {
    if (form.querySelector(`#error-${field.name}`) && !field.hasAttribute('aria-describedby')) field.setAttribute('aria-describedby', `error-${field.name}`);
  });
  const showStatus = (message, state) => {
    status.textContent = message;
    status.dataset.state = state;
    status.hidden = false;
    status.focus();
  };
  listen('change', event => {
    if (event.target.name === 'inquiryType') syncType();
    setError(event.target.name);
  });
  listen('input', event => {
    event.target.setCustomValidity?.('');
    setError(event.target.name);
  });
  listen('submit', async event => {
    event.preventDefault();
    if (pending) return;
    let invalid;
    for (const field of form.querySelectorAll('input, textarea')) {
      if (field.disabled || field.closest('fieldset:disabled')) continue;
      if (['name', 'message'].includes(field.name)) {
        field.setCustomValidity(field.value.trim().length < field.minLength ? `Please enter at least ${field.minLength} characters.` : '');
      }
      if (!field.checkValidity()) {
        setError(field.name, field.validationMessage);
        invalid ??= field;
      }
    }
    if (invalid) { invalid.focus(); return; }
    const data = new FormData(form);
    const payload = Object.fromEntries(data);
    payload.services = data.getAll('services');
    payload.consent = data.has('consent');
    const serialized = JSON.stringify(payload);
    if (submission?.serialized !== serialized) submission = { serialized, id: crypto.randomUUID() };
    payload.submissionId = submission.id;
    const fieldsets = [...form.querySelectorAll('fieldset')].map(element => [element, element.disabled]);
    pending = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    fieldsets.forEach(([element]) => { element.disabled = true; });
    form.elements.consent.disabled = true;
    status.hidden = true;
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), signal: AbortSignal.any([signal, AbortSignal.timeout(20000)]),
      });
      const result = await response.json();
      if (!response.ok) {
        Object.entries(result.errors || {}).forEach(([name, message]) => setError(name, message));
        throw new Error(result.message || 'We could not send your inquiry. Please try again or email support@freninc.com.');
      }
      form.reset();
      submission = undefined;
      showStatus(result.message, 'success');
    } catch (error) {
      if (!signal.aborted) showStatus(error.name === 'Error' ? error.message : 'The connection was interrupted. Your answers are still here. Please try again or email support@freninc.com.', 'error');
    } finally {
      pending = false;
      fieldsets.forEach(([element, disabled]) => { element.disabled = disabled; });
      form.elements.consent.disabled = false;
      syncType();
      button.disabled = false;
      button.textContent = buttonLabel;
      form.removeAttribute('aria-busy');
    }
  });
  syncType();
  button.disabled = false;
}
