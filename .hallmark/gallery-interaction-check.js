async () => {
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const gallery = document.querySelector('.about-services-gallery');
  gallery.scrollIntoView();
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const swiper = gallery.swiper;
  assert(swiper, 'Gallery initialized');
  swiper.params.speed = 0;
  swiper.slideTo(0, 0);
  const bounds = gallery.getBoundingClientRect();
  const fire = (type, fraction, pointerType = 'mouse') => {
    const x = bounds.left + bounds.width * fraction;
    const y = bounds.top + 80;
    document.elementFromPoint(x, y).dispatchEvent(new PointerEvent(type, {
      bubbles: true, pointerType, clientX: x, clientY: y
    }));
  };
  assert(!document.querySelector('.about-gallery-nav'), 'No separate arrow buttons');
  assert(document.querySelectorAll('.about-services-gallery img').length === 1, 'One cover image');
  assert(document.documentElement.scrollWidth <= innerWidth, 'No page overflow');
  for (const card of gallery.querySelectorAll('.about-service-card')) {
    assert(card.scrollHeight <= card.clientHeight + 1, 'Card content fits');
    assert(card.querySelector('.about-tags').compareDocumentPosition(card.querySelector('p')) & Node.DOCUMENT_POSITION_FOLLOWING, 'Tags precede description');
  }
  fire('click', .8, 'touch');
  assert(swiper.activeIndex === 0, 'Touch tap does not advance');
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    fire('pointermove', .8);
    const cursor = document.querySelector('.reference-arrow-cursor');
    assert(cursor.style.display === 'grid' && cursor.dataset.direction === 'next', 'Next cursor');
    assert(getComputedStyle(cursor).backgroundColor === 'rgb(255, 255, 255)', 'Opaque white cursor');
    assert(cursor.querySelector('img').getAttribute('src') === '/assets/brand/gallery-arrow.svg', 'Supplied SVG');
    fire('click', .8);
    assert(swiper.activeIndex > 0, 'Click next');
    fire('pointermove', .2);
    assert(cursor.dataset.direction === 'prev', 'Previous cursor');
    fire('click', .2);
    assert(swiper.activeIndex === 0, 'Click previous');
    swiper.allowClick = false;
    fire('click', .8);
    assert(swiper.activeIndex === 0, 'Dragging does not trigger extra click');
    swiper.allowClick = true;
  }
  swiper.slideTo(4, 0);
  await new Promise(requestAnimationFrame);
  const last = gallery.querySelector('.swiper-slide:last-child').getBoundingClientRect();
  assert(swiper.isEnd && last.right <= bounds.right + 2, 'Last card visible');
  swiper.slideTo(1, 0);
  return {width: innerWidth, status: 'passed', pointer: matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine'};
}