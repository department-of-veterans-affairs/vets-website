import React from 'react';
import { useSelector } from 'react-redux';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import Email from '../components/Email';
import Phone from '../components/Phone';
import GoogleMapLink from '../components/GoogleMapLink';
import AddressBlock from '../components/AddressBlock';
import NeedHelp from '../components/NeedHelp';
import {
  getFormSubtitle,
  getOrgName,
  getRepType,
  getEntityAddressAsObject,
} from '../utilities/helpers';
import { parsePhoneNumber } from '../utilities/parsePhoneNumber';

export default function NextStepsPage() {
  const { data: formData } = useSelector(state => state.form);
  const repType = getRepType(formData);
  const attributes = formData['view:selectedRepresentative']?.attributes;
  const address = getEntityAddressAsObject(attributes);
  const orgName = getOrgName(formData);
  const addressExists =
    address.addressLine1 &&
    address.city &&
    address.stateCode &&
    address.zipCode;
  const { contact, extension } = parsePhoneNumber(attributes?.phone);

  const recordContactLinkClick = () => {
    // pending analytics event
  };

  const cardNameContent = () => {
    if (repType === 'Organization') {
      return (
        <h3 className="vads-u-font-family--serif vads-u-margin-top--0p5">
          {orgName}
        </h3>
      );
    }
    if (repType === 'VSO Representative') {
      return (
        <>
          <h3 className="vads-u-font-family--serif vads-u-margin-top--0p5">
            {orgName}
          </h3>
          <p className="vads-u-margin-top--0">{attributes.fullName}</p>
        </>
      );
    }
    return (
      <h3 className="vads-u-font-family--serif vads-u-margin-top--0p5">
        {attributes.fullName}
      </h3>
    );
  };

  return (
    <div>
      <FormTitle
        title="Request help from a VA accredited representative or VSO"
        subTitle={getFormSubtitle(formData)}
      />
      <h2>Your next steps</h2>
      <p className="vads-u-margin-bottom--3">
        Both you and the accredited {repType} will need to sign your form. You
        can bring your form to them in person or mail it to them.
      </p>
      {addressExists && (
        <AddressBlock
          repName={
            formData['view:selectedRepresentative']?.attributes?.fullName
          }
          orgName={orgName}
          address={address}
        />
      )}
      <p>
        After your form is signed, you or the accredited {repType} can submit it
        online, by mail, or in person.
      </p>
      <va-link href="" text="Learn how to submit your form" />
      <h2 className="vads-u-margin-top--3">
        After you submit your printed form
      </h2>
      <p>
        We usually process your form within 1 week. You can contact the
        accredited representative any time.
      </p>
      <va-card class="vads-u-padding-left--2 vads-u-padding-top--1p5 vads-u-padding-bottom--1p5">
        <div className="vads-u-margin-top--0 vads-u-display--flex">
          <va-icon icon="account_circle" size="4" />
          <div className="vads-u-margin-left--1">
            {cardNameContent()}
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
      <a className="vads-c-action-link--green vads-u-margin-top--2" href="/">
        Go back to VA.gov
      </a>
      <NeedHelp />
    </div>
  );
}
