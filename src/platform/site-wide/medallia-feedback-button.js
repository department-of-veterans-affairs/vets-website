/**
 * Moves #kampyleButtonContainer (the container for the Feedback button
 * powered by Medallia) from the end of <body> to the end of <main> so
 * that users can tab to it more quickly.
 * Before, users had to tab through all the links in the footer to get
 * to the button.
 * When the button is clicked on, #nebula_div_btn is removed from the DOM.
 * When the form is closed, it gets added back.
 * This script also adds a listener for when #nebula_div_btn is added
 * back and sets the focus on #kampyleButtonContainer again.
 */

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
