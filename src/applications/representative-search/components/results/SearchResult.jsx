import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReportModal from './ReportModal';
import { parsePhoneNumber } from '../../utils/phoneNumbers';

const SearchResult = ({
  officer,
  addressLine1,
  addressLine2,
  addressLine3,
  city,
  stateCode,
  zipCode,
  phone,
  distance,
  email,
  associatedOrgs,
  submitRepresentativeReport,
  reports,
  representativeId,
  query,
}) => {
  const [reportModalIsShowing, setReportModalIsShowing] = useState(false);

  const { contact, extension } = parsePhoneNumber(phone);

  const addressExists =
    addressLine1 ||
    addressLine2 ||
    addressLine3 ||
    city ||
    stateCode ||
    zipCode;

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
    (stateCode ? ` ${stateCode}` : '') +
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
        <div className="representative-result-card-content">
          <div className="representative-info-heading">
            {distance && (
              <div className="vads-u-font-weight--bold vads-u-font-family--serif">
                {parseFloat(JSON.parse(distance).toFixed(2))} Mi
              </div>
            )}
            {officer && (
              <div className="vads-u-font-family--serif vads-u-margin-top--2p5">
                <h3>{officer}</h3>
              </div>
            )}
          </div>
          {associatedOrgs && (
            <div className="associated-organizations-info vads-u-margin-top--1p5">
              <va-additional-info trigger="See associated organizations" uswds>
                {associatedOrgs?.map((org, index) => {
                  return (
                    <>
                      <p>{org}</p>
                      {index < associatedOrgs.length - 1 ? (
                        <br style={{ lineHeight: '1rem' }} />
                      ) : null}
                    </>
                  );
                })}
              </va-additional-info>
            </div>
          )}

          <div className="representative-contact-section vads-u-margin-top--3">
            {addressExists && (
              <div className="address-link">
                <a
                  href={`https://maps.google.com?saddr=${
                    query?.context?.location
                  }&daddr=${address}`}
                  tabIndex="0"
                >
                  {addressLine1} {addressLine2} <br />
                  {city}, {stateCode} {zipCode}
                </a>
              </div>
            )}
            {phone && (
              <div className="vads-u-margin-top--1p5">
                <va-telephone contact={contact} extension={extension} />
              </div>
            )}
            {email && (
              <div className="vads-u-margin-top--1p5">
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            )}
          </div>
          {reports && (
            <div className="report-thank-you-alert">
              <va-alert
                class="vads-u-margin-bottom--2"
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
            </div>
          )}
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
    </div>
  );
};

SearchResult.propTypes = {
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressLine3: PropTypes.string,
  associatedOrgs: PropTypes.array,
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
    other: PropTypes.string,
  }),
  representativeId: PropTypes.string,
  stateCode: PropTypes.string,
  submitRepresentativeReport: PropTypes.func,
  type: PropTypes.string,
  zipCode: PropTypes.string,
};

export default SearchResult;
