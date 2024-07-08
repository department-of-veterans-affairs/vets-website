import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

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
    vcfUrl,
  } = representative ?? {};

  const isPostLogin = document.location.search?.includes('postLogin=true');

  useEffect(
    () => {
      if (isPostLogin) {
        focusElement('.poa-display');
      }
    },
    [id, isPostLogin],
  );

  if (isLoading) {
    return (
      <va-card show-shadow>
        <va-loading-indicator
          label="Loading"
          message="Loading your information..."
        />
      </va-card>
    );
  }

  if (id) {
    return (
      <>
        <va-card show-shadow>
          <div className="auth-card">
            <div className="auth-header-icon">
              <va-icon icon="account_circle" size={4} />{' '}
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
                  <div className="vads-u-display--flex vads-u-margin-top--1p5">
                    <div className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-top--0p5 vads-u-margin-right--1">
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
                    <div className="vads-u-display--flex vads-u-margin-top--1p5">
                      <div className="vads-u-margin-right--1 vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-top--0p5">
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
                  <div className="vads-u-display--flex vads-u-margin-top--1p5">
                    <div className="vads-u-margin-right--1 vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-top--0p5">
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
                    <div className="vads-u-display--flex vads-u-margin-top--1p5">
                      <div className="vads-u-margin-right--1 vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-top--0p5">
                        <va-icon icon="file_download" size={2} />
                      </div>
                      <va-link
                        filetype="VCF"
                        filename="accredited_representative_contact"
                        href={vcfUrl}
                        text="Download your accredited representative's contact information"
                      />
                    </div>
                  )}
                <div className="vads-u-display--flex vads-u-margin-top--1p5">
                  <div className="vads-u-margin-right--1 vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-top--0p5">
                    <va-icon icon="search" size={2} />
                  </div>
                  <va-link
                    href="https://www.va.gov/resources/va-accredited-representative-faqs/"
                    text="Learn about accredited representatives"
                  />
                </div>
              </div>
            </div>
          </div>
        </va-card>
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
      <DynamicHeader slot="headline">
        We can’t check if you have an accredited representative.
      </DynamicHeader>
      <React.Fragment key=".1">
        <p>We’re sorry. Our system isn’t working right now. Try again later.</p>

        <p className="vads-u-margin-y--0">
          If it still doesn’t work, call us at{' '}
          <va-telephone contact={CONTACTS.VA_BENEFITS} extension={0} /> to check
          if you have an accredited representative.
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
