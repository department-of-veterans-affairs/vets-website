import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { PrintMessageOptions, DefaultFolders } from '../../util/constants';

const PrintBtn = props => {
  const [printOption, setPrintOption] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const printButtonRef = useRef(null);
  const { activeFolder } = props;

  if (isModalVisible === false && printOption !== null) {
    setPrintOption(null);
  }

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirmPrint = async option => {
    await closeModal();
    setPrintOption(null);
    props.handlePrint(option);
    focusElement(printButtonRef.current);
  };

  const printModal = () => {
    return (
      <div className="Print Modal message-actions-buttons-modal">
        <VaModal
          data-dd-action-name="Print Button"
          id="print-modal"
          modalTitle="Make sure you have all messages expanded"
          onCloseEvent={closeModal}
          data-testid="print-modal-popup"
          visible={isModalVisible}
        >
          <p>
            We can only print messages that you currently have expanded. If you
            don’t have all messages expanded, cancel this print request. Then
            select <strong>Expand all</strong> and print again.
          </p>

          <va-button
            data-dd-action-name="Confirm-Print-Button-in-Modal"
            text="Print"
            onClick={() => {
              handleConfirmPrint(PrintMessageOptions.PRINT_THREAD);
            }}
          />
          <va-button
            secondary
            text="Cancel"
            onClick={closeModal}
            data-dd-action-name="Cancel-Print-Button-in-Modal"
          />
        </VaModal>
      </div>
    );
  };

  return (
    <>
      {/* TODO add GA event tracking Print button */}
      <button
        ref={printButtonRef}
        type="button"
        className={`usa-button-secondary small-screen:${
          activeFolder?.folderId !== DefaultFolders.SENT.id
            ? 'vads-u-flex--3'
            : 'vads-l-row--3'
        } `}
        style={{ minWidth: '100px' }}
        onClick={openModal}
      >
        <i
          className="fas fa-print vads-u-margin-right--0p5"
          aria-hidden="true"
        />
        <span className="message-action-button-text" data-testid="print-button">
          Print
        </span>
      </button>
      {isModalVisible ? printModal() : null}
    </>
  );
};

PrintBtn.propTypes = {
  activeFolder: PropTypes.object,
  handlePrint: PropTypes.func,
  id: PropTypes.number,
};

export default PrintBtn;
