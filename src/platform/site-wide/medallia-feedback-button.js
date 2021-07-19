window.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  const feedbackButtonContainer = document.getElementById(
    'kampyleButtonContainer',
  );

  feedbackButtonContainer.remove();
  main.append(feedbackButtonContainer);
});
