import { studioEmail } from "../lib/inquiry";

const prompts = {
  project: ["What are you planning?", "Tell us about the place, the people it serves and what you hope to make possible."],
  consulting: ["What would you like guidance on?", "Share the challenge, the decisions ahead and where an outside perspective could help."],
  collaboration: ["What could we create together?", "Introduce your practice, the kind of partnership you have in mind and what you would bring to it."],
  general: ["What would you like to talk about?", "For studio questions, speaking invitations or anything else, tell us a little more."],
};

export function initContactForm(form, signal) {
  const startingPoints = new Map([
    ['community', "I'd like to discuss a community or civic space."],
    ['visitor', "I'd like to discuss a visitor experience."],
    ['faith', "I'd like to discuss a church or gathering space."],
    ['world-outreach-church', "I'd like to learn more about the World Outreach Church project."],
  ]);
  const message = form.elements.message;
  const startingPoint = startingPoints.get(new URLSearchParams(window.location.search).get('topic'));
  if (startingPoint && !message.value) message.value = `${startingPoint}\n\n`;
  const endpoint = form.dataset.inquiryEndpoint;
  const button = form.querySelector('[type="submit"]');
  const status = form.querySelector('.inquiry-status');
  const buttonLabel = button.textContent;
  let pending = false;
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
    if (String(data.get('_gotcha') || '').trim()) {
      showStatus(`Please email ${studioEmail} to continue your inquiry.`, 'error');
      return;
    }
    data.set('name', String(data.get('name')).trim());
    data.set('message', String(data.get('message')).trim());
    const labels = { project: 'New project', consulting: 'Consulting', collaboration: 'Collaboration', general: 'Something else' };
    const inquiryType = labels[data.get('inquiryType')];
    const subject = `FREN website / ${inquiryType || 'Inquiry'}`;
    const services = data.getAll('services').join(', ');
    if (services) data.set('services', services);
    if (!endpoint) {
      const lines = [`Inquiry: ${inquiryType}`];
      for (const [field, label] of [
        ['name', 'Name'], ['email', 'Email'], ['organization', 'Organization'],
        ['services', 'Interests'], ['timing', 'Timing'], ['budget', 'Budget'],
        ['discipline', 'Discipline'], ['website', 'Website'],
      ]) {
        if (data.get(field)) lines.push(`${label}: ${data.get(field)}`);
      }
      lines.push('', 'Message:', data.get('message'), '', 'Privacy acknowledgement: accepted');
      const draft = `mailto:${studioEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\r\n'))}`;
      showStatus('Review and send the draft from your email app. Your answers are still here.', 'info');
      window.location.assign(draft);
      return;
    }

    data.set('subject', subject);
    data.set('inquiryType', inquiryType || 'Inquiry');
    const fieldsets = [...form.querySelectorAll('fieldset')].map(element => [element, element.disabled]);
    pending = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    fieldsets.forEach(([element]) => { element.disabled = true; });
    form.elements.consent.disabled = true;
    status.hidden = true;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
        signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]),
      });
      if (signal.aborted) return;
      if (response.status === 429) {
        showStatus('Too many attempts. Wait a minute and try again. Your answers are still here.', 'error');
        return;
      }
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Inquiry was not accepted');
      }
      form.reset();
      showStatus('Thanks. Your inquiry was submitted.', 'success');
    } catch {
      if (!signal.aborted) showStatus('We couldn’t confirm your submission. Your answers are still here. You can also email the studio directly.', 'error');
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
