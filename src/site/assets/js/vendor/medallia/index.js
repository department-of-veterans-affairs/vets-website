window.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  const feedbackButtonContainer = document.getElementById('kampyleButtonContainer');

  const updateFeedbackButtonInlineCss = () => {
    const feedbackButtonDiv = document.getElementById('nebula_div_btn');
    feedbackButtonDiv.style.zIndex = null;
    feedbackButtonDiv.style.position = null;
  }

  const config = { attributes: false, childList: true }; // maybe i don't need this

  const detectButtonAdded = function(mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.id === 'nebula_div_btn') {
            updateFeedbackButtonInlineCss()
          }
        });
      }
    }
  };

  feedbackButtonContainer.remove();
  main.append(feedbackButtonContainer);
  updateFeedbackButtonInlineCss();
  const observer = new MutationObserver(detectButtonAdded)
  observer.observe(feedbackButtonContainer, config);
});
