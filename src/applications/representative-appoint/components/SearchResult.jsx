import React from 'react';
import PropTypes from 'prop-types';
// import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { connect } from 'react-redux';
import { setData } from '~/platform/forms-system/src/js/actions';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getNextPagePath } from '~/platform/forms-system/src/js/routing';
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
  accreditedOrganizations,
  representativeId,
  representative,
  query,
  formData,
  setFormData,
  router,
  routes,
  location,
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

  const recordContactLinkClick = () => {
    // pending analytics event
  };

  const handleSelect = selectedRepResult => {
    const tempData = {
      ...formData,
      'view:selectedRepresentative': selectedRepResult,
      // when a new representative is selected, we want to nil out the
      //   selected organization to prevent weird states. For example,
      //   we wouldn't want a user to select a representative, an organization,
      //   go backwards to select an attorney, and then our state variables
      //   say an attorney was selected with a non-null organization id
      selectedAccreditedOrganizationId: null,
    };

    setFormData({
      ...tempData,
    });

    const { pageList } = routes[1];
    const { pathname } = location;

    const nextPagePath = getNextPagePath(pageList, tempData, pathname);

    router.push(nextPagePath);
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
              <h3
                className="vads-u-font-family--serif vads-u-margin-top--0p5"
                aria-describedby={`representative-${representativeId}`}
              >
                {representativeName}
              </h3>
              {accreditedOrganizations?.length === 1 && (
                <p style={{ marginTop: 0 }}>{accreditedOrganizations[0]}</p>
              )}
            </>
          )}
        </div>
        {accreditedOrganizations?.length > 1 && (
          <div className="associated-organizations-info vads-u-margin-top--1p5">
            <va-additional-info
              trigger="See associated organizations"
              disable-border
              uswds
            >
              {accreditedOrganizations?.map((org, index) => {
                return (
                  <>
                    <p>{org.attributes.name}</p>
                    {index < accreditedOrganizations.length - 1 ? (
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
            <div className="address-link vads-u-display--flex">
              <va-icon icon="location_on" size="3" />
              <a
                href={`https://maps.google.com?saddr=${
                  query?.context?.location
                }&daddr=${address}`}
                tabIndex="0"
                className="address-anchor vads-u-margin-left--1"
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
            <div className="vads-u-margin-top--1p5 vads-u-display--flex">
              <va-icon icon="phone" size="3" />
              <div className="vads-u-margin-left--1">
                <va-telephone
                  contact={contact}
                  extension={extension}
                  onClick={() => recordContactLinkClick()}
                  disable-analytics
                />
              </div>
            </div>
          )}
          {email && (
            <div className="vads-u-margin-top--1p5 vads-u-display--flex">
              <va-icon icon="mail" size="3" />
              <a
                href={`mailto:${email}`}
                onClick={() => recordContactLinkClick()}
                className="vads-u-margin-left--1"
              >
                {email}
              </a>
            </div>
          )}
        </div>

        <div className="vads-u-margin-top--4">
          <VaButton
            data-testid="representative-search-btn"
            text="Select this representative"
            secondary
            onClick={() => handleSelect(representative)}
          />
        </div>
      </div>
    </va-card>
  );
};

SearchResult.propTypes = {
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressLine3: PropTypes.string,
  accreditedOrganizations: PropTypes.array,
  city: PropTypes.string,
  distance: PropTypes.string,
  email: PropTypes.string,
  representativeName: PropTypes.string,
  phone: PropTypes.string,
  representativeId: PropTypes.string,
  stateCode: PropTypes.string,
  type: PropTypes.string,
  zipCode: PropTypes.string,
  setFormData: PropTypes.func.isRequired,
  router: PropTypes.object,
  routes: PropTypes.array,
  location: PropTypes.object,
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  null,
  mapDispatchToProps,
)(SearchResult);
