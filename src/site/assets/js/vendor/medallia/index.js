window.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const feedbackButtonContainer = document.getElementById('kampyleButtonContainer');

  function removeFeedbackButton() {
    feedbackButtonContainer.remove();
  }

  function appendFeedbackButton() {
    content.append(feedbackButtonContainer);
  }

  function updateFeedbackButtonInlineCss() {
    const feedbackButtonDiv = document.getElementById('nebula_div_btn');
    feedbackButtonDiv.style.zIndex = null;
    feedbackButtonDiv.style.position = null;
  }

  removeFeedbackButton();
  appendFeedbackButton();
  updateFeedbackButtonInlineCss();

  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true }; // attributes prolly can be false

  // Callback function to execute the feedback button is removed for the first time
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

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(detectButtonAdded);
  // Start observing the target node for configured mutations
  observer.observe(feedbackButtonContainer, config);
});
