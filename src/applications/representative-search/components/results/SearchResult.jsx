/* eslint-disable @department-of-veterans-affairs/prefer-button-component */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { scrollTo } from 'platform/utilities/scroll';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import ReportModal from './ReportModal';
import { parsePhoneNumber } from '../../utils/phoneNumbers';

const SearchResult = ({
  officer,
  key,
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
  initializeRepresentativeReport,
  cancelRepresentativeReport,
  reportSubmissionStatus,
  reports,
  representativeId,
  searchResults,
  query,
  setReportModalTester,
}) => {
  const [reportModalIsShowing, setReportModalIsShowing] = useState(false);

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const reportFeatureEnabled = useToggleValue(
    TOGGLE_NAMES.findARepresentativeFlagResultsEnabled,
  );

  const { contact, extension } = parsePhoneNumber(phone);

  const hasStreetAddress = Boolean((addressLine1 || '').trim());
  const hasCity = Boolean((city || '').trim());
  const hasState = Boolean((stateCode || '').trim());
  const hasZip = Boolean((zipCode || '').trim());
  const hasValidPartialLocation = (hasCity && hasState) || hasZip;

  const isEstimatedAddress = !hasStreetAddress && hasValidPartialLocation;

  const addressExists = hasStreetAddress || hasValidPartialLocation;

  const cityStateText = hasCity && hasState ? `${city}, ${stateCode}` : '';
  const hasDistance =
    distance !== null && distance !== undefined && distance !== '';
  let partialLocationText = zipCode;

  if (cityStateText) {
    partialLocationText = hasZip
      ? `${cityStateText} ${zipCode}`
      : cityStateText;
  }

  const fullLocationText = (
    <>
      {addressLine1}
      {addressLine2 ? (
        <>
          <br /> {addressLine2}
        </>
      ) : null}
      <br />
      {partialLocationText}
    </>
  );

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

  const destinationAddress = [
    (addressLine1 || '').trim(),
    (addressLine2 || '').trim(),
    (addressLine3 || '').trim(),
    [city, stateCode]
      .filter(Boolean)
      .join(', ')
      .trim(),
    (zipCode || '').trim(),
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  // Reusable map href for both full + partial address cases
  const mapHref = `https://maps.google.com?saddr=${
    query?.context?.location
  }&daddr=${encodeURIComponent(destinationAddress)}`;

  const onCloseReportModal = () => {
    setReportModalIsShowing(false);
  };

  const recordContactLinkClick = () => {
    recordEvent({
      // prettier-ignore
      'event': 'far-search-results-click',
      'search-query': query?.locationQueryString,
      'search-filters-list': {
        'representative-type': query?.representativeType,
        'search-radius': query?.searchArea,
        'representative-name': query?.representativeQueryString,
      },
      'search-selection': 'Find VA Accredited Rep',
      'search-results-id': representativeId,
      'search-results-total-count':
        searchResults?.meta?.pagination?.totalEntries,
      'search-results-total-pages': searchResults?.meta?.pagination?.totalPages,
      'search-result-position': key,
      'search-result-page': searchResults?.meta?.pagination?.currentPage,
    });
  };

  const recordReportButtonClick = () => {
    recordEvent({
      // prettier-ignore
      'event': 'far-search-results-outdated',
      'search-query': query?.locationQueryString,
      'search-filters-list': {
        'representative-type': query?.representativeType,
        'search-radius': query?.searchArea,
        'representative-name': query?.representativeQueryString,
      },
      'search-selection': 'Find VA Accredited Rep',
      'search-results-id': representativeId,
      'search-results-total-count':
        searchResults?.meta?.pagination?.totalEntries,
      'search-results-total-pages': searchResults?.meta?.pagination?.totalPages,
      'search-result-position': key,
      'search-result-page': searchResults?.meta?.pagination?.currentPage,
    });
  };

  const addressAnchorProps = {
    href: mapHref,
    tabIndex: 0,
    className: 'address-anchor',
    onClick: recordContactLinkClick,
    target: '_blank',
    rel: 'noreferrer',
    'aria-label': `${destinationAddress} (opens in a new tab)`,
  };

  useEffect(
    () => {
      if (reportSubmissionStatus === 'SUCCESS') {
        scrollTo(`#thank-you-alert-${representativeId}`);
        focusElement(`#thank-you-alert-${representativeId}`);
      } else if (reportSubmissionStatus === 'CANCELLED') {
        scrollTo(`#report-button-${representativeId}`);
        focusElement(`#report-button-${representativeId}`);
      }
      initializeRepresentativeReport();
    },
    [reportModalIsShowing],
  );

  return (
    <div className="report-outdated-information-modal">
      {/* Trigger methods for unit testing - temporary workaround for shadow root issues */}
      {setReportModalTester ? (
        <button
          id="open-modal-test-button"
          label="open-modal-test-button"
          type="button"
          onClick={() => {
            recordReportButtonClick();
            setReportModalIsShowing(true);
          }}
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
          cancelRepresentativeReport={cancelRepresentativeReport}
        />
      )}
      <va-card
        id={`representative-${representativeId}`}
        class="representative-result-card vads-u-padding--4"
      >
        <div className="representative-result-card-content">
          <div className="representative-info-heading">
            <h3
              className="vads-u-margin-top--0"
              aria-describedby={`representative-${representativeId}`}
            >
              {officer && <span className="officer">{officer}</span>}
              {hasDistance && (
                <span className="distance vads-u-margin-top--1 vads-u-display--block vads-u-font-size--h4">
                  {parseFloat(JSON.parse(distance).toFixed(2))} miles
                  {isEstimatedAddress ? ' (estimated)' : ''}
                </span>
              )}
            </h3>
          </div>

          <div className="associated-organizations-info vads-u-margin-top--1p5">
            {associatedOrgs?.length === 1 && (
              <span className="vads-u-font-size--md">{associatedOrgs[0]}</span>
            )}
            {associatedOrgs?.length > 1 && (
              <va-additional-info
                trigger="See associated organizations"
                disable-border
                uswds
              >
                {associatedOrgs?.map(org => <div key={org}>{org}</div>)}
              </va-additional-info>
            )}
          </div>

          <div className="representative-contact-section vads-u-margin-top--3">
            {addressExists && (
              <div className="address-link">
                {isEstimatedAddress && <div>No street address provided</div>}
                <a {...addressAnchorProps}>
                  {isEstimatedAddress ? partialLocationText : fullLocationText}
                </a>
              </div>
            )}
            {phone && (
              <div className="vads-u-margin-top--1p5">
                <va-telephone
                  contact={contact}
                  extension={extension}
                  onClick={() => recordContactLinkClick()}
                  disable-analytics
                />
              </div>
            )}
            {email && (
              <div className="vads-u-margin-top--1p5">
                <a
                  href={`mailto:${email}`}
                  onClick={() => recordContactLinkClick()}
                >
                  {email}
                </a>
              </div>
            )}
          </div>
          {reportFeatureEnabled && (
            <div className="experimental-parent">
              {reports && (
                <div className="report-thank-you-alert">
                  <va-alert
                    class="thank-you-alert vads-u-margin-bottom--2"
                    id={`thank-you-alert-${representativeId}`}
                    close-btn-aria-label="Close notification"
                    disable-analytics="false"
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
                    recordReportButtonClick();
                    setReportModalIsShowing(true);
                  }}
                  id={`report-button-${representativeId}`}
                  secondary
                  text="Report outdated information"
                  label={`Report outdated information for ${officer}`}
                  uswds
                  disable-analytics
                />
              </div>
            </div>
          )}
        </div>
      </va-card>
    </div>
  );
};

SearchResult.propTypes = {
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressLine3: PropTypes.string,
  associatedOrgs: PropTypes.array,
  city: PropTypes.string,
  distance: PropTypes.number,
  email: PropTypes.string,
  initializeRepresentativeReport: PropTypes.func,
  key: PropTypes.number,
  officer: PropTypes.string,
  phone: PropTypes.string,
  query: PropTypes.shape({
    context: PropTypes.shape({
      location: PropTypes.string,
    }),
    locationQueryString: PropTypes.string,
    representativeType: PropTypes.string,
    searchArea: PropTypes.string,
    representativeQueryString: PropTypes.string,
  }),
  reportSubmissionStatus: PropTypes.string,
  reports: PropTypes.shape({
    phone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    other: PropTypes.string,
  }),
  representativeId: PropTypes.string,
  searchResults: PropTypes.arrayOf(
    PropTypes.shape({
      meta: PropTypes.shape({
        pagination: PropTypes.shape({
          totalEntries: PropTypes.number,
          totalPages: PropTypes.number,
          currentPage: PropTypes.number,
        }),
      }),
    }),
  ),
  setReportModalTester: PropTypes.func,
  stateCode: PropTypes.string,
  submitRepresentativeReport: PropTypes.func,
  type: PropTypes.string,
  zipCode: PropTypes.string,
};

export default SearchResult;
