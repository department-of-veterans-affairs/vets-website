import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const getUuid = () => {
  try {
    return crypto.randomUUID();
  } catch (e) {
    return (
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .substring(2)
    );
  }
};

const DevToolsPanel = ({ devToolsData, show, setShow, panel }) => {
  const classes = classNames({
    'devtools-panel': true,
    'devtools-panel--hidden': !show,
    'devtools-panel--shown': show,
    'vads-u-background-color--gray-lightest': true,
  });

  const handlers = {
    close() {
      setShow(false);
      const devToolsPanelUpdate = new CustomEvent('devToolsPanelUpdate', {
        detail: { closeAll: true },
      });
      document.dispatchEvent(devToolsPanelUpdate);
    },
  };

  return (
    <>
      {panel ? (
        <div className={classes}>
          <div className="devtools-panel__content">
            <button
              type="button"
              className="devtools-panel__close-button"
              onClick={handlers.close}
            >
              <i className="fas fa-times" />
            </button>
            <pre>{JSON.stringify(devToolsData, null, 2)}</pre>
          </div>
        </div>
      ) : (
        <VaModal
          large
          modalTitle="Dev Tools"
          onCloseEvent={handlers.close}
          onPrimaryButtonClick={function noRefCheck() {}}
          onSecondaryButtonClick={handlers.close}
          primaryButtonText="Copy to clipboard"
          secondaryButtonText="Close"
          visible
          clickToClose
        >
          <pre>{JSON.stringify(devToolsData, null, 2)}</pre>
        </VaModal>
      )}
    </>
  );
};

export const DevToolsLoader = ({
  devToolsData = { error: 'no data provided to devtools instance' },
  panel,
}) => {
  const [show, setShow] = useState(false);

  const uuid = useRef(getUuid());

  document.addEventListener('devToolsPanelUpdate', event => {
    if (event.detail.uuid === uuid) {
      setShow(true);
      return;
    }

    if (event.detail.closeAll) {
      setShow(false);
      return;
    }
    setShow(false);
  });

  const handlers = {
    togglePanel: () => {
      document.dispatchEvent(
        new CustomEvent('devToolsPanelUpdate', {
          detail: { devToolsData, uuid },
        }),
      );
    },
  };

  return (
    <div className="devtools-container">
      <button
        type="button"
        className="devtools-show-button"
        onClick={handlers.togglePanel}
      >
        <i className="fas fa-code" />
      </button>
      {show && (
        <DevToolsPanel
          devToolsData={{ ...devToolsData, uuid }}
          show={show}
          setShow={setShow}
          panel={panel}
        />
      )}
    </div>
  );
};

export default DevToolsLoader;
