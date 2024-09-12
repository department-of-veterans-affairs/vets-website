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
            innerText: `va-button {display:none}`,
          }),
        );
      });
      observer.observe(document, { childList: true, subtree: true });
      return () => {
        observer.disconnect();
      };
    }
    return undefined;
  }, []);
  return (
    <div className="omb-info-custom-class omb-info--container vads-u-margin-bottom--3">
      <va-omb-info
        exp-date="03/31/2026"
        omb-number="2900-0465"
        res-burden={2}
      />
    </div>
  );
};

export default VaOmbInfo;
