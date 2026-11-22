"use client";

import { useEffect, useRef } from "react";
import { initContactForm } from "./contact-form";

export default function SitePage({ html }) {
  const root = useRef(null);

  useEffect(() => {
    const page = root.current;
    const controller = new AbortController();
    const listen = (element, event, callback) => element.addEventListener(event, callback, { signal: controller.signal });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cookie = page.querySelector(".cookie-bar-wrapper");
    try { cookie.hidden = localStorage.getItem("reference-cookie-dismissed") === "true"; } catch {}
    listen(cookie.querySelector("button"), "click", () => {
      cookie.hidden = true;
      try { localStorage.setItem("reference-cookie-dismissed", "true"); } catch {}
    });
    const carousels = [];
    const mouseNavigation = window.matchMedia("(hover: hover) and (pointer: fine)");
    const galleryDirection = (event, element) => {
      if (!mouseNavigation.matches || event.pointerType === "touch" || !element.swiper || element.swiper.isLocked) return null;
      if (event.target.closest("a, button, summary, input, textarea, select")) return null;
      const bounds = element.getBoundingClientRect();
      const direction = event.clientX < bounds.left + bounds.width / 2 ? "prev" : "next";
      if (direction === "prev" ? element.swiper.isBeginning : element.swiper.isEnd) return null;
      return direction;
    };
    let swiperModules;
    const initCarousel = async (element) => {
      swiperModules ??= import("./carousel");
      const { Swiper, A11y, Autoplay, Keyboard } = await swiperModules;
      if (controller.signal.aborted) return;
      const hero = element.closest(".carousel-block");
      const purpose = element.closest(".purpose-block");
      const aboutGallery = element.closest(".about-team, .about-capabilities, .about-process");
      const slideCount = element.querySelectorAll(".swiper-slide").length;
      const initialSlide = hero ? Math.floor(Math.random() * slideCount) : 0;
      if (hero) {
        const image = element.querySelectorAll(".swiper-slide")[initialSlide]?.querySelector("img");
        if (image) { image.loading = "eager"; image.fetchPriority = "high"; }
      }
      const canLoop = !purpose && !aboutGallery && slideCount > 2;
      const swiper = new Swiper(element, {
        modules: [A11y, Autoplay, Keyboard],
        slidesPerView: "auto",
        initialSlide,
        loop: canLoop,
        rewind: Boolean(hero) && !canLoop,
        speed: reducedMotion ? 0 : 650,
        spaceBetween: purpose || aboutGallery ? 16 : 0,
        breakpoints: aboutGallery ? { 640: { spaceBetween: 24 } } : undefined,
        autoplay: hero && !reducedMotion ? { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true } : false,
        keyboard: { enabled: true, onlyInViewport: true },
        navigation: false,
      });
      element.tabIndex = 0;
      element.setAttribute("role", "region");
      element.setAttribute("aria-label", hero ? "Featured work" : purpose ? "Our Purpose" : aboutGallery ? element.getAttribute("aria-label") : `${element.closest(".project-item").querySelector(".brand").textContent} gallery`);
      listen(element, "click", (event) => {
        if (!swiper.allowClick) return;
        const button = event.target.closest(".nav-button");
        const direction = button ? (button.classList.contains("prev") ? "prev" : "next") : aboutGallery || purpose ? galleryDirection(event, element) : null;
        if (direction && !window.getSelection()?.toString()) direction === "prev" ? swiper.slidePrev() : swiper.slideNext();
      });
      listen(element, "focusin", () => swiper.autoplay?.stop());
      listen(element, "focusout", () => {
        if (hero && !reducedMotion && !document.hidden && !element.contains(document.activeElement)) swiper.autoplay.start();
      });
      carousels.push(swiper);
    };
    const carouselObserver = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        carouselObserver.unobserve(target);
        initCarousel(target).catch((error) => console.error("Unable to initialize gallery", error));
      }
    }, { rootMargin: "400px" });
    page.querySelectorAll(".swiper").forEach((element) => carouselObserver.observe(element));

    page.querySelectorAll(".project-heading button").forEach((button) => {
      const details = document.getElementById(button.getAttribute("aria-controls"));
      let animation;
      listen(button, "click", () => {
        const opening = button.getAttribute("aria-expanded") !== "true";
        animation?.cancel();
        button.textContent = opening ? "Close" : "Information";
        button.setAttribute("aria-expanded", String(opening));
        details.hidden = false;
        if (reducedMotion) details.hidden = !opening;
        else {
          const height = `${details.scrollHeight}px`;
          animation = details.animate(opening ? [{ height: "0px", opacity: 0 }, { height, opacity: 1 }] : [{ height, opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 500, easing: "ease" });
          animation.onfinish = () => { details.hidden = !opening; };
        }
      });
    });

    page.querySelectorAll(".site-link, .menu-links a").forEach((link) => {
      if (link.getAttribute("href") === window.location.pathname) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    const header = page.querySelector("header");
    const main = page.querySelector("main");
    const footer = page.querySelector("footer");
    const menu = page.querySelector("#mobile-menu");
    const menuButton = page.querySelector(".menu-button");
    const closeMenu = () => {
      menu.hidden = true;
      menuButton.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      main.inert = footer.inert = cookie.inert = false;
      document.body.style.overflow = "";
      menuButton.focus();
    };
    const openMenu = () => {
      main.inert = footer.inert = cookie.inert = true;
      document.body.style.overflow = "hidden";
      menu.hidden = false;
      menuButton.classList.add("menu-open");
      menuButton.setAttribute("aria-expanded", "true");
      menu.querySelector("a").focus();
    };
    listen(menuButton, "click", () => menu.hidden ? openMenu() : closeMenu());
    listen(menu, "click", (event) => { if (event.target.closest("a")) closeMenu(); });
    listen(document, "keydown", (event) => {
      if (menu.hidden) return;
      if (event.key === "Escape") closeMenu();
      if (event.key === "Tab") {
        const focusable = [...header.querySelectorAll('a[href], button:not([disabled])')].filter((node) => node.getClientRects().length);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    listen(window, "resize", () => { if (!menu.hidden && window.innerWidth >= 640) closeMenu(); });

    const inquiryForm = page.querySelector('[data-inquiry-form]');
    if (inquiryForm) initContactForm(inquiryForm, controller.signal);
    page.querySelectorAll("form:not([data-inquiry-form])").forEach((form) => {
      listen(form, "submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        let message = form.querySelector(".reference-form-status");
        if (!message) {
          message = document.createElement("p");
          message.className = "reference-form-status";
          message.setAttribute("role", "status");
          form.append(message);
        }
        message.textContent = "Preview complete. Your email has not been subscribed.";
      });
    });

    const cursor = document.createElement("div");
    cursor.className = "reference-arrow-cursor";
    cursor.setAttribute("aria-hidden", "true");
    const cursorArrow = document.createElement("img");
    cursorArrow.src = "/assets/brand/gallery-arrow.svg";
    cursorArrow.alt = "";
    cursor.append(cursorArrow);
    page.append(cursor);
    const hideCursor = () => {
      cursor.style.display = "none";
      cursor.classList.remove("is-pressed");
      page.querySelectorAll("[data-navigation-direction]").forEach((element) => delete element.dataset.navigationDirection);
    };
    const updateCursor = (event) => {
      hideCursor();
      if (!mouseNavigation.matches || event.pointerType !== "mouse") return;
      const arrow = event.target.closest(".nav-button");
      const gallery = event.target.closest(".about-team .swiper, .about-capabilities .swiper, .about-process .swiper, .purpose-block .swiper");
      const direction = arrow ? (arrow.classList.contains("prev") ? "prev" : "next") : gallery ? galleryDirection(event, gallery) : null;
      if (!direction) return;
      if (gallery) gallery.dataset.navigationDirection = direction;
      cursor.style.display = "grid";
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.dataset.direction = direction;
      cursor.classList.toggle("is-pressed", Boolean(event.buttons & 1));
    };
    listen(page, "pointermove", updateCursor);
    listen(page, "pointerleave", hideCursor);
    listen(page, "pointerdown", updateCursor);
    listen(window, "pointerup", () => cursor.classList.remove("is-pressed"));
    listen(window, "pointercancel", hideCursor);
    listen(window, "blur", hideCursor);
    listen(window, "scroll", hideCursor);

    const videos = page.querySelectorAll("video");
    const visibleVideos = new Set();
    const updateVideo = (video) => {
      video.muted = true;
      if (visibleVideos.has(video) && !document.hidden && !reducedMotion) video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleVideos.add(entry.target);
        else visibleVideos.delete(entry.target);
        updateVideo(entry.target);
      }
    });
    videos.forEach((video) => observer.observe(video));
    listen(document, "visibilitychange", () => {
      carousels.forEach((swiper) => {
        if (document.hidden) swiper.autoplay?.stop();
        else if (swiper.params.autoplay && !reducedMotion && !swiper.el.contains(document.activeElement)) swiper.autoplay.start();
      });
      videos.forEach(updateVideo);
    });

    if (window.location.hash) {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) requestAnimationFrame(() => target.scrollIntoView());
    }
    page.dataset.ready = "true";
    return () => {
      controller.abort();
      carouselObserver.disconnect();
      observer.disconnect();
      videos.forEach((video) => video.pause());
      carousels.forEach((swiper) => swiper.destroy(true, true));
      cursor.remove();
      document.body.style.overflow = "";
    };
  }, [html]);

  return <div ref={root} dangerouslySetInnerHTML={{ __html: html }} />;
}
