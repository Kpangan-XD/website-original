// ========================================
// FORM VALIDATION
// ========================================

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

const validators: Record<string, ValidationRule[]> = {
  name: [
    { test: v => v.trim().length >= 2, message: 'Name must be at least 2 characters' },
    { test: v => v.trim().length <= 100, message: 'Name must be less than 100 characters' },
  ],
  email: [
    { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Enter a valid email address' },
  ],
  subject: [
    { test: v => v !== '', message: 'Please select a subject' },
  ],
  message: [
    { test: v => v.trim().length >= 10, message: 'Message must be at least 10 characters' },
    { test: v => v.trim().length <= 5000, message: 'Message must be less than 5000 characters' },
  ],
  age: [
    { test: v => v === '' || (parseInt(v, 10) >= 1 && parseInt(v, 10) <= 120), message: 'Age must be between 1 and 120' },
  ],
};

function showError(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, message: string): void {
  const errorId = `${input.id}-error`;
  const errorEl = document.getElementById(errorId);
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', errorId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }
  input.classList.add('border-error');
}

function clearError(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
  const errorId = `${input.id}-error`;
  const errorEl = document.getElementById(errorId);
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }
  input.classList.remove('border-error');
}

function validateField(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): boolean {
  const rules = validators[input.name];
  if (!rules) return true;

  for (const rule of rules) {
    if (!rule.test(input.value)) {
      showError(input, rule.message);
      return false;
    }
  }
  clearError(input);
  return true;
}

export function initFormValidation(): void {
  const forms = document.querySelectorAll<HTMLFormElement>('form[novalidate]');

  forms.forEach(form => {
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      'input[required], textarea[required], select[required], input:not([type="submit"]):not([type="reset"]), textarea, select'
    );

    // Blur validation
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.hasAttribute('aria-invalid')) validateField(input);
      });
    });

    // Submit handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      let firstInvalid: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null = null;

      inputs.forEach(input => {
        if (!validateField(input) && !firstInvalid) {
          isValid = false;
          firstInvalid = input;
        }
      });

      if (!isValid) {
        (firstInvalid as unknown as HTMLElement)?.focus();
        return;
      }

      // Show loading state
      const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/></svg> Sending...';
      }

      // Submit to API endpoint
      const statusEl = document.getElementById('form-status') || document.getElementById('demo-form-status');
      const formData = new FormData(form);

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          if (statusEl) {
            statusEl.className = 'alert alert-success';
            statusEl.classList.remove('hidden');
            statusEl.textContent = result.message || 'Message sent successfully! We will get back to you soon.';
          }
          form.reset();
          inputs.forEach(input => clearError(input));
        } else {
          throw new Error(result.error || 'Failed to send message');
        }
      } catch (error: any) {
        if (statusEl) {
          statusEl.className = 'alert alert-error';
          statusEl.classList.remove('hidden');
          statusEl.textContent = error.message || 'Failed to send message. Please try again.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message';
        }

        // Reset status after 5s
        if (statusEl) {
          setTimeout(() => {
            statusEl.classList.add('hidden');
            statusEl.textContent = '';
          }, 5000);
        }
      }
    });

    // Reset handler
    form.addEventListener('reset', () => {
      inputs.forEach(input => clearError(input));
      const statusEl = document.getElementById('form-status') || document.getElementById('demo-form-status');
      if (statusEl) {
        statusEl.classList.add('hidden');
        statusEl.textContent = '';
      }
    });
  });
}