import React from 'react';
import PropTypes from 'prop-types';
import { mask, maskVaFileNumber } from '../helpers';

const ITFClaimantInfoViewField = props => {
  const formatDate = dateString => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${month}-${day}-${year}`;
  };

  const formatBenefitType = benefitType => {
    if (benefitType === 'compensation') {
      return 'Disability compensation';
    }
    if (benefitType === 'pension') {
      return 'Pension';
    }
    if (benefitType === 'survivor') {
      return 'Survivors pension and/or dependency and indemnity compensation (DIC)';
    }
    return null;
  };

  const { formData, defaultEditButton } = props;

  const {
    veteranSsn,
    veteranFullName,
    veteranDateOfBirth,
    vaFileNumber,
    claimantSsn,
    claimantFullName,
    claimantDateOfBirth,
    benefitType,
    isVeteran,
  } = formData;

  const isDependentClaim = isVeteran === 'no';

  const veteranDisplay = {
    'First name': veteranFullName.first ? veteranFullName.first : '',
    'Last name': veteranFullName.last ? veteranFullName.last : '',
    'Social Security number': veteranSsn ? mask(veteranSsn) : '',
    'Date of birth': formatDate(veteranDateOfBirth),
    'VA file number': vaFileNumber ? maskVaFileNumber(vaFileNumber) : '',
    'Select the benefit you intend to file a claim for': formatBenefitType(
      benefitType,
    ),
  };

  const claimantDisplay = isDependentClaim
    ? {
        'First name': claimantFullName.first,
        'Last name': claimantFullName.last,
        'Social Security number': claimantSsn ? mask(claimantSsn) : '',
        'Date of birth': formatDate(claimantDateOfBirth),
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

ITFClaimantInfoViewField.propTypes = {
  formData: PropTypes.shape({
    veteranSsn: PropTypes.string,
    veteranFullName: PropTypes.shape({
      first: PropTypes.string,
      last: PropTypes.string,
    }),
    veteranDateOfBirth: PropTypes.string,
    vaFileNumber: PropTypes.string,
    claimantSsn: PropTypes.string,
    claimantFullName: PropTypes.shape({
      first: PropTypes.string,
      last: PropTypes.string,
    }),
    claimantDateOfBirth: PropTypes.string,
    benefitType: PropTypes.string,
    isVeteran: PropTypes.oneOf(['yes', 'no']),
  }).isRequired,
  defaultEditButton: PropTypes.func,
};

export default ITFClaimantInfoViewField;
