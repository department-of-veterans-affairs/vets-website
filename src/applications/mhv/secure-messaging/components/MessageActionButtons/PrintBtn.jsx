import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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

  const handleOnChangePrintOption = e => {
    setPrintOption(e.target.value);
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
          visible={isModalVisible}
        >
          <div className="modal-body">
            <p>
              Would you like to print this one message, or all messages in this
              conversation?
            </p>
            <div className="form-radio-buttons">
              <div className="radio-button">
                <input
                  data-testid="radio-button"
                  type="radio"
                  autoComplete="false"
                  name="defaultName"
                  value="this message"
                  onChange={handleOnChangePrintOption}
                />
                <label name="defaultName-0-label" htmlFor="this-message">
                  Only print this message
                </label>
                <input
                  type="radio"
                  autoComplete="false"
                  name="defaultName"
                  value="all messages"
                  onChange={handleOnChangePrintOption}
                />
                <label name="defaultName-0-label" htmlFor="all-messages">
                  Print all messages in this conversation{' '}
                  <span className="message-count">
                    ({messageThreadCount.current} messages)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </VaModal>
      </div>
    );
  };

  return (
    <>
      <button
        data-testid="print-button"
        type="button"
        className="message-action-button"
        onClick={openModal}
      >
        <i className="fas fa-print" aria-hidden="true" />
        <span className="message-action-button-text">Print</span>
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
