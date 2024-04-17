import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { DefaultFolders } from '../../util/constants';

const PrintBtn = props => {
  const printButtonRef = useRef(null);
  const { activeFolder } = props;

  const handleConfirmPrint = () => {
    props.handlePrint();
    focusElement(printButtonRef.current);
  };

  return (
    <>
      {/* TODO add GA event tracking Print button */}
      <button
        ref={printButtonRef}
        id="print-button"
        type="button"
        className={`usa-button-secondary small-screen:${
          activeFolder?.folderId !== DefaultFolders.SENT.id
            ? 'vads-u-flex--3'
            : 'vads-l-row--3'
        } `}
        style={{ minWidth: '100px' }}
        onClick={() => {
          handleConfirmPrint();
        }}
      >
        <i
          className="fas fa-print vads-u-margin-right--0p5"
          aria-hidden="true"
        />
        <span className="message-action-button-text" data-testid="print-button">
          Print
        </span>
      </button>
    </>
  );
};

PrintBtn.propTypes = {
  activeFolder: PropTypes.object,
  handlePrint: PropTypes.func,
  id: PropTypes.number,
};

export default PrintBtn;
