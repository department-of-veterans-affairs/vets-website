import React, { useRef, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { nanoid } from 'nanoid';
import ChildrenDetails from './ChildrenDetails';

const getUuid = nanoidImp => {
  try {
    return nanoidImp();
  } catch (e) {
    return (
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .substring(2)
    );
  }
};

const DevToolsPanel = ({ devToolsData, show, setShow, panel, children }) => {
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
        <div className={classes} data-testid="devtools-panel">
          <div className="devtools-panel__content">
            <button
              type="button"
              className="devtools-panel__close-button"
              onClick={handlers.close}
            >
              <i className="fas fa-times" />
            </button>

            <va-accordion
              disable-analytics={{
                value: 'true',
              }}
              section-heading={{
                value: 'Details',
              }}
              uswds={{
                value: 'false',
              }}
            >
              <va-accordion-item>
                <h6 slot="headline">devToolsData</h6>
                <pre>{JSON.stringify(devToolsData, null, 2)}</pre>
              </va-accordion-item>
              {children && (
                <va-accordion-item header="children">
                  <ChildrenDetails>{children}</ChildrenDetails>
                </va-accordion-item>
              )}
            </va-accordion>
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
          <va-accordion
            disable-analytics={{
              value: 'true',
            }}
            section-heading={{
              value: 'Details',
            }}
            uswds={{
              value: 'false',
            }}
          >
            {devToolsData && (
              <va-accordion-item>
                <h6 slot="headline">devToolsData</h6>
                <pre>{JSON.stringify(devToolsData, null, 2)}</pre>
              </va-accordion-item>
            )}
            {children && (
              <va-accordion-item header="children">
                <ChildrenDetails>{children}</ChildrenDetails>
              </va-accordion-item>
            )}
          </va-accordion>
        </VaModal>
      )}
    </>
  );
};

export const DevToolsLoader = ({
  devToolsData,
  panel,
  children,
  nanoidImp = nanoid,
}) => {
  const [show, setShow] = useState(false);

  const uuid = useRef(getUuid(nanoidImp));

  const updatePanel = useCallback(event => {
    if (event.detail.uuid === uuid.current) {
      setShow(true);
      return;
    }

    if (event.detail.closeAll) {
      setShow(false);
      return;
    }

    setShow(false);
  }, []);

  const handlers = {
    togglePanel: () => {
      document.dispatchEvent(
        new CustomEvent('devToolsPanelUpdate', {
          detail: { devToolsData, uuid: uuid.current },
        }),
      );
    },
  };

  useEffect(
    () => {
      document.addEventListener('devToolsPanelUpdate', updatePanel);

      return () => {
        document.removeEventListener('devToolsPanelUpdate', updatePanel);
      };
    },
    [updatePanel],
  );

  return (
    <div className="devtools-container">
      <button
        type="button"
        className="devtools-show-button vads-u-background-color--primary vads-u-color--white"
        onClick={handlers.togglePanel}
      >
        <i className="fas fa-code" />
      </button>
      {show && (
        <>
          <DevToolsPanel
            devToolsData={devToolsData}
            show={show}
            setShow={setShow}
            panel={panel}
          >
            {children}
          </DevToolsPanel>
        </>
      )}
    </div>
  );
};

export default DevToolsLoader;
