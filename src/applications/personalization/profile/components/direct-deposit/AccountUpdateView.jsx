import React from 'react';
import { useDispatch } from 'react-redux';
import { saveDirectDeposit } from '../../actions/directDeposit';
import PaymentInformationEditError from './legacy/PaymentInformationEditError';

export const AccountUpdateView = ({ saveError = false }) => {
  const dispatch = useDispatch();

  const post = () => {
    const data = {
      controlInformation: {
        canUpdateDirectDeposit: true,
        isCorpAvailable: true,
        isEduClaimAvailable: true,
        isCorpRecFound: true,
        hasNoBdnPayments: true,
        hasIdentity: true,
        hasIndex: true,
        isCompetent: true,
        hasMailingAddress: true,
        hasNoFiduciaryAssigned: true,
        isNotDeceased: true,
        hasPaymentAddress: true,
      },
      paymentAccount: {
        name: 'BASE TEST - DIRECT DEPOSIT',
        accountType: 'CHECKING',
        accountNumber: '11111111',
        routingNumber: '2222222222222',
      },
    };

    dispatch(saveDirectDeposit(data));
  };

  return (
    <>
      <div>AccountUpdateView</div>
      <div id="direct-deposit-save-errors" role="alert" aria-atomic="true">
        {!!saveError && (
          <PaymentInformationEditError
            className="vads-u-margin-top--0 vads-u-margin-bottom--2"
            responseError={saveError}
          />
        )}
      </div>
      <button type="button" onClick={post}>
        post
      </button>
    </>
  );
};
