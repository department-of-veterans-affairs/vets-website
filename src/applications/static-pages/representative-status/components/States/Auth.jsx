import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const Auth = ({
  DynamicHeader,
  DynamicSubheader,
  useRepresentativeStatus,
}) => {
  const { representative, isLoading, error } = useRepresentativeStatus();

  const {
    poaType,
    name,
    addressLine1,
    addressLine2,
    city,
    id,
    stateCode,
    zipCode,
    email,
    contact,
    extension,
    concatAddress,
    vcard,
  } = representative ?? {};

  if (isLoading) {
    return (
      <div>
        <va-loading-indicator
          label="Loading"
          message="Loading your accredited representative information..."
        />
      </div>
    );
  }

  if (id) {
    return (
      <>
        <div className="auth-header-icon">
          <va-icon
            icon="account_circle"
            size={4}
            srtext="Your representative"
          />{' '}
        </div>
        <div className="auth-rep-text">
          <div className="auth-rep-header">
            <DynamicHeader>
              Your current accredited representative
            </DynamicHeader>
          </div>
          <div className="auth-rep-subheader">
            <DynamicSubheader>{name}</DynamicSubheader>
            {poaType === 'organization' && (
              <p className="vads-u-margin-top--0">
                You can work with any accredited representative at this
                organization
              </p>
            )}
          </div>

          <div className="auth-rep-body">
            {concatAddress && (
              <div className="contact-info vads-u-margin-top--1p5">
                <div className="contact-icon">
                  <va-icon
                    icon="location_on"
                    size={2}
                    srtext="Representative address"
                  />
                </div>

                <div className="address-link">
                  <a
                    href={`https://maps.google.com?daddr=${concatAddress}`}
                    tabIndex="0"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${concatAddress} (opens in a new tab)`}
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
              </div>
            )}
            {poaType === 'representative' &&
              email && (
                <div className="contact-info vads-u-margin-top--1p5">
                  <div className="contact-icon">
                    <va-icon
                      icon="mail"
                      size={2}
                      srtext="Representative email"
                    />
                  </div>
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              )}
            {contact && (
              <div className="contact-info vads-u-margin-top--1p5">
                <div className="contact-icon">
                  <va-icon
                    icon="phone"
                    size={2}
                    srtext="Representative phone"
                  />
                </div>
                <va-telephone
                  contact={contact}
                  extension={extension}
                  disable-analytics
                />
              </div>
            )}
            {poaType === 'representative' &&
              (contact || email) && (
                <div className="contact-info vads-u-margin-top--1p5">
                  <va-link
                    download
                    filetype="VCF"
                    filename="accredited_representative_contact"
                    href={vcard}
                    text="Download your accredited representative's contact information"
                  />
                </div>
              )}
            <div className="contact-info vads-u-margin-top--1p5">
              <div className="contact-icon">
                <va-icon
                  icon="search"
                  size={2}
                  srtext="Learn about accredited representatives"
                />
              </div>
              <va-link
                href="https://www.va.gov/resources/va-accredited-representative-faqs/"
                text="Learn about accredited representatives"
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!error && !id) {
    return (
      <>
        <va-card show-shadow>
          <div className="auth-card">
            <div className="auth-header-icon">
              <va-icon
                icon="account_circle"
                size={4}
                srtext="Your representative"
              />{' '}
            </div>
            <div className="auth-no-rep-text">
              <DynamicHeader className="auth-no-rep-header">
                You don’t have an accredited representative
              </DynamicHeader>
              <div className="auth-no-rep-body">
                <va-link
                  href="https://www.va.gov/resources/va-accredited-representative-faqs/"
                  text="Learn about accredited representatives"
                />
              </div>
            </div>
          </div>
        </va-card>
      </>
    );
  }

  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="error"
      uswds
      visible
    >
      <h2 slot="headline">We don’t seem to have your records</h2>
      <React.Fragment key=".1">
        <p>We’re sorry. We can’t match your information to our records.</p>

        <p className="vads-u-margin-y--0">
          If you think your information should be here, please try again later
          or call us at <va-telephone contact={CONTACTS.VA_411} extension={0} />{' '}
          (<va-telephone contact={CONTACTS['711']} tty />
          ). We’re here 24/7.
        </p>
      </React.Fragment>
    </va-alert>
  );
};

Auth.propTypes = {
  DynamicHeader: PropTypes.string,
  DynamicSubheader: PropTypes.string,
  useRepresentativeStatus: PropTypes.func,
};
