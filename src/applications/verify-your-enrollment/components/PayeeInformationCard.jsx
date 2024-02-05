import React from 'react';
import PropTypes from 'prop-types';
import { howToChangeLegalNameInfoLink } from '../constants';
import { useData } from '../hooks/useData';

const PayeeInformationCard = ({
  title,
  showAdditionalInformation,
  applicantChapter = '',
  applicantClaimNumber = '',
}) => {
  const { fullName: applicantName } = useData();
  return (
    <div
      className="medium-screen:vads-u-padding--4"
      id="benefits-gi-bill-profile-statement"
    >
      <p className="vads-u-font-weight--bold">{title}</p>
      {showAdditionalInformation && (
        <>
          <p>{applicantName}</p>
          <va-additional-info
            trigger="How to update your legal name with the VA"
            class="vads-u-margin-bottom--4"
          >
            <p>
              If you’ve changed your legal name, you’ll need to tell us so we
              can change your name in our records.
            </p>
            <p>
              <a href={howToChangeLegalNameInfoLink}>
                Learn how to change your legal name on file with VA.
              </a>
            </p>
          </va-additional-info>
        </>
      )}
      {!showAdditionalInformation && (
        <div>
          {applicantChapter ? (
            <p>{applicantChapter}</p>
          ) : (
            <va-loading-indicator
              label="Loading"
              message="Loading applicant chapter..."
            />
          )}
        </div>
      )}
      {applicantClaimNumber !== '' && <p>{applicantClaimNumber}</p>}
    </div>
  );
};
PayeeInformationCard.propTypes = {
  applicantChapter: PropTypes.string,
  applicantClaimNumber: PropTypes.string,
  showAdditionalInformation: PropTypes.bool,
  title: PropTypes.string,
};

export default PayeeInformationCard;
