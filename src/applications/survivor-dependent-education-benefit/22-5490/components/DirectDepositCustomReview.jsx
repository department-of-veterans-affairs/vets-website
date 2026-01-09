import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { obfuscate, titleCase } from '../helpers';

const DirectDepositCustomReview = ({ formData, editPage }) => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const mebBankInfoConfirmationField = useToggleValue(
    TOGGLE_NAMES.mebBankInfoConfirmationField,
  );
  const bankAccount = formData?.['view:directDeposit']?.bankAccount || {};
  const {
    accountType,
    routingNumber,
    routingNumberConfirmation,
    accountNumber,
    accountNumberConfirmation,
  } = bankAccount;

  return (
    <div className="form-review-panel-page">
      <div
        className="form-review-panel-page-header-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          Review your direct deposit information
        </h4>
        <va-button
          aria-label="Edit your direct deposit information"
          secondary
          text="Edit"
          onClick={editPage}
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Account type</dt>
          <dd>{titleCase(accountType || 'Not provided')}</dd>
        </div>
        <div className="review-row">
          <dt>Bank routing number</dt>
          <dd>
            <span aria-hidden="true">{obfuscate(routingNumber)}</span>
            <span className="sr-only">
              Ending in {routingNumber?.slice(-4) || 'Not provided'}
            </span>
          </dd>
        </div>
        {mebBankInfoConfirmationField && (
          <div className="review-row">
            <dt>Confirm bank routing number</dt>
            <dd>
              <span aria-hidden="true">
                {obfuscate(routingNumberConfirmation)}
              </span>
              <span className="sr-only">
                Ending in{' '}
                {routingNumberConfirmation?.slice(-4) || 'Not provided'}
              </span>
            </dd>
          </div>
        )}
        <div className="review-row">
          <dt>Bank account number</dt>
          <dd>
            <span aria-hidden="true">{obfuscate(accountNumber)}</span>
            <span className="sr-only">
              Ending in {accountNumber?.slice(-4) || 'Not provided'}
            </span>
          </dd>
        </div>
        {mebBankInfoConfirmationField && (
          <div className="review-row">
            <dt>Confirm bank account number</dt>
            <dd>
              <span aria-hidden="true">
                {obfuscate(accountNumberConfirmation)}
              </span>
              <span className="sr-only">
                Ending in{' '}
                {accountNumberConfirmation?.slice(-4) || 'Not provided'}
              </span>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
};

DirectDepositCustomReview.propTypes = {
  editPage: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    'view:directDeposit': PropTypes.shape({
      bankAccount: PropTypes.shape({
        accountType: PropTypes.string,
        routingNumber: PropTypes.string,
        accountNumber: PropTypes.string,
      }),
    }),
  }).isRequired,
  formContext: PropTypes.shape({
    onReviewPage: PropTypes.bool,
  }),
};

const mapStateToProps = state => ({
  formData: state.form?.data,
  formContext: state.formContext,
});

export default connect(mapStateToProps)(DirectDepositCustomReview);
