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
  };

  const handleConfirmPrint = () => {
    props.handlePrint(printOption);
    setPrintOption(null);
    closeModal();
  };

  const printModal = () => {
    return (
      <div className="message-actions-buttons-modal">
        <VaModal
          id="print-modal"
          large
          modalTitle="Print"
          onCloseEvent={closeModal}
          onPrimaryButtonClick={handleConfirmPrint}
          onSecondaryButtonClick={closeModal}
          primaryButtonText="Print"
          secondaryButtonText="Cancel"
          data-testid="print-modal-popup"
          visible={isModalVisible}
        >
          <div className="modal-body">
            <p>
              Would you like to print this one message, or all messages in this
              conversation?
            </p>
            <VaRadio
              className="form-radio-buttons"
              required
              enable-analytics
              // error={ // TODO: add error state}
              onRadioOptionSelected={handleOnChangePrintOption}
            >
              <VaRadioOption
                data-testid="radio-print-one-message"
                label="Only print this message"
                name="defaultName"
                value="this message"
              />

              <VaRadioOption
                data-testid="radio-print-all-messages"
                label={`Print all messages in this conversation (${
                  messageThreadCount.current
                } messages)`}
                name="defaultName"
                value="all messages"
              />
            </VaRadio>
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
        className="message-action-button left-button usa-button-secondary"
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
