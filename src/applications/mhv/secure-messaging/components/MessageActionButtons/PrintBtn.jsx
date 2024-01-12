import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { PrintMessageOptions, DefaultFolders } from '../../util/constants';

const PrintBtn = props => {
  const [printOption, setPrintOption] = useState(null);
  const printButtonRef = useRef(null);
  const { activeFolder } = props;

  if (printOption !== null) {
    setPrintOption(null);
  }
  const handleConfirmPrint = async option => {
    setPrintOption(null);
    props.handlePrint(option);
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
        // On click should open window.print, modal tobe removed
        onClick={() => {
          handleConfirmPrint(PrintMessageOptions.PRINT_THREAD);
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
