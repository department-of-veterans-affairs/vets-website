import React from 'react';
import PropTypes from 'prop-types';
import {
  SEPARATION_PAY_TITLE,
  SEPARATION_PAY_BRANCH_TITLE,
  SEPARATION_PAY_DATE_TITLE,
  SEPARATION_PAY_SECTION_TITLE,
  YES,
  NO,
} from '../../constants';

const ConfirmationSeparationPay = ({ formData }) => {
  const separationPayDetails = formData['view:separationPayDetails'];
  const separationPayBranch = separationPayDetails?.separationPayBranch;
  const separationPayDate = separationPayDetails?.separationPayDate;

  const hasSeparationPayBranch =
    separationPayBranch && separationPayBranch.length > 0;
  const hasSeparationPayDate =
    separationPayDate && separationPayDate.length > 0;

  return (
    <li>
      <h4>{SEPARATION_PAY_SECTION_TITLE}</h4>
      <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
        <li>
          <div className="vads-u-color--gray">{SEPARATION_PAY_TITLE}</div>
          <div>{formData.hasSeparationPay ? YES : NO}</div>
        </li>
        {hasSeparationPayDate && (
          <li>
            <div className="vads-u-color--gray">
              {SEPARATION_PAY_DATE_TITLE}
            </div>
            <div>{separationPayDate}</div>
          </li>
        )}
        {hasSeparationPayBranch && (
          <li>
            <div className="vads-u-color--gray">
              {SEPARATION_PAY_BRANCH_TITLE}
            </div>
            <div>{separationPayBranch}</div>
          </li>
        )}
      </ul>
    </li>
  );
};

ConfirmationSeparationPay.propTypes = {
  formData: PropTypes.shape({
    hasSeparationPay: PropTypes.bool.isRequired,
    'view:separationPayDetails': PropTypes.shape({
      'view:separationPayDetailsDescription': PropTypes.object,
      separationPayDate: PropTypes.string,
      separationPayBranch: PropTypes.string,
    }),
  }).isRequired,
};

export default ConfirmationSeparationPay;
