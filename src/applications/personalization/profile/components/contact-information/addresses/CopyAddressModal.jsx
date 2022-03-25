/* eslint-disable va/prefer-web-component-library */
// having issues with the VaModal throwing errors
// TODO: use VaModal web-component

import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Modal from '@department-of-veterans-affairs/component-library/Modal';
import AddressView from '@@vap-svc/components/AddressField/AddressView';

import { updateCopyAddressModal, createTransaction } from '@@vap-svc/actions';

import * as VAP_SERVICE from '@@vap-svc/constants';

import { areAddressesEqual } from '@@vap-svc/util';

import {
  selectCopyAddressModal,
  selectVAPContactInfoField,
  selectVAPServiceTransaction,
} from '@@vap-svc/selectors';

import { profileShowAddressChangeModal } from '@@profile/selectors';
import { getProfileInfoFieldAttributes } from '@@profile/util/getProfileInfoFieldAttributes';

import { isPendingTransaction } from '@@vap-svc/util/transactions';

import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';

const CopyAddressModal = props => {
  const {
    mailingAddress = null,
    homeAddress,
    shouldProfileShowAddressChangeModal,
    transaction,
    transactionRequest,
    copyAddressModal,
    updateCopyAddressModalAction,
    createTransactionAction,
    mailingFieldName,
    apiRoute,
    convertCleanDataToPayload,
  } = props;

  const checkAddressAndPrompt = useCallback(
    () => {
      // TODO: handle home address update with no mailing address and show custom modal content
      if (!mailingAddress || !homeAddress) {
        updateCopyAddressModalAction(null);
        return;
      }

      const modalStatus = areAddressesEqual(mailingAddress, homeAddress)
        ? null
        : VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.PROMPT;

      updateCopyAddressModalAction(modalStatus);
    },
    [mailingAddress, homeAddress, updateCopyAddressModalAction],
  );

  useEffect(
    () => {
      if (copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.CHECKING) {
        checkAddressAndPrompt();
      }
    },
    [copyAddressModal, checkAddressAndPrompt],
  );

  const isLoading =
    transactionRequest?.isPending || isPendingTransaction(transaction);

  // const error =
  //   transactionRequest?.error || (isFailedTransaction(transaction) ? {} : null);

  const handlers = {
    onYes() {
      const payload = convertCleanDataToPayload(homeAddress, mailingFieldName);
      const method = payload.id ? 'PUT' : 'POST';
      const analyticsSectionName =
        VAP_SERVICE.ANALYTICS_FIELD_MAP[
          VAP_SERVICE.FIELD_NAMES.MAILING_ADDRESS
        ];

      updateCopyAddressModalAction(
        VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.PENDING,
      );

      createTransactionAction(
        apiRoute,
        method,
        mailingFieldName,
        payload,
        analyticsSectionName,
      );
    },
    onCloseModal() {
      updateCopyAddressModalAction(null);
    },
  };

  const CopyAddressMainModal = () => (
    <Modal
      title="We've updated your home address"
      visible={
        copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.PROMPT ||
        copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.PENDING
      }
      onClose={handlers.onCloseModal}
      id="copy-address-modal"
    >
      <>
        <p data-testid="modal-content">
          Your updated home address:
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={homeAddress} />
          </span>
        </p>
        <va-featured-content>
          We have this mailing address on file for you:
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={mailingAddress} />
          </span>
          Do you want to update your mailing address to match this home address?
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={homeAddress} />
          </span>
        </va-featured-content>

        <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
          <LoadingButton
            data-action="save-edit"
            data-testid="save-edit-button"
            isLoading={isLoading}
            loadingText="Saving changes"
            className="vads-u-margin-top--0"
            onClick={handlers.onYes}
          >
            Yes
          </LoadingButton>

          {!isLoading && (
            <button
              data-testid="cancel-edit-button"
              type="button"
              className="usa-button-secondary small-screen:vads-u-margin-top--0"
              onClick={handlers.onCloseModal}
            >
              No
            </button>
          )}
        </div>
      </>
    </Modal>
  );

  const UpdateErrorModal = () => (
    <Modal
      title="We can't update your mailing address"
      visible={
        copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.FAILURE
      }
      onClose={handlers.onCloseModal}
      status="error"
      primaryButton={{
        action: () => {
          handlers.onCloseModal();
        },
        text: 'Close',
      }}
    >
      <>
        <p data-testid="modal-content">
          We’re sorry. We can’t update your information right now. We’re working
          to fix this problem. Please check back later.
        </p>
      </>
    </Modal>
  );

  const UpdateSuccessModal = () => (
    <Modal
      title="We've updated your mailing address"
      visible={
        copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.SUCCESS
      }
      onClose={handlers.onCloseModal}
      primaryButton={{
        action: () => {
          handlers.onCloseModal();
        },
        text: 'Close',
      }}
    >
      <>
        <p data-testid="modal-content">
          We’ve updated your mailing address to match your home address.
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={homeAddress} />
          </span>
        </p>
      </>
    </Modal>
  );

  return (
    <>
      {(copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.PROMPT ||
        copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.PENDING) &&
        shouldProfileShowAddressChangeModal && <CopyAddressMainModal />}
      {copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.SUCCESS &&
        shouldProfileShowAddressChangeModal && <UpdateSuccessModal />}
      {copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.FAILURE &&
        shouldProfileShowAddressChangeModal && <UpdateErrorModal />}
    </>
  );
};

CopyAddressModal.propTypes = {
  apiRoute: PropTypes.string.isRequired,
  convertCleanDataToPayload: PropTypes.func.isRequired,
  createTransactionAction: PropTypes.func.isRequired,
  homeAddress: PropTypes.object.isRequired,
  mailingFieldName: PropTypes.string.isRequired,
  updateCopyAddressModalAction: PropTypes.func.isRequired,
  copyAddressModal: PropTypes.string,
  mailingAddress: PropTypes.object,
  shouldProfileShowAddressChangeModal: PropTypes.bool,
  transaction: PropTypes.object,
  transactionRequest: PropTypes.object,
};

export const mapStateToProps = state => {
  const mailingFieldName = VAP_SERVICE.FIELD_NAMES.MAILING_ADDRESS;

  const {
    apiRoute,
    convertCleanDataToPayload,
    uiSchema,
    formSchema,
    title,
  } = getProfileInfoFieldAttributes(mailingFieldName);

  const { transaction, transactionRequest } = selectVAPServiceTransaction(
    state,
    mailingFieldName,
  );

  return {
    mailingFieldName,
    analyticsSectionName: VAP_SERVICE.ANALYTICS_FIELD_MAP[mailingFieldName],
    apiRoute,
    convertCleanDataToPayload,
    uiSchema,
    formSchema,
    title,
    mailingAddress: selectVAPContactInfoField(state, mailingFieldName),
    homeAddress: selectVAPContactInfoField(
      state,
      VAP_SERVICE.FIELD_NAMES.RESIDENTIAL_ADDRESS,
    ),
    shouldProfileShowAddressChangeModal: profileShowAddressChangeModal(state),
    copyAddressModal: selectCopyAddressModal(state),
    transaction,
    transactionRequest,
  };
};

const mapDispatchToProps = {
  updateCopyAddressModalAction: updateCopyAddressModal,
  createTransactionAction: createTransaction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CopyAddressModal);
