import React from 'react';
import PropTypes from 'prop-types';
import Paragraph from './ui/Paragraph';

const CurrentBenefitsStatus = ({
  updated,
  remainingBenefits,
  expirationDate,
  link,
}) => {
  return (
    <div className="vads-u-margin-top--5">
      <va-card>
        <span className="usa-label">UPDATED {updated}</span>
        <h3 className="vads-u-font-size--lg vads-u-font-family--serif vads-u-margin-top--2">
          Current Benefits Status
        </h3>
        <div>
          <Paragraph title=" Remaining Benefits" date={remainingBenefits} />
          <Paragraph
            title=" Expiration Date"
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
