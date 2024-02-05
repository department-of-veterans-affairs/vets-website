import React from 'react';
import PayeeInformationCard from '../components/PayeeInformationCard';
import { PAYEE_INFO_TITLE } from '../constants';
import { useData } from '../hooks/useData';

const PayeeInformationWrapper = () => {
  const applicantName = 'Ronald Gary';
  const { indicator: applicantChapter } = useData();

  // const applicantClaimNumber = "401512630"

  return (
    <div>
      <p className="vads-u-font-size--h2 vads-u-font-family--serif vads-u-font-weight--bold">
        {PAYEE_INFO_TITLE}
      </p>
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
          showAdditionalInformation
          applicantName={applicantName}
        />
        <span className="vye-top-border" />
        <PayeeInformationCard
          title="Program"
          showAdditionalInformation={false}
          applicantChapter={applicantChapter}
        />
      </div>
    </div>
  );
};

export default PayeeInformationWrapper;
