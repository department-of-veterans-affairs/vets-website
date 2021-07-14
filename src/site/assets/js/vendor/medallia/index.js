window.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const feedbackButtonContainer = document.getElementById('kampyleButtonContainer');

  const updateFeedbackButtonInlineCss = () => {
    const feedbackButtonDiv = document.getElementById('nebula_div_btn');
    feedbackButtonDiv.style.zIndex = null;
    feedbackButtonDiv.style.position = null;
  }

  const config = { attributes: false, childList: true };

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
  content.append(feedbackButtonContainer);
  updateFeedbackButtonInlineCss();
  new MutationObserver(detectButtonAdded).observe(feedbackButtonContainer, config);
});
