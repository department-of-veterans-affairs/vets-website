import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';
import { PrintMessageOptions } from '../../util/constants';

const PrintBtn = props => {
  const [printOption, setPrintOption] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const messageThread = useSelector(
    state => state.sm.messageDetails.messageHistory,
  );
  const messageThreadCount = useMemo(
    () => {
      return messageThread.length + 1; // +1 for the original message
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
    setPrintOption(null);
    closeModal();
    props.handlePrint(printOption);
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
              // error={ // TODO: add error state}
              onRadioOptionSelected={handleOnChangePrintOption}
            >
              <VaRadioOption
                data-testid="radio-print-one-message"
                label="Print only this message"
                name="defaultName"
                value={PrintMessageOptions.PRINT_MAIN}
              />

              <VaRadioOption
                data-testid="radio-print-all-messages"
                style={{ display: 'flex' }}
                aria-label={`Print all messages in this conversation (${
                  messageThreadCount.current
                } messages)`}
                label="Print all messages in this conversation"
                name="defaultName"
                value={PrintMessageOptions.PRINT_THREAD}
              />
            </VaRadio>
            <p>
              <strong>{`(${messageThreadCount} messages)`}</strong>
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
