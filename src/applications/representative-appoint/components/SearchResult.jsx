import React from 'react';
import PropTypes from 'prop-types';

// import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { parsePhoneNumber } from '../utilities/helpers';

const SearchResult = ({
  representativeName,
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
  representativeId,
  query,
}) => {
  const { contact, extension } = parsePhoneNumber(phone);

  const addressExists = addressLine1 || city || stateCode || zipCode;

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

  // pending analytics event
  const recordContactLinkClick = () => {
    // recordEvent({
    //   // prettier-ignore
    //   'event': 'appoint-a-rep-search-results-click',
    //   'search-query': query?.locationQueryString,
    //   'search-filters-list': {
    //     'representative-type': query?.representativeType,
    //     'representative-name': query?.representativeQueryString,
    //   },
    //   'search-selection': 'Find VA Accredited Rep',
    //   'search-results-id': representativeId,
    //   'search-results-total-count':
    //     searchResults?.meta?.pagination?.totalEntries,
    //   'search-results-total-pages': searchResults?.meta?.pagination?.totalPages,
    //   'search-result-position': key,
    // });
  };

  return (
    <va-card class="representative-result-card vads-u-padding--4">
      <div className="representative-result-card-content">
        <div className="representative-info-heading">
          {distance && (
            <div
              id={`representative-${representativeId}`}
              className="vads-u-font-weight--bold vads-u-font-family--serif"
            >
              {parseFloat(JSON.parse(distance).toFixed(2))} Mi
            </div>
          )}
          {representativeName && (
            <>
              <div
                className="vads-u-font-family--serif vads-u-margin-top--2p5"
                id={`result-${representativeId}`}
              >
                <h3 aria-describedby={`representative-${representativeId}`}>
                  {representativeName}
                </h3>
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
                      <br style={{ lineHeight: '0.625rem' }} />
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
                className="address-anchor"
                onClick={() => recordContactLinkClick()}
                target="_blank"
                rel="noreferrer"
                aria-label={`${address} (opens in a new tab)`}
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
          {contact && (
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
      </div>
    </va-card>
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
  representativeName: PropTypes.string,
  phone: PropTypes.string,
  representativeId: PropTypes.string,
  stateCode: PropTypes.string,
  type: PropTypes.string,
  zipCode: PropTypes.string,
};

export default SearchResult;
