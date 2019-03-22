/*
Open share links in a new modal window
*/

export function openShareLink(shareLinks) {
  const hasNavigatorShare = navigator.share !== undefined;
  const metaTitle = document.querySelector("meta[name='title']");
  const metaDescription = document.querySelector("meta[name='description']");
  const metaUrl = document.querySelector("meta[property='og:url']");

  shareLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
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
            title: metaTitle ? metaTitle.content : '',
            text: metaDescription ? metaDescription.content : '',
            url: metaUrl ? metaUrl.content : '',
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.error('Share failed', err);
            document.location.assign(link.href);
          });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const shareLinks = Array.from(document.querySelectorAll('.va-js-share-link'));
  if (shareLinks.length > 0) {
    openShareLink(shareLinks);
  }
});
