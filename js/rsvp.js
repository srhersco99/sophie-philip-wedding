/* ═══════════════════════════════════════════════════════════════
   RSVP.JS — Formspree submission, validation, conditional fields
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const form        = document.getElementById('rsvp-form');
  const thankyou    = document.getElementById('rsvp-thankyou');
  const submitBtn   = document.getElementById('rsvp-submit');
  const dietField   = document.getElementById('field-dietary');
  const dinnerField = document.getElementById('field-dinner');
  const attendRadios = document.querySelectorAll('input[name="attending"]');

  if (!form) return;

  /* ── Conditional fields based on attending radio ─────────── */
  function updateConditionalFields() {
    const attending = form.querySelector('input[name="attending"]:checked');
    const isYes = attending && attending.value === 'yes';

    if (dietField) {
      dietField.classList.toggle('form-field--hidden', !isYes);
      dietField.querySelector('input, textarea, select').required = isYes;
    }
    if (dinnerField) {
      dinnerField.classList.toggle('form-field--hidden', !isYes);
    }
  }

  attendRadios.forEach(radio => {
    radio.addEventListener('change', updateConditionalFields);
  });

  updateConditionalFields();

  /* ── Validation helpers ──────────────────────────────────── */
  function showError(fieldId, message) {
    const errorEl = document.getElementById(`error-${fieldId}`);
    const inputEl = document.getElementById(fieldId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
    if (inputEl) {
      inputEl.setAttribute('aria-invalid', 'true');
      inputEl.classList.add('input--error');
    }
  }

  function clearError(fieldId) {
    const errorEl = document.getElementById(`error-${fieldId}`);
    const inputEl = document.getElementById(fieldId);
    if (errorEl) errorEl.classList.remove('visible');
    if (inputEl) {
      inputEl.removeAttribute('aria-invalid');
      inputEl.classList.remove('input--error');
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm() {
    let valid = true;

    // Name
    const name = document.getElementById('name');
    clearError('name');
    if (!name || !name.value.trim()) {
      showError('name', 'Please enter your full name.');
      valid = false;
    }

    // Email
    const email = document.getElementById('email');
    clearError('email');
    if (!email || !email.value.trim()) {
      showError('email', 'Please enter your email address.');
      valid = false;
    } else if (!validateEmail(email.value.trim())) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    }

    // Attending
    const attending = form.querySelector('input[name="attending"]:checked');
    clearError('attending');
    if (!attending) {
      showError('attending', 'Please let us know if you can attend.');
      valid = false;
    }

    return valid;
  }

  /* ── Inline error clearing on input ─────────────────────── */
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      if (input.id) clearError(input.id);
    });
  });

  /* ── Form submission ─────────────────────────────────────── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus first error field
      const firstError = form.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Collect all radio button values properly
    const attendingRadio = form.querySelector('input[name="attending"]:checked');
    if (attendingRadio) data.attending = attendingRadio.value;
    const dinnerRadio = form.querySelector('input[name="dinner"]:checked');
    if (dinnerRadio) data.dinner = dinnerRadio.value;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showThankYou();
      } else {
        const result = await response.json();
        if (result.errors) {
          showFormError('There was an issue sending your RSVP. Please try again or contact us directly.');
        } else {
          showFormError('Something went wrong. Please try again.');
        }
        resetButton();
      }
    } catch (err) {
      showFormError('Unable to send your RSVP — please check your connection and try again, or contact us directly.');
      resetButton();
    }
  });

  function resetButton() {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send RSVP';
  }

  function showThankYou() {
    form.style.display = 'none';
    if (thankyou) {
      thankyou.classList.add('visible');
      thankyou.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function showFormError(message) {
    let errorBanner = document.getElementById('form-global-error');
    if (!errorBanner) {
      errorBanner = document.createElement('div');
      errorBanner.id = 'form-global-error';
      errorBanner.setAttribute('role', 'alert');
      errorBanner.style.cssText = [
        'background:#fff0ee',
        'border:1px solid #EAA8A8',
        'border-radius:8px',
        'padding:12px 16px',
        'font-size:0.875rem',
        'color:#8B2020',
        'margin-bottom:16px',
      ].join(';');
      form.prepend(errorBanner);
    }
    errorBanner.textContent = message;
  }

})();
