import React from 'react';
import PropTypes from 'prop-types';

const ClaimantInfoViewField = props => {
  const formatDate = dateString => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${month}-${day}-${year}`;
  };

  const { formData } = props;

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
    'Full name':
      veteranFullName.first && veteranFullName.last
        ? `${veteranFullName.first} ${veteranFullName.last}`
        : '',
    'Date of birth': formatDate(veteranDateOfBirth),
    'Social Security Number': veteranSsn
      ? veteranSsn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')
      : '',
    'Postal code': address?.postalCode || '',
    'VA file number': vaFileNumber || '',
  };

  const claimantDisplay = isDependentClaim
    ? {
        'Full name': `${claimantFullName.first} ${claimantFullName.last}`,
        'Date of birth': formatDate(claimantDateOfBirth),
        'Social Security Number': claimantSsn.replace(
          /(\d{3})(\d{2})(\d{4})/,
          '$1-$2-$3',
        ),
      }
    : veteranDisplay;

  return (
    <div className="form-review-panel-page form-review-panel-page-representative-form-upload">
      <div className="form-review-panel-page-header-row vads-u-justify-content--flex-start">
        <h4 className="vads-u-font-size--h5 vads-u-margin--0">
          Claimant Information
        </h4>
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
            Veteran Information
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
