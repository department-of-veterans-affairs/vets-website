import React from 'react';
import PropTypes from 'prop-types';
import PayeeInformationCard from '../components/PayeeInformationCard';
import { PAYEE_INFO_TITLE } from '../constants';

const PayeeInformationWrapper = ({
  applicantChapter,
  applicantName,
  loading,
}) => {
  // const applicantClaimNumber = "401512630"

  return (
    <div>
      <h2 className="vads-u-margin-y--4 vads-u-font-family--serif">
        {PAYEE_INFO_TITLE}
      </h2>
      <div
        className="vads-u-border-color--gray-lighter
                vads-u-color-gray-dark
                vads-u-display--flex
                vads-u-flex-direction--column
                vads-u-padding-y--1p5
                vads-u-border--1px
                vye-position-relative"
      >
        <PayeeInformationCard
          title="Payee Name"
          loading={loading}
          showAdditionalInformation
          applicantName={applicantName}
        />
        <span className="vye-top-border" />
        <PayeeInformationCard
          title={applicantChapter?.length > 1 ? 'Programs' : 'Program'}
          loading={loading}
          showAdditionalInformation={false}
          applicantChapter={applicantChapter}
        />
      </div>
    </div>
  );
};

PayeeInformationWrapper.propTypes = {
  applicantChapter: PropTypes.array,
  applicantName: PropTypes.string,
  loading: PropTypes.bool,
};
export default PayeeInformationWrapper;
