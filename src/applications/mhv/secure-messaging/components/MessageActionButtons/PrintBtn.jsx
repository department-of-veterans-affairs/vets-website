import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';
import { PrintMessageOptions, DefaultFolders } from '../../util/constants';
import { focusOnErrorField } from '../../util/formHelpers';

const PrintBtn = props => {
  const [printOption, setPrintOption] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [printSelectError, setPrintSelectError] = useState(null);
  const { activeFolder } = props;
  const messageThread = useSelector(
    state => state.sm.messageDetails.messageHistory,
  );
  const messageThreadCount = useMemo(
    () => {
      return messageThread?.length + 1; // +1 for the original message
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
    setPrintSelectError(null);
  };

  const handleOnChangePrintOption = ({ detail }) => {
    setPrintOption(detail.value);
    setPrintSelectError(
      detail.value ? null : 'Please select an option to print.',
    );
  };

  const handleConfirmPrint = async () => {
    if (printOption === null) {
      setPrintSelectError('Please select an option to print.');
      focusOnErrorField();
    } else {
      await closeModal();
      setPrintOption(null);
      props.handlePrint(printOption);
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
          data-testid="print-modal-popup"
          visible={isModalVisible}
        >
          <div>
            <VaRadio
              className="form-radio-buttons"
              enable-analytics
              error={printSelectError}
              onVaValueChange={handleOnChangePrintOption}
            >
              <VaRadioOption
                data-testid="radio-print-one-message"
                label="Print only this message"
                value={PrintMessageOptions.PRINT_THREAD}
                name="this-message"
              />

              <VaRadioOption
                data-testid="radio-print-all-messages"
                style={{ display: 'flex' }}
                aria-label={`Print all messages in this conversation (${messageThreadCount} messages)`}
                label="Print all messages in this conversation"
                description={`(${messageThreadCount} messages)`}
                value={PrintMessageOptions.PRINT_THREAD}
                name="all-messages"
              />
            </VaRadio>
          </div>
          <va-button text="Print" onClick={handleConfirmPrint} />
          <va-button secondary text="Cancel" onClick={closeModal} />
        </VaModal>
      </div>
    );
  };

  return (
    <>
      {/* TODO add GA event tracking Print button */}
      <button
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
