import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TomaIcon } from '../TomaIcon.jsx';
import { faArrowDown, faArrowLeft, faArrowRight, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export function ShopHeroCarousel({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const carouselRef = useRef(null);
  const dragStart = useRef(null);

  useEffect(() => {
    if (paused || !isVisible || slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [isVisible, paused, slides.length]);

  useEffect(() => {
    const node = carouselRef.current;
    if (!node || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function goTo(index) {
    setActiveIndex((index + slides.length) % slides.length);
  }

  function handlePointerDown(event) {
    if (event.target.closest('a, button')) return;
    dragStart.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerUp(event) {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    event.preventDefault();
    goTo(activeIndex + (deltaX < 0 ? 1 : -1));
  }

  return <section ref={carouselRef} className="shop-hero" aria-roledescription="carousel" aria-label="TOMA collection highlights" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <div className="shop-hero-stage" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { dragStart.current = null; }}>{slides.map((slide, index) => <article className={`shop-hero-slide shop-hero-slide-${slide.id}${index === activeIndex ? ' active' : ''}`} key={slide.id} aria-hidden={index !== activeIndex} aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
      <div className="shop-hero-copy"><p className="shop-eyebrow">{slide.eyebrow}</p><h1>{slide.titleLine}<br /><em>{slide.titleEmphasis}</em></h1><p className="shop-hero-lede">{slide.copy}</p><div className="shop-hero-actions"><Link className="button button-brass" to={slide.ctaTarget} tabIndex={index === activeIndex ? 0 : -1}>{slide.ctaLabel} <TomaIcon icon={faArrowUpRightFromSquare} /></Link><Link className="button button-line" to={slide.secondaryTarget} tabIndex={index === activeIndex ? 0 : -1}>{slide.secondaryLabel} <TomaIcon icon={faArrowDown} /></Link></div><div className="shop-hero-proof">{slide.proof.map((item, proofIndex) => <span key={item}>{proofIndex === 0 ? <b>{item.split(' ')[0]}</b> : null}{proofIndex === 0 ? ` ${item.split(' ').slice(1).join(' ')}` : item}</span>)}</div></div><div className="shop-hero-visual"><div className="shop-hero-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(36, 21, 13, .86), rgba(36, 21, 13, .18)), url('${slide.image}')` }}></div><div className="shop-hero-label"><img src="/assets/toma-bean-mark-128.png" width="128" height="128" alt="" /><div><strong>toma</strong><small>{slide.label}</small><em>SELECTED FOR YOUR NEXT CUP</em></div></div><span className="shop-hero-note">{slide.note}</span><span className="shop-hero-index">DROP 0{index + 1} <TomaIcon icon={faArrowDown} /></span></div>
    </article>)}</div>
    <div className="shop-carousel-controls"><button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous shop highlight"><TomaIcon icon={faArrowLeft} /></button><div className="shop-carousel-dots">{slides.map((slide, index) => <button className={index === activeIndex ? 'active' : ''} type="button" key={slide.id} onClick={() => goTo(index)} aria-label={`Show slide ${index + 1}: ${slide.label}`} aria-current={index === activeIndex ? 'true' : undefined}><span></span></button>)}</div><button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next shop highlight"><TomaIcon icon={faArrowRight} /></button><span className="shop-carousel-count">0{activeIndex + 1} / 0{slides.length}</span></div>
  </section>;
}
