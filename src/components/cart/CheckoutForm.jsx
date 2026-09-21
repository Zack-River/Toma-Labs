import { useEffect, useState } from 'react';
import { PAYMENT_METHODS } from '../../lib/whatsapp-checkout.js';

export function CheckoutForm({ initialValues, error, onCancel, onSubmit }) {
  const [values, setValues] = useState(initialValues);

  useEffect(() => setValues(initialValues), [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(values);
  }

  return <form className="checkout-form" onSubmit={handleSubmit}>
    <div className="checkout-form-heading"><p className="eyebrow">TOMA / WhatsApp checkout</p><h3>Where should we send it?</h3><p>Share the delivery details and we’ll prepare your order message.</p></div>
    <div className="checkout-field"><label htmlFor="checkout-name">Name</label><input id="checkout-name" name="name" value={values.name} onChange={handleChange} autoComplete="name" maxLength="120" required /></div>
    <div className="checkout-field"><label htmlFor="checkout-phone">Phone number</label><input id="checkout-phone" name="phone" type="tel" inputMode="tel" value={values.phone} onChange={handleChange} autoComplete="tel" maxLength="30" placeholder="01… or +20…" required /></div>
    <div className="checkout-field"><label htmlFor="checkout-address">Delivery address</label><textarea id="checkout-address" name="address" value={values.address} onChange={handleChange} autoComplete="street-address" maxLength="240" rows="3" placeholder="Street, building, area, city" required /></div>
    <div className="checkout-field"><label htmlFor="checkout-payment">Payment method</label><select id="checkout-payment" name="paymentMethod" value={values.paymentMethod} onChange={handleChange} required><option value="" disabled>Choose a payment method</option>{PAYMENT_METHODS.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></div>
    {error ? <p className="checkout-error" role="alert">{error}</p> : null}
    <p className="checkout-privacy">Your details are used to prepare this WhatsApp order message. TOMA will confirm availability, delivery, and the final total in chat.</p>
    <div className="checkout-form-actions"><button className="checkout-button" type="submit">Continue in WhatsApp <span aria-hidden="true">↗</span></button><button className="checkout-cancel" type="button" onClick={onCancel}>Keep reviewing</button></div>
  </form>;
}
