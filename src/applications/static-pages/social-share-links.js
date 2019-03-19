/*
Open share links in a new modal window
*/

export function openShareLink() {
  const shareLinks = document.querySelectorAll('.va-js-share-link');
  const hasNavigatorShare = navigator.share !== undefined;
  const metaTitle = document.querySelector("meta[name='title']").content;
  const metaDescription = document.querySelector("meta[name='description']")
    .content;

  shareLinks.forEach(link => {
    link.addEventListener('click', event => {
      if (!hasNavigatorShare) {
        // Desktop share
        window.open(
          link.href,
          'social_popup',
          'left=20,top=20,width=700,height=500,toolbar=0,menubar=0,status=0,location=0,resizable=0',
        );
      } else {
        // Android native share
        navigator
          .share({
            title: metaTitle,
            text: metaDescription,
            url: link.href,
          })
          .then(() => event.preventDefault())
          .catch(() => document.location.assign(link.href));
      }
      event.preventDefault();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  openShareLink();
});
