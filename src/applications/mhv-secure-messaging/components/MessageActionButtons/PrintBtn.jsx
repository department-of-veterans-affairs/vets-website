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
        className={`usa-button-secondary vads-u-margin--0 ${
          activeFolder?.folderId !== DefaultFolders.SENT.id
            ? 'mobile-lg:vads-u-flex--3'
            : 'vads-u-flex--1 tablet:vads-u-flex--auto vads-u-margin-left--0 vads-u-margin-right--0'
        } vads-u-display--flex
        vads-u-flex-direction--row
        vads-u-justify-content--center
        vads-u-align-items--center
        vads-u-padding-x--2
        message-action-button`}
        onClick={() => {
          handleConfirmPrint();
        }}
        data-dd-action-name="Print Button"
      >
        <div className="vads-u-margin-right--0p5">
          <va-icon icon="print" aria-hidden="true" />
        </div>
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
