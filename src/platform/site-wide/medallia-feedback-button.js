window.addEventListener('DOMContentLoaded', () => {
  /**
   * Update comments
   */
  const body = document.querySelector('body');
  const main = document.querySelector('main');
  const observeConfig = { attributes: false, childList: true };
  let feedbackButtonContainer;

  /**
   * Update comments
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
             * Update comments
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
