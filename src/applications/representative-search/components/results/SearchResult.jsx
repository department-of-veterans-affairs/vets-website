import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  focusElement,
  scrollTo,
} from '@department-of-veterans-affairs/platform-utilities/ui';
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
  setReportModalTester,
}) => {
  const [reportModalIsShowing, setReportModalIsShowing] = useState(false);

  const reportsAreInitialized = useRef(true);

  const prevReportCount = useRef(reports?.length || 0);

  const { contact, extension } = parsePhoneNumber(phone);

  const addressExists = addressLine1 || city || stateCode || zipCode;

  // concatenating address for ReportModal
  const address =
    [
      (addressLine1 || '').trim(),
      (addressLine2 || '').trim(),
      (addressLine3 || '').trim(),
    ]
      .filter(Boolean)
      .join(' ') +
    (city ? ` ${city},` : '') +
    (stateCode ? ` ${stateCode}` : '') +
    (zipCode ? ` ${zipCode}` : '');

  const onCloseReportModal = action => {
    if (action === 'Cancel' && reports) {
      prevReportCount.current = Object.keys(reports).length;
    }
    setReportModalIsShowing(false);
  };

  useEffect(
    () => {
      if (!reportModalIsShowing && !reportsAreInitialized.current) {
        // scroll and focus behavior depends on whether a report was successfully created
        if (reports && Object.keys(reports).length > prevReportCount.current) {
          prevReportCount.current += 1;
          scrollTo(`#thank-you-alert-${representativeId}`);
          focusElement(`#thank-you-alert-${representativeId}`);
        } else {
          scrollTo(`#report-button-${representativeId}`);
          focusElement(`#report-button-${representativeId}`);
        }
      } else {
        reportsAreInitialized.current = false;
      }
    },
    [reportModalIsShowing],
  );

  return (
    <div className="report-outdated-information-modal">
      {/* Trigger methods for unit testing - temporary workaround for shadow root issues */}
      {setReportModalTester ? (
        <button
          id="open-modal-test-button"
          type="button"
          onClick={() => setReportModalIsShowing(true)}
        />
      ) : null}

      {reportModalIsShowing && (
        <ReportModal
          representativeName={officer}
          representativeId={representativeId}
          address={address}
          phone={phone}
          email={email}
          existingReports={reports}
          onCloseReportModal={onCloseReportModal}
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
              <>
                <div
                  className="vads-u-font-family--serif vads-u-margin-top--2p5"
                  id={`result-${representativeId}`}
                >
                  <h3>{officer}</h3>
                </div>
                {associatedOrgs?.length === 1 && (
                  <p style={{ marginTop: 0 }}>{associatedOrgs[0]}</p>
                )}
              </>
            )}
          </div>
          {associatedOrgs?.length > 1 && (
            <div className="associated-organizations-info vads-u-margin-top--1p5">
              <va-additional-info
                trigger="See associated organizations"
                disable-border
                uswds
              >
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
                  target="_blank"
                  rel="noreferrer"
                >
                  {addressLine1}{' '}
                  {addressLine2 ? (
                    <>
                      <br /> {addressLine2}
                    </>
                  ) : null}{' '}
                  <br />
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
                class="thank-you-alert vads-u-margin-bottom--2"
                id={`thank-you-alert-${representativeId}`}
                close-btn-aria-label="Close notification"
                disable-analytics="false"
                tabIndex={-1}
                full-width="false"
                slim
                status="info"
                uswds
                visible="true"
              >
                <p className="vads-u-margin-y--0">
                  Thanks for reporting outdated information.
                </p>
              </va-alert>
            </div>
          )}
          <div className="report-outdated-information-button">
            <va-button
              onClick={() => {
                setReportModalIsShowing(true);
              }}
              tabIndex={-1}
              id={`report-button-${representativeId}`}
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
