import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReportModal from './ReportModal';
import RepresentativeDirectionsLink from './RepresentativeDirectionsLink';
import { parsePhoneNumber } from '../../utils/phoneNumbers';

const SearchResult = ({
  officer,
  addressLine1,
  addressLine2,
  addressLine3,
  city,
  state,
  zipCode,
  phone,
  distance,
  email,
  submitRepresentativeReport,
  reports,
  representative,
  representativeId,
  query,
}) => {
  const [reportModalIsShowing, setReportModalIsShowing] = useState(false);

  const { contact, extension } = parsePhoneNumber(phone);

  const addressExists =
    addressLine1 || addressLine2 || addressLine3 || city || state || zipCode;

  // concatenating address for ReportModal
  const address =
    [
      addressLine1.trim(),
      (addressLine2 || '').trim(),
      (addressLine3 || '').trim(),
    ]
      .filter(Boolean)
      .join(' ') +
    (city ? ` ${city},` : '') +
    (state ? ` ${state}` : '') +
    (zipCode ? ` ${zipCode}` : '');

  const closeReportModal = () => {
    setReportModalIsShowing(false);
  };

  return (
    <div className="report-outdated-information-modal">
      {reportModalIsShowing && (
        <ReportModal
          representativeName={officer}
          representativeId={representativeId}
          address={address}
          phone={phone}
          email={email}
          existingReports={reports}
          onCloseModal={closeReportModal}
          submitRepresentativeReport={submitRepresentativeReport}
        />
      )}

      <div className="vads-u-padding--4 representative-result-card">
        {reports && (
          <va-alert
            class="vads-u-margin-bottom--1"
            close-btn-aria-label="Close notification"
            disable-analytics="false"
            full-width="false"
            slim
            status="info"
            uswds
            visible="true"
          >
            <p className="vads-u-margin-y--0">
              Thank you for reporting outdated information.
            </p>
          </va-alert>
        )}
        <div className="representative-info-section">
          {distance && (
            <div className="vads-u-font-weight--bold vads-u-font-size--lg">
              {parseFloat(JSON.parse(distance).toFixed(2))} Mi
            </div>
          )}
          {officer && (
            <div className="vads-u-font-family--serif vads-u-margin-top--2">
              <h3>{officer}</h3>
            </div>
          )}

          <div className="vads-u-margin-top--2p5">
            <va-additional-info trigger="See associated organizations" uswds>
              <p>
                {/* <strong>Veterans Service Officers (VSOs)</strong> can help you
              gather evidence, file claims, and request decision reviews. They
              can also communicate with VA on your behalf. VSOs provide free
              services for Veterans and their families. */}
              </p>
            </va-additional-info>
          </div>

          <div className="representative-contact-section vads-u-margin-top--2p5">
            {addressExists && (
              <div className="vads-u-margin-top--2">
                <RepresentativeDirectionsLink
                  representative={representative}
                  query={query}
                />
              </div>
            )}
            {phone && (
              <div className="vads-u-margin-top--2">
                <va-telephone contact={contact} extension={extension} />
              </div>
            )}
            {email && (
              <div className="vads-u-margin-top--2">
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            )}
          </div>
        </div>

        <div className="report-outdated-information-button">
          <va-button
            onClick={() => {
              setReportModalIsShowing(true);
            }}
            secondary
            text="Report outdated information"
            uswds
          />
        </div>
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressLine3: PropTypes.string,
  city: PropTypes.string,
  distance: PropTypes.string,
  email: PropTypes.string,
  officer: PropTypes.string,
  phone: PropTypes.string,
  query: PropTypes.object,
  reports: PropTypes.shape({
    phone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    otherComment: PropTypes.string,
  }),
  representative: PropTypes.object,
  representativeId: PropTypes.string,
  state: PropTypes.string,
  submitRepresentativeReport: PropTypes.func,
  type: PropTypes.string,
  zipCode: PropTypes.string,
};

export default SearchResult;
