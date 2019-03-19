/*
Open share links in a new modal window
*/

export function openShareLink() {
  const shareLinks = document.querySelectorAll('.va-js-share-link');
  shareLinks.forEach(link => {
    link.addEventListener('click', event => {
      window.open(
        link.href,
        'social_popup',
        'left=20,top=20,width=700,height=500,toolbar=0,menubar=0,resizable=0',
      );
      event.preventDefault();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  openShareLink();
});
