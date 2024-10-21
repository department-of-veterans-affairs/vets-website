import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from '~/platform/forms-system/src/js/actions';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { parsePhoneNumber } from '../utilities/parsePhoneNumber';

const SearchResult = ({
  representative,
  query,
  handleSelectRepresentative,
}) => {
  const { representativeId } = representative.data;
  const {
    name,
    fullName,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    stateCode,
    zipCode,
    phone,
    email,
    accreditedOrganizations,
  } = representative.data.attributes;

  const representativeName = name || fullName;

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

  return (
    <va-card class="vads-u-padding--4">
      <div className="representative-result-card-content">
        <div className="representative-info-heading">
          {representativeName && (
            <>
              <h3
                className="vads-u-font-family--serif vads-u-margin-top--0p5"
                aria-describedby={`representative-${representativeId}`}
              >
                {representativeName}
              </h3>
              {accreditedOrganizations?.data.length === 1 && (
                <p style={{ marginTop: 0 }}>
                  {accreditedOrganizations.data[0]?.attributes?.name}
                </p>
              )}
            </>
          )}
        </div>
        {accreditedOrganizations?.data.length > 1 && (
          <div className="associated-organizations-info vads-u-margin-top--1p5">
            <va-additional-info
              trigger="Check Veterans Service Organizations"
              disable-border
              uswds
              class="appoint-additional-info"
            >
              <p>
                This VSO representative is accredited with these organizations:
              </p>
              <ul className="appoint-ul">
                {accreditedOrganizations?.data.map((org, index) => {
                  return <li key={index}>{org.attributes.name}</li>;
                })}
              </ul>
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
                // onClick={() => recordContactLinkClick()}
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
                  // onClick={() => recordContactLinkClick()}
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
                // onClick={() => recordContactLinkClick()}
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
            onClick={() => handleSelectRepresentative(representative)}
          />
        </div>
      </div>
    </va-card>
  );
};

SearchResult.propTypes = {
  accreditedOrganizations: PropTypes.array,
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressLine3: PropTypes.string,
  city: PropTypes.string,
  distance: PropTypes.string,
  email: PropTypes.string,
  formData: PropTypes.object.isRequired,
  location: PropTypes.object,
  phone: PropTypes.string,
  query: PropTypes.shape({
    context: PropTypes.shape({
      location: PropTypes.string,
    }),
  }),
  representative: PropTypes.object,
  representativeId: PropTypes.string,
  representativeName: PropTypes.string,
  router: PropTypes.object,
  routes: PropTypes.array,
  setFormData: PropTypes.func.isRequired,
  stateCode: PropTypes.string,
  zipCode: PropTypes.string,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResult);
