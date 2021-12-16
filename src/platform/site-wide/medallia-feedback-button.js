window.addEventListener('DOMContentLoaded', () => {
  /**
   * Moves #kampyleButtonContainer (the container for the Feedback button
   * powered by Medallia) from the end of <body> to the end of <main> so
   * that users can tab to it more quickly.
   * Before, users had to tab through all the links in the footer to get
   * to the button.
   */
  const body = document.querySelector('body');
  const main = document.querySelector('main');
  const observeConfig = { attributes: false, childList: true };
  let feedbackButtonContainer;

  /**
   * Set an observer to detect when #kampyleButtonContainer is added to
   * the DOM, then move it.
   */
  const bodyObserver = new MutationObserver(bodyMutationsList => {
    bodyMutationsList.forEach(bodyMutation => {
      if (bodyMutation.addedNodes.length > 0) {
        bodyMutation.addedNodes.forEach(bodyNode => {
          if (bodyNode.id === 'kampyleButtonContainer') {
            feedbackButtonContainer = document.getElementById(
              'kampyleButtonContainer',
            );
            feedbackButtonContainer.remove();
            main.append(feedbackButtonContainer);

            /**
             * When the Feedback button is clicked on, #nebula_div_btn is removed from the DOM.
             * When the form is closed, it is added back.
             * Set an observer to detect when #nebula_div_btn is added back then set the
             * focus on it again.
             */
            const buttonContainerObserver = new MutationObserver(
              buttonContainerMutationsList => {
                buttonContainerMutationsList.forEach(containerMutation => {
                  if (containerMutation.addedNodes.length > 0) {
                    containerMutation.addedNodes.forEach(containerNode => {
                      if (containerNode.id === 'nebula_div_btn') {
                        document.getElementById('nebula_div_btn').focus();
                      }
                    });
                  }
                });
              },
            );

            buttonContainerObserver.observe(
              feedbackButtonContainer,
              observeConfig,
            );
          }
        });
      }
    });
  });

  bodyObserver.observe(body, observeConfig);
});
