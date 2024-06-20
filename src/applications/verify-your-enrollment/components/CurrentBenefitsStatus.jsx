import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Paragraph } from '../constants';

const CurrentBenefitsStatus = ({
  updated,
  remainingBenefits,
  expirationDate,
  link,
}) => {
  const response = useSelector(state => state.personalInfo);
  if (response?.error?.error === 'Forbidden') return null;
  return (
    <div className="vads-u-margin-top--5">
      <va-card>
        <span className="usa-label">UPDATED {updated}</span>
        <h2 className="vads-u-font-size--lg vads-u-font-family--serif vads-u-margin-top--2">
          Current benefits status
        </h2>
        <div>
          <Paragraph title=" Remaining benefits" date={remainingBenefits} />
          <Paragraph
            title=" Expiration date"
            date={expirationDate}
            className="vads-u-margin-top--neg2"
          />
        </div>
        <p className="vads-u-font-weight--normal vads-u-font-family--sans text-color">
          Benefits end 10 years from the date of your last discharge or release
          from active duty.
        </p>
        {link && <>{link()}</>}
      </va-card>
    </div>
  );
};

CurrentBenefitsStatus.propTypes = {
  expirationDate: PropTypes.string,
  link: PropTypes.func,
  remainingBenefits: PropTypes.string,
  updated: PropTypes.string,
};

export default CurrentBenefitsStatus;
