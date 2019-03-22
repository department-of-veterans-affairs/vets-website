/**
 * Prepends sms to special use case text number.
 */
export function smsPrepend() {
  if (document.getElementById('expandable_text-3533-content')) {
    if (document.querySelectorAll('a[href="838255"]')) {
      const subject = document.querySelectorAll('a[href="838255"]');
      subject[0].href = 'sms:838255';
    }
  }
}

document.addEventListener('DOMContentLoaded', smsPrepend);
