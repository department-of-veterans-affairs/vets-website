window.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  const feedbackButtonContainer = document.getElementById(
    'kampyleButtonContainer',
  );

  const detectButtonAdded = function(mutationsList) {
    mutationsList.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.id === 'nebula_div_btn') {
            document.getElementById('nebula_div_btn').focus();
          }
        });
      }
    });
  };

  feedbackButtonContainer.remove();
  main.append(feedbackButtonContainer);

  const observer = new MutationObserver(detectButtonAdded);
  const observeConfig = { attributes: false, childList: true };
  observer.observe(feedbackButtonContainer, observeConfig);
});
