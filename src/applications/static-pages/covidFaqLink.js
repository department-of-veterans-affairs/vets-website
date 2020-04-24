import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

const insertLink = () => {
  const linkParagraph = document.createElement('p');
  linkParagraph.innerHTML =
    'You can also use our <a href="/coronavirus-chatbot/">VA coronavirus chatbot</a> to get answers to your questions.';
  const introText = document.querySelector('.va-introtext');

  // Insert the link after the intro text
  introText.parentNode.insertBefore(linkParagraph, introText.nextSibling);
};

export default function addLinkToCovidFAQ(store) {
  // Only add the link once
  let linkAdded = false;

  store.subscribe(() => {
    if (!linkAdded && toggleValues(store.getState()).covid19FaqChatbotLink) {
      insertLink();
      linkAdded = true;
    }
  });
}
