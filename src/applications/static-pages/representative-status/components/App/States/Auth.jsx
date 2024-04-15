import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { useRepresentativeStatus } from '../../../hooks/useRepresentativeStatus';

export const Auth = ({ DynamicHeader, DynamicSubheader }) => {
  const { representative, isLoading, error } = useRepresentativeStatus();

  if (isLoading) {
    return (
      <div>
        <va-loading-indicator
          label="Loading"
          message="Loading your representative..."
        />
      </div>
    );
  }

  if (error) {
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
          <p>
            <strong>What you can do</strong>
          </p>
          <p>
            If you think your information should be here, please try again later
            or call us at{' '}
            <va-telephone contact={CONTACTS.VA_411} extension={0} /> (
            <va-telephone contact={CONTACTS['711']} tty />
            ). We’re here 24/7.
          </p>
        </React.Fragment>
      </va-alert>
    );
  }

  const renderAuthNoRep = () => {
    return (
      <>
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
              href="https://va.gov/va-accredited-representative-faqs"
              text="Learn about accredited representatives"
            />
          </div>
        </div>
      </>
    );
  };
  const renderAuthRep = () => {
    if (representative) {
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
            <DynamicHeader className="auth-rep-header">
              Your accredited representative
            </DynamicHeader>
            <DynamicSubheader className="auth-rep-subheader">
              {representative.name}
            </DynamicSubheader>

            <div className="auth-rep-body">
              {representative.concatAddress && (
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
                      href={`https://maps.google.com?daddr=${
                        representative.concatAddress
                      }`}
                      tabIndex="0"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${
                        representative.concatAddress
                      } (opens in a new tab)`}
                    >
                      {representative.addressLine1}{' '}
                      {representative.addressLine2 ? (
                        <>
                          <br /> {representative.addressLine2}
                        </>
                      ) : null}{' '}
                      <br />
                      {representative.city}, {representative.stateCode}{' '}
                      {representative.zipCode}
                    </a>
                  </div>
                </div>
              )}
              {representative.email && (
                <div className="contact-info vads-u-margin-top--1p5">
                  <div className="contact-icon">
                    <va-icon
                      icon="mail"
                      size={2}
                      srtext="Representative email"
                    />
                  </div>
                  <a href={`mailto:${representative.email}`}>
                    {representative.email}
                  </a>
                </div>
              )}
              {representative.contact && (
                <div className="contact-info vads-u-margin-top--1p5">
                  <div className="contact-icon">
                    <va-icon
                      icon="phone"
                      size={2}
                      srtext="Representative phone"
                    />
                  </div>
                  <va-telephone
                    contact={representative.contact}
                    extension={representative.extension}
                    disable-analytics
                  />
                </div>
              )}

              {(representative.contact || representative.email) && (
                <div className="contact-info vads-u-margin-top--1p5">
                  <va-link
                    download
                    filetype="VCF"
                    href={representative.vcard}
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
                  href="https://va.gov/va-accredited-representative-faqs"
                  text="Learn about accredited representatives"
                />
              </div>
            </div>
          </div>
        </>
      );
    }
    return <></>;
  };

  return (
    <>
      <va-card>
        <div className="auth-card">
          {representative?.id ? renderAuthRep() : renderAuthNoRep()}
        </div>
      </va-card>
    </>
  );
};

Auth.propTypes = {
  DynamicHeader: PropTypes.string,
  DynamicSubheader: PropTypes.string,
  hasRepresentative: PropTypes.bool,
};
