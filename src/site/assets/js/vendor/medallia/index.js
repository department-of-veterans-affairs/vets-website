window.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  const feedbackButtonContainer = document.getElementById('kampyleButtonContainer');

  const updateFeedbackButtonInlineCss = () => {
    const feedbackButtonDiv = document.getElementById('nebula_div_btn');
    feedbackButtonDiv.style.zIndex = null;
    feedbackButtonDiv.style.position = null;
  }

  const detectButtonAdded = function(mutationsList) {
    mutationsList.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.id === 'nebula_div_btn') {
            updateFeedbackButtonInlineCss()
          }
        });
      }
    });
  };

  feedbackButtonContainer.remove();
  main.append(feedbackButtonContainer);
  updateFeedbackButtonInlineCss();
  
  const observer = new MutationObserver(detectButtonAdded)
  const observeConfig = { attributes: false, childList: true };
  observer.observe(feedbackButtonContainer, observeConfig);
});
