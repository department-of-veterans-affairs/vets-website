window.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const feedbackButtonContainer = document.getElementById('kampyleButtonContainer');
  const feedbackButton = document.getElementById('nebula_div_btn');

  // remove and append button container
  feedbackButtonContainer.remove();
  content.append(feedbackButtonContainer);

  // remove styles
  feedbackButton.style.zIndex = null;
  feedbackButton.style.position = null;
});