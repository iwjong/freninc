import { emailDraftUrl, studioEmail } from "../lib/inquiry";

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
  listen('submit', event => {
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
    const fieldsets = [...form.querySelectorAll('fieldset')].map(element => [element, element.disabled]);
    if (String(payload.fax || '').trim()) {
      showStatus(`Please email ${studioEmail} to continue your inquiry.`, 'error');
      return;
    }
    const labels = { project: 'New project', consulting: 'Consulting', collaboration: 'Collaboration', general: 'Something else' };
    const lines = [
      `Inquiry: ${labels[payload.inquiryType] || payload.inquiryType}`,
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Organization: ${payload.organization || 'Not specified'}`,
    ];
    if (payload.services?.length) lines.push(`Interests: ${payload.services.filter(Boolean).join(', ')}`);
    if (payload.timing) lines.push(`Timing: ${payload.timing}`);
    if (payload.budget) lines.push(`Budget: ${payload.budget}`);
    if (payload.discipline) lines.push(`Discipline: ${payload.discipline}`);
    if (payload.website) lines.push(`Website: ${payload.website}`);
    lines.push('', 'Message:', payload.message, '', 'Privacy acknowledgement: accepted');
    const compose = emailDraftUrl(`FREN website / ${labels[payload.inquiryType] || 'Inquiry'}`, lines.join('\n'));
    pending = true;
    button.disabled = true;
    button.textContent = 'Opening…';
    form.setAttribute('aria-busy', 'true');
    fieldsets.forEach(([element]) => { element.disabled = true; });
    form.elements.consent.disabled = true;
    status.hidden = true;
    try {
      const opened = window.open(compose, '_blank', 'noopener,noreferrer');
      if (!opened) window.location.assign(compose);
      if (!signal.aborted) showStatus(`An email draft opened for ${studioEmail}. Send that message to reach FREN. Your answers are still on this page.`, 'success');
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
