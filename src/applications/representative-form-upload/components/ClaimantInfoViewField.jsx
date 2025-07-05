import React from 'react';
import PropTypes from 'prop-types';
import { mask, maskVaFileNumber } from '../helpers';

const ClaimantInfoViewField = props => {
  const formatDate = dateString => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${month}-${day}-${year}`;
  };

  const { formData, defaultEditButton } = props;

  const {
    veteranSsn,
    veteranFullName,
    address,
    veteranDateOfBirth,
    vaFileNumber,
    claimantSsn,
    claimantFullName,
    claimantDateOfBirth,
  } = formData;

  const isDependentClaim =
    claimantSsn &&
    claimantFullName?.first &&
    claimantFullName?.last &&
    claimantDateOfBirth;

  const veteranDisplay = {
    'First name': veteranFullName.first ? veteranFullName.first : '',
    'Last name': veteranFullName.last ? veteranFullName.last : '',
    'Date of birth': formatDate(veteranDateOfBirth),
    'Social Security Number': veteranSsn ? mask(veteranSsn) : '',
    'Postal code': address?.postalCode || '',
    'VA file number': vaFileNumber ? maskVaFileNumber(vaFileNumber) : '',
  };

  const claimantDisplay = isDependentClaim
    ? {
        'First name': claimantFullName.first,
        'Last name': claimantFullName.last,
        'Date of birth': formatDate(claimantDateOfBirth),
        'Social Security Number': claimantSsn ? mask(claimantSsn) : '',
      }
    : veteranDisplay;

  return (
    <div className="form-review-panel-page form-review-panel-page-representative-form-upload">
      <div className="form-review-panel-page-header-row vads-u-justify-content--space-between">
        <h4 className="vads-u-font-size--h5 vads-u-margin--0">
          Claimant information
        </h4>
        {defaultEditButton()}
        <dl className="review vads-u-margin-top--2 vads-u-width--full">
          {Object.entries(claimantDisplay).map(
            ([label, value]) =>
              value ? (
                <div
                  key={label}
                  className="review-row vads-u-display--flex vads-u-justify-content--space-between vads-u-padding-y--1 vads-u-width--full"
                >
                  <dt className="vads-u-font-weight--normal">{label}</dt>
                  <dd className="vads-u-font-weight--bold">{value}</dd>
                </div>
              ) : null,
          )}
        </dl>
      </div>

      {isDependentClaim && (
        <div className="form-review-panel-page-header-row vads-u-justify-content--flex-start">
          <h4 className="vads-u-font-size--h5 vads-u-margin-top--3 vads-u-margin-bottom--0">
            Veteran identification information
          </h4>
          <dl className="review vads-u-margin-top--2 vads-u-width--full">
            {Object.entries(veteranDisplay).map(
              ([label, value]) =>
                value ? (
                  <div
                    key={label}
                    className="review-row vads-u-display--flex vads-u-justify-content--space-between vads-u-padding-y--1 vads-u-width--full"
                  >
                    <dt className="vads-u-font-weight--normal">{label}</dt>
                    <dd className="vads-u-font-weight--bold">{value}</dd>
                  </div>
                ) : null,
            )}
          </dl>
        </div>
      )}
    </div>
  );
};

ClaimantInfoViewField.propTypes = {
  formData: PropTypes.shape({
    veteranSsn: PropTypes.string,
    veteranFullName: PropTypes.shape({
      first: PropTypes.string,
      last: PropTypes.string,
    }),
    address: PropTypes.shape({
      postalCode: PropTypes.string,
    }),
    veteranDateOfBirth: PropTypes.string,
    vaFileNumber: PropTypes.string,
    claimantSsn: PropTypes.string,
    claimantFullName: PropTypes.shape({
      first: PropTypes.string,
      last: PropTypes.string,
    }),
    claimantDateOfBirth: PropTypes.string,
  }).isRequired,
};

export default ClaimantInfoViewField;
