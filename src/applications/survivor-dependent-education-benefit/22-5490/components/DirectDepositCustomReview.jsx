import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { obfuscate, titleCase } from '../helpers';

const DirectDepositCustomReview = ({ formData, editPage }) => {
  const bankAccount = formData?.['view:directDeposit']?.bankAccount || {};
  const { accountType, routingNumber, accountNumber } = bankAccount;

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
      <p className="vads-u-margin-bottom--2">
        <strong>Note:</strong> We make payments only through direct deposit,
        also called electronic funds transfer (EFT).
      </p>
      <dl className="review">
        <div className="review-row">
          <dt>Account type</dt>
          <dd>{titleCase(accountType) || 'Not provided'}</dd>
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
        <div className="review-row">
          <dt>Bank account number</dt>
          <dd>
            <span aria-hidden="true">{obfuscate(accountNumber)}</span>
            <span className="sr-only">
              Ending in {accountNumber?.slice(-4) || 'Not provided'}
            </span>
          </dd>
        </div>
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
  title: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(mapStateToProps)(DirectDepositCustomReview);
