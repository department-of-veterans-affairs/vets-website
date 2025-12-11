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
  if (
    !response.personalInfo ||
    response?.error?.error === 'Forbidden' ||
    [
      response.personalInfo?.verificationRecord?.status,
      response.personalInfo?.status,
    ].includes(204)
  )
    return null;
  return (
    <div className="vads-u-margin-top--5">
      <va-card>
        <h2 className="vads-u-margin-top--0">
          <label className="usa-label vads-u-display--inline vads-u-font-size--sm vads-u-font-weight--normal">
            UPDATED {updated}
          </label>
          <br />
          <span className="vads-u-font-size--lg vads-u-font-family--serif vads-u-margin-top--2 vads-u-display--inline-block">
            Current benefits status
          </span>
        </h2>
        <Paragraph title=" Remaining benefits" date={remainingBenefits} />
        {expirationDate && (
          <>
            <Paragraph
              title="Delimiting date"
              date={expirationDate}
              className="vads-u-margin-top--neg2"
            />

            <p className="vads-u-font-weight--normal vads-u-font-family--sans text-color">
              Benefits end 10 years from the date of your last discharge or
              release from active duty.
            </p>
          </>
        )}
        {link && <>{link()}</>}
      </va-card>
    </div>
  );
};

CurrentBenefitsStatus.propTypes = {
  expirationDate: PropTypes.string,
  indicator: PropTypes.array,
  link: PropTypes.func,
  remainingBenefits: PropTypes.string,
  updated: PropTypes.string,
};

export default CurrentBenefitsStatus;
