import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import set from 'lodash/set';

// vap-svc deps
import * as VAP_SERVICE from '~/platform/user/profile/vap-svc/constants';
import { getProfileInfoFieldAttributes } from '~/platform/user/profile/vap-svc/util/getProfileInfoFieldAttributes';
import {
  updateCopyAddressModal,
  createTransaction,
} from '~/platform/user/profile/vap-svc/actions';
import { areAddressesEqual } from '~/platform/user/profile/vap-svc/util';
import {
  selectCopyAddressModal,
  selectVAPContactInfoField,
  selectVAPServiceTransaction,
} from '~/platform/user/profile/vap-svc/selectors';
import { isPendingTransaction } from '~/platform/user/profile/vap-svc/util/transactions';

// profile deps

// platform deps
import { focusElement } from '~/platform/utilities/ui';

import CopyAddressModalPrompt from './CopyAddressModalPrompt';
import CopyAddressModalSuccess from './CopyAddressModalSuccess';
import CopyAddressModalFailure from './CopyAddressModalFailure';

const CopyAddressModal = props => {
  const {
    mailingAddress = null,
    homeAddress,
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
      if (!homeAddress) {
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

  const overrideValidationKey = useSelector(
    state => state?.vapService?.addressValidation?.overrideValidationKey,
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

  const handlers = {
    onYes() {
      const payload = convertCleanDataToPayload(homeAddress, mailingFieldName);

      // make sure we are sending correct id in payload, or empty string if no mailing address for user
      const payloadWithUpdatedId = set(payload, 'id', mailingAddress?.id || '');

      if (overrideValidationKey) {
        payloadWithUpdatedId.overrideValidationKey = overrideValidationKey;
      }

      const method = payloadWithUpdatedId.id ? 'PUT' : 'POST';

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
        payloadWithUpdatedId,
        analyticsSectionName,
      );
    },
    onCloseModal() {
      updateCopyAddressModalAction(null);
      focusElement('#home-address [data-testid=update-success-alert]');
    },
    onCloseSuccessModal() {
      updateCopyAddressModalAction(null);
      focusElement('#mailing-address [data-testid=update-success-alert]');
    },
    onCloseFailureModal() {
      updateCopyAddressModalAction(null);
      focusElement('#mailing-address [data-testid=vap-service-error-alert]');
    },
  };

  // TODO: make this logic for showing the modal more straightforward
  return (
    <>
      {(copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.PROMPT ||
        copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.PENDING) && (
        <CopyAddressModalPrompt
          isLoading={isLoading}
          homeAddress={homeAddress}
          mailingAddress={mailingAddress}
          onClose={handlers.onCloseModal}
          onYes={handlers.onYes}
          visible
        />
      )}
      {copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.SUCCESS && (
        <CopyAddressModalSuccess
          address={homeAddress}
          onClose={handlers.onCloseSuccessModal}
          visible
        />
      )}
      {copyAddressModal === VAP_SERVICE.COPY_ADDRESS_MODAL_STATUS.FAILURE && (
        <CopyAddressModalFailure
          onClose={handlers.onCloseFailureModal}
          visible
        />
      )}
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
