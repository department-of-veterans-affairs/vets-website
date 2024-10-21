import React from 'react';
import { connect } from 'react-redux';
import Email from './Email';
import Phone from './Phone';
import GoogleMapLink from './GoogleMapLink';
import { parsePhoneNumber } from '../utilities/parsePhoneNumber';

const ContactAccreditedRepresentative = props => {
  const { formData } = props;

  const representative = formData?.['view:selectedRepresentative'];
  const isOrg = representative?.type === 'organization';
  const attributes = representative?.attributes;
  const accreditedOrganizations = attributes?.accreditedOrganizations?.data;

  const address = {
    addressLine1: (attributes?.addressLine1 || '').trim(),
    addressLine2: (attributes?.addressLine2 || '').trim(),
    addressLine3: (attributes?.addressLine3 || '').trim(),
    city: (attributes?.city || '').trim(),
    stateCode: (attributes?.stateCode || '').trim(),
    zipCode: (attributes?.zipCode || '').trim(),
  };

  const { contact, extension } = parsePhoneNumber(attributes?.phone);
  const addressExists =
    address.addressLine1 &&
    address.city &&
    address.stateCode &&
    address.zipCode;

  const recordContactLinkClick = () => {
    // pending analytics event
  };

  const warningContent = () => {
    if (isOrg) {
      return (
        <p>
          You’ll need to contact the accredited representative you’ve selected
          to make sure they’re available to help you, and you’ll need to ask
          them which VSO to name on your form.
        </p>
      );
    }
    return (
      <p>
        You’ll need to contact the accredited representative you’ve selected to
        make sure they’re available to help you.
      </p>
    );
  };

  const subNameContent = () => {
    if (isOrg) {
      return (
        <p>
          You can work with any accredited VSO representative at this
          organization.
        </p>
      );
    }
    if (accreditedOrganizations?.length === 0) {
      return <></>;
    }
    if (accreditedOrganizations?.length === 1) {
      return <p>{accreditedOrganizations[0]?.attributes?.name}</p>;
    }
    return (
      <div className="associated-organizations-info vads-u-margin-top--1p5">
        <va-additional-info
          trigger="Check Veterans Service Organizations"
          disable-border
          uswds
          class="appoint-additional-info"
        >
          <p>This VSO representative is accredited with these organizations:</p>
          <ul className="appoint-ul">
            {accreditedOrganizations?.map((org, index) => {
              return <li key={index}>{org.attributes.name}</li>;
            })}
          </ul>
        </va-additional-info>
      </div>
    );
  };

  return (
    <div>
      <div className="vads-u-display--flex vads-u-margin-bottom--4">
        <va-alert status="warning">
          <h2 slot="headline">Contact the accredited representative</h2>
          {warningContent()}
        </va-alert>
      </div>
      {attributes && (
        <va-card class="vads-u-padding-left--2 vads-u-padding-top--1">
          <div className="vads-u-margin-top--1p5 vads-u-display--flex">
            {!isOrg && <va-icon icon="account_circle" size="4" />}
            <div className="vads-u-margin-left--1">
              <h3 className="vads-u-font-family--serif vads-u-margin-top--0p5">
                {attributes.fullName || attributes.name}
              </h3>
              {subNameContent()}
              <div className="vads-u-margin-top--3">
                {addressExists && (
                  <GoogleMapLink
                    address={address}
                    recordClick={recordContactLinkClick}
                  />
                )}
                {attributes.email && (
                  <Email
                    email={attributes.email}
                    recordClick={recordContactLinkClick}
                  />
                )}
                {contact && (
                  <Phone
                    contact={contact}
                    extension={extension}
                    recordClick={recordContactLinkClick}
                  />
                )}
              </div>
            </div>
          </div>
        </va-card>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export default connect(
  mapStateToProps,
  null,
)(ContactAccreditedRepresentative);
