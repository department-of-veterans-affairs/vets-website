import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// import AllMessagesInThread from '../AllMessagesInThread';

const PrintBtn = props => {
  const [printOption, setPrintOption] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    // if (printOption === 'this message') {
    props.handlePrint(printOption);
    // } else if (printOption === 'all messages') {
    //   // console.log('print option: ', printOption);
    // }
    closeModal();
  };

  const printModal = () => {
    return (
      <div className="message-actions-buttons-modal">
        <VaModal
          id="move-to-modal"
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
                  print all messages in this conversation
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
        type="button"
        className="message-action-button"
        onClick={openModal}
      >
        <i className="fas fa-print" />
        <span className="message-action-button-text">Print</span>
        {isModalVisible ? printModal() : null}
      </button>
    </>
  );
};

PrintBtn.propTypes = {
  handlePrint: PropTypes.func,
  id: PropTypes.number,
};

export default PrintBtn;
