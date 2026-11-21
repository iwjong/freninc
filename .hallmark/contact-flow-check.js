async () => {
 const form = document.querySelector('[data-inquiry-form]');
 const assert = (value, message) => { if (!value) throw Error(message); };
 assert(document.querySelector('.contact-delivery-note')?.textContent.includes('Local preview'), 'Only test local delivery');
 const fill = (name, value) => {const field = form.elements.namedItem(name); field.value = value; field.dispatchEvent(new Event('input', {bubbles:true}));};
 const choose = type => [...form.querySelectorAll('[name=inquiryType]')].find(input => input.value === type).click();
 const finish = () => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {observer.disconnect(); reject(Error('Submission timeout'));}, 15000);
  const observer = new MutationObserver(() => {if(!form.hasAttribute('aria-busy')) {clearTimeout(timer); observer.disconnect(); resolve();}});
  observer.observe(form, {attributes:true, attributeFilter:['aria-busy']});
 });
 form.requestSubmit();
 assert(form.querySelectorAll('[aria-invalid=true]').length === 4, 'Required field errors');
 const marker = 'Browser verification ' + Date.now();
 const outcomes = [];
 for (const type of ['project', 'consulting', 'collaboration', 'general']) {
  choose(type);
  fill('name', 'FREN Browser Test'); fill('email', 'fren-ui-test@example.com');
  fill('organization', 'Synthetic verification'); fill('message', marker + ' / ' + type + ' - verify local-only inquiry handling.');
  if(type === 'collaboration') {fill('discipline', 'Illustration'); fill('website','https://example.com/portfolio');}
  form.elements.consent.checked = true;
  assert(new FormData(form).has('website') === (type === 'collaboration'), 'Conditional fields excluded');
  const wait = finish(); form.requestSubmit(); await wait;
  assert(form.querySelector('.inquiry-status').dataset.state === 'success', 'Successful local submission: ' + type);
  assert(form.querySelector('.inquiry-status').textContent.includes('No email has been sent'), 'Honest local receipt');
  outcomes.push(type);
 }
 choose('general');fill('name','Failure test');fill('email','failure@example.com');fill('message','Keep this message after a simulated delivery error.');form.elements.consent.checked=true;
 const originalFetch = window.fetch;
 try {
  let calls=0, release;
  window.fetch=()=>{calls++;return new Promise(resolve=>release=resolve);};
  const wait=finish();form.requestSubmit();form.requestSubmit();
  assert(calls===1 && form.querySelector('[type=submit]').disabled,'Duplicate submission prevented');
  release(Response.json({message:'Simulated delivery failure.'},{status:502}));await wait;
  assert(form.querySelector('.inquiry-status').dataset.state==='error','Visible failure');
  assert(form.elements.message.value.includes('Keep this message'),'Answers preserved');
  assert(!form.querySelector('[type=submit]').disabled,'Retry enabled');
 } finally {window.fetch=originalFetch;}
 form.reset();choose('project');form.querySelector('.inquiry-status').hidden=true;
 return {marker,success:outcomes,invalid:'passed',duplicate:'passed',failure:'passed'};
}