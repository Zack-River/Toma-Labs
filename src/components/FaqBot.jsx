import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FAQ_ITEMS, TOMA_DIRECT_MESSAGE } from '../lib/faq.js';
import { createWhatsAppQuestionUrl } from '../lib/whatsapp-checkout.js';
import { TomaIcon } from './TomaIcon.jsx';
import { faArrowUpRightFromSquare, faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

export function FaqBot() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const firstQuestionRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setExpandedId(null);
  }, [location.pathname]);

  useEffect(() => {
    if (open) firstQuestionRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function togglePanel() {
    setOpen((current) => !current);
  }

  function toggleQuestion(id) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return <aside ref={rootRef} className={`faq-bot${open ? ' is-open' : ''}`}>
    {open ? <div className="faq-bot-panel" id="toma-faq-panel" role="dialog" aria-labelledby="toma-faq-title">
      <div className="faq-bot-panel-header">
        <div><p className="faq-bot-eyebrow">TOMA / Quick answers</p><h2 id="toma-faq-title">Need a hand?</h2></div>
        <button className="faq-bot-close" type="button" onClick={togglePanel} aria-label="Close frequently asked questions"><TomaIcon icon={faXmark} /></button>
      </div>
      <p className="faq-bot-intro">A few useful answers before you choose your next cup.</p>
      <div className="faq-bot-list">
        {FAQ_ITEMS.map((item, index) => {
          const expanded = expandedId === item.id;
          const answerId = `faq-answer-${item.id}`;
          return <div className={`faq-bot-item${expanded ? ' is-expanded' : ''}`} key={item.id}>
            <button ref={index === 0 ? firstQuestionRef : null} className="faq-bot-question" type="button" aria-expanded={expanded} aria-controls={answerId} onClick={() => toggleQuestion(item.id)}>
              <span>{item.question}</span><TomaIcon icon={expanded ? faMinus : faPlus} />
            </button>
            {expanded ? <p className="faq-bot-answer" id={answerId}>{item.answer}</p> : null}
          </div>;
        })}
      </div>
      <a className="faq-bot-whatsapp" href={createWhatsAppQuestionUrl(TOMA_DIRECT_MESSAGE)} target="_blank" rel="noreferrer">
        <span>Ask TOMA directly</span><TomaIcon icon={faArrowUpRightFromSquare} />
      </a>
    </div> : null}
    <button ref={triggerRef} className="faq-bot-trigger" type="button" aria-expanded={open} aria-controls="toma-faq-panel" aria-label={open ? 'Close TOMA FAQ assistant' : 'Open TOMA FAQ assistant'} onClick={togglePanel}>
      <span className="faq-bot-face" aria-hidden="true"><i></i><i></i><b></b></span>
      <span className="faq-bot-trigger-label">FAQ</span>
    </button>
  </aside>;
}
