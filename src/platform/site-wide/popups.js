function openPopup(event) {
  event.preventDefault();
  window.open(
    this.href,
    '_blank',
    'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750',
  );
}

/**
 * Attaches onclick events to links that contain a data-popup attribute to open their HREF in a new window instead of tab.
 */
export function addPopupEventListeners() {
  const popupLinks = Array.from(
    document.querySelectorAll('a[href][data-popup]'),
  );
  for (const link of popupLinks) link.addEventListener('click', openPopup);
}

document.addEventListener('DOMContentLoaded', addPopupEventListeners);
