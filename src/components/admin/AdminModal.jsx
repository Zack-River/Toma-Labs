import { useEffect, useRef } from 'react';

export function AdminModal({ title, eyebrow, children, footer, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
      <div className="admin-modal-header"><div><p className="admin-eyebrow">{eyebrow || 'TOMA / Admin'}</p><h2 id="admin-modal-title">{title}</h2></div><button ref={closeRef} className="admin-modal-close" type="button" onClick={onClose} aria-label="Close dialog">×</button></div>
      <div className="admin-modal-body">{children}</div>
      {footer ? <div className="admin-modal-footer">{footer}</div> : null}
    </section>
  </div>;
}

export function AdminConfirmModal({ title, message, confirmLabel = 'Confirm action', danger = false, onClose, onConfirm }) {
  return <AdminModal title={title} eyebrow="TOMA / Confirm" onClose={onClose} footer={<><button className="admin-button admin-button-ghost" type="button" onClick={onClose}>Cancel</button><button className={`admin-button ${danger ? 'admin-button-danger' : 'admin-button-primary'}`} type="button" onClick={onConfirm}>{confirmLabel}</button></>}>
    <p className="admin-confirm-copy">{message}</p>
  </AdminModal>;
}
