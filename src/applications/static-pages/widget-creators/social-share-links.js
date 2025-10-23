/*
Open share links in a new modal window
*/

export default function openShareLink() {
  const shareLinks = Array.from(document.querySelectorAll('.va-js-share-link'));

  if (shareLinks.length > 0) {
    const hasNavigatorShare = navigator.share !== undefined;
    const metaTitle = document.querySelector('title').content;
    const metaDescriptionElement = document.querySelector(
      "meta[name='description']",
    );
    const metaDescription = metaDescriptionElement
      ? metaDescriptionElement.content
      : '';
    const metaUrl = document.querySelector("meta[property='og:url']").content;

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
              title: metaTitle,
              text: metaDescription,
              url: metaUrl,
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
}
