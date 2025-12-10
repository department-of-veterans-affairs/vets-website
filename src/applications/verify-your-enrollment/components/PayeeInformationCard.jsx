import React from 'react';
import PropTypes from 'prop-types';
import { howToChangeLegalNameInfoLink } from '../constants';

const PayeeInformationCard = ({
  title,
  applicantName,
  showAdditionalInformation,
  applicantChapter = [],
  applicantClaimNumber = '',
  loading,
}) => {
  const chapters = {
    A: 'Montgomery GI Bill (MGIB) – Selective Reserve (Chapter 1606)',
    B: 'Montgomery GI Bill (MGIB) – Active Duty (Chapter 30)',
    E: 'Reservist Educational Assistance Program (REAP) – (Chapter 1607)',
    CH35:
      "Survivors' and Dependents' Educational Assistance (DEA) - (Chapter 35)",
    CH1606: 'Montgomery GI Bill (MGIB) – Selective Reserve (Chapter 1606)',
    CH30: 'Montgomery GI Bill (MGIB) – Active Duty (Chapter 30)',
    CH1607: 'Reservist Educational Assistance Program (REAP) – (Chapter 1607)',
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
            <ul>
              {applicantChapter.map((ch, index) => {
                const chapterKey = ch?.benefitType?.toUpperCase();
                const chapterName = chapters[chapterKey] || '';
                const isValidChapter = ch.benefitType in chapters;
                if (!isValidChapter) return null;
                return <li key={index}>{chapterName}</li>;
              })}
            </ul>
          )}
        </div>
      )}
      {applicantClaimNumber !== '' && <p>{applicantClaimNumber}</p>}
    </div>
  );
};
PayeeInformationCard.propTypes = {
  applicantChapter: PropTypes.array,
  applicantClaimNumber: PropTypes.string,
  applicantName: PropTypes.string,
  loading: PropTypes.bool,
  showAdditionalInformation: PropTypes.bool,
  title: PropTypes.string,
};

export default PayeeInformationCard;
