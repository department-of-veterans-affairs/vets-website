import React from 'react';
import PropTypes from 'prop-types';
import { howToChangeLegalNameInfoLink } from '../constants';

const PayeeInformationCard = ({
  title,
  applicantName,
  showAdditionalInformation,
  applicantChapter = '',
  applicantClaimNumber = '',
  loading,
}) => {
  const chapters = {
    A: 'Montgomery GI Bill (MGIB) – Selective Reserve (Chapter 1606)',
    B: 'Montgomery GI Bill (MGIB) – Active Duty (Chapter 30)',
    E: 'Reservist Educational Assistance Program (REAP) – (Chapter 1607)',
    D: "Survivors' and Dependents' Educational Assistance (DEA) - (Chapter 35)",
  };
  return (
    <div
      className="medium-screen:vads-u-padding--4"
      id="benefits-gi-bill-profile-statement"
    >
      <h3 className="vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--sans vads-u-margin-y--0">
        {title}
      </h3>
      {showAdditionalInformation && (
        <>
          {loading ? (
            <va-loading-indicator
              label="Loading"
              message="Loading applicant Name..."
              aria-hidden="true"
            />
          ) : (
            <>
              <p>{applicantName}</p>

              <va-additional-info
                trigger="How to update your legal name with the VA"
                class="vads-u-margin-bottom--4"
              >
                <p>
                  If you’ve changed your legal name, you’ll need to tell us so
                  we can change your name in our records.
                </p>
                <p>
                  <a href={howToChangeLegalNameInfoLink}>
                    Learn how to change your legal name on file with VA.
                  </a>
                </p>
              </va-additional-info>
            </>
          )}
        </>
      )}
      {!showAdditionalInformation && (
        <div>
          {loading ? (
            <va-loading-indicator
              label="Loading"
              message="Loading applicant chapter..."
            />
          ) : (
            <p>{chapters[applicantChapter.toUpperCase()]}</p>
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
  applicantName: PropTypes.string,
  loading: PropTypes.bool,
  showAdditionalInformation: PropTypes.bool,
  title: PropTypes.string,
};

export default PayeeInformationCard;
