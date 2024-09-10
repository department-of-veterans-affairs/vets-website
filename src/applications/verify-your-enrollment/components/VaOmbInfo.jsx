import React, { useEffect } from 'react';

const VaOmbInfo = () => {
  useEffect(() => {
    const shadowHost = document.querySelector(
      '.omb-info-custom-class va-omb-info',
    );

    if (shadowHost) {
      const observer = new MutationObserver(() => {
        const { shadowRoot } = shadowHost;
        shadowRoot.append(
          Object.assign(document.createElement('STYLE'), {
            innerText: `va-button {display:none} div{font-weight: bold} div strong{font-weight: normal}
                                                      `,
          }),
        );
        if (shadowRoot) {
          const firstDiv = shadowRoot.querySelector('div strong');

          if (firstDiv) {
            firstDiv.innerText = '1 minute';
            observer.disconnect();
          }
        }
      });
      observer.observe(document, { childList: true, subtree: true });
      return () => {
        observer.disconnect();
      };
    }
    return undefined;
  }, []);
  return (
    <div
      className="omb-info-custom-class omb-info--container vads-u-margin-bottom--3"
      style={{ paddingLeft: '0px' }}
    >
      <va-omb-info
        exp-date="03/31/2026"
        omb-number="2900-0465"
        res-burden={1}
      />
    </div>
  );
};

export default VaOmbInfo;
