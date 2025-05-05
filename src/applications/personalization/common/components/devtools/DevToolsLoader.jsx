import React, { useRef, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const getUuid = nanoidImp => nanoidImp();

const normalizeData = data => {
  switch (typeof data) {
    case 'string':
    case 'object':
      return JSON.stringify(data, null, 2);
    default:
      return String(data);
  }
};

const DevToolsPanel = ({ devToolsData, show, setShow }) => {
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
    <div className={classes} data-testid="devtools-panel">
      <div className="devtools-panel__content">
        <VaButton
          onClick={handlers.close}
          text="close panel"
          data-testid="close-devtools-panel-button"
        />

        <h6>devToolsData</h6>
        <pre>{normalizeData(devToolsData)}</pre>
      </div>
    </div>
  );
};

DevToolsPanel.propTypes = {
  devToolsData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
  setShow: PropTypes.func,
  show: PropTypes.bool,
};

export const DevToolsLoader = ({ devToolsData, nanoidImp, showIcon }) => {
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

  useEffect(() => {
    document.addEventListener('devToolsPanelUpdate', updatePanel);

    return () => {
      document.removeEventListener('devToolsPanelUpdate', updatePanel);
    };
  }, [updatePanel]);

  return (
    <div className="devtools-container">
      {showIcon && (
        <button
          type="button"
          className="devtools-show-button vads-u-background-color--primary vads-u-color--white vads-u-width--auto"
          onClick={handlers.togglePanel}
        >
          <va-icon
            icon="code"
            size={3}
            srtext="open developer panel to view extra code information about this page"
          />
        </button>
      )}
      {show && (
        <>
          <DevToolsPanel
            devToolsData={devToolsData}
            show={show}
            setShow={setShow}
          />
        </>
      )}
    </div>
  );
};

DevToolsLoader.propTypes = {
  children: PropTypes.node,
  devToolsData: PropTypes.object,
  nanoidImp: PropTypes.func,
  showIcon: PropTypes.bool,
};

DevToolsLoader.defaultProps = {
  children: null,
  devToolsData: {},
  nanoidImp: nanoid,
  showIcon: true,
};

export default DevToolsLoader;
