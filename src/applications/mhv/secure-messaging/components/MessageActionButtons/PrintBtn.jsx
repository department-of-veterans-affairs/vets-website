import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';

const PrintBtn = props => {
  const [printOption, setPrintOption] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [printSelectError, setPrintSelectError] = useState(null);
  const messageThread = useSelector(
    state => state.sm.messageDetails.messageHistory,
  );
  const messageThreadCount = useRef(1);
  useEffect(
    () => {
      if (messageThread?.length > 0) {
        messageThread.forEach(() => {
          messageThreadCount.current += 1;
        });
      }
    },
    [messageThread],
  );

  if (isModalVisible === false && printOption !== null) {
    setPrintOption(null);
  }

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleOnChangePrintOption = ({ target }) => {
    setPrintOption(target.value);
    setPrintSelectError(
      target.value ? null : 'Please select an option to print.',
    );
  };

  const handleConfirmPrint = () => {
    if (printOption === null) {
      setPrintSelectError('Please select an option to print.');
    } else {
      props.handlePrint(printOption);
      setPrintOption(null);
      closeModal();
    }
  };

  const printModal = () => {
    return (
      <div className="message-actions-buttons-modal">
        <VaModal
          id="print-modal"
          large
          modalTitle="What do you want to print?"
          onCloseEvent={closeModal}
          onPrimaryButtonClick={handleConfirmPrint}
          onSecondaryButtonClick={closeModal}
          primaryButtonText="Print"
          secondaryButtonText="Cancel"
          data-testid="print-modal-popup"
          visible={isModalVisible}
        >
          <div className="modal-body">
            <VaRadio
              className="form-radio-buttons"
              enable-analytics
              error={printSelectError}
              onRadioOptionSelected={handleOnChangePrintOption}
            >
              <VaRadioOption
                data-testid="radio-print-one-message"
                label="Print only this message"
                name="this-message"
                value="this message"
              />

              <VaRadioOption
                data-testid="radio-print-all-messages"
                style={{ display: 'flex' }}
                aria-label={`Print all messages in this conversation (${
                  messageThreadCount.current
                } messages)`}
                label="Print all messages in this conversation"
                name="all-messages"
                value="all messages"
              />
            </VaRadio>
            <p>
              <strong>{`(${messageThreadCount.current} messages)`}</strong>
            </p>
          </div>
        </VaModal>
      </div>
    );
  };

  return (
    <>
      {/* TODO add GA event tracking Print button */}
      <button
        type="button"
        className="usa-button-secondary"
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
  handlePrint: PropTypes.func,
  id: PropTypes.number,
};

export default PrintBtn;
