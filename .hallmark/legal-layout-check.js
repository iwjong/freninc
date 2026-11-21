async () => {
  await document.fonts.ready;
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const assert = (condition, message) => { if (!condition) throw Error(message); };
  const page = document.querySelector('.legal-page');
  const nav = page.querySelector('.legal-nav');
  const content = page.querySelector('.legal-content');
  const size = selector => parseFloat(getComputedStyle(page.querySelector(selector)).fontSize);
  assert(document.documentElement.scrollWidth <= innerWidth, 'No horizontal page overflow');
  assert(content.scrollWidth <= content.clientWidth + 1, 'Body fits');
  assert(size('h1') > size('h2') && size('h2') > size('.legal-content') && size('.legal-content') > size('.legal-nav'), 'Type hierarchy');
  const links = [...nav.querySelectorAll('a')];
  assert(links.length === content.querySelectorAll('section').length, 'All sections in contents');
  for (const link of links) {
    assert(document.getElementById(link.hash.slice(1)), 'Anchor target exists');
    assert(link.getBoundingClientRect().height >= 44, 'Navigation hit area');
    assert(link.scrollWidth <= link.clientWidth + 1, 'Navigation text fits');
  }
  links[4].click();
  await new Promise(requestAnimationFrame);
  const target = document.getElementById(links[4].hash.slice(1));
  const headerBottom = document.querySelector('header').getBoundingClientRect().bottom;
  assert(target.getBoundingClientRect().top >= headerBottom, 'Anchor heading clears header');
  if (innerWidth >= 1024) {
    assert(Math.abs(nav.getBoundingClientRect().top - 110) < 2, 'Sticky contents');
    assert(nav.getBoundingClientRect().bottom <= innerHeight, 'Contents fit short viewport');
  } else assert(getComputedStyle(nav).position !== 'sticky', 'Mobile contents remain in flow');
  return {route: location.pathname, width: innerWidth, body: size('.legal-content'), nav: size('.legal-nav'), status: 'passed'};
}