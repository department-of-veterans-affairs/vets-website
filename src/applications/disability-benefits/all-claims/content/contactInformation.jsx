import React from 'react';
import moment from 'moment';

import AddressViewField from 'platform/forms-system/src/js/components/AddressViewField';

const PhoneViewField = ({ formData: phoneNumber = '', name }) => {
  const midBreakpoint = -7;
  const lastPhoneString = phoneNumber.slice(-4);
  const middlePhoneString = phoneNumber.slice(midBreakpoint, -4);
  const firstPhoneString = phoneNumber.slice(0, midBreakpoint);

  const phoneString = `${firstPhoneString}-${middlePhoneString}-${lastPhoneString}`;
  return (
    <p>
      <strong>{name}</strong>:{' '}
      {phoneNumber.trim().length > 0 ? phoneString : ''}
    </p>
  );
};

const EmailViewField = ({ formData, name }) => (
  <p>
    <strong>{name}</strong>: {formData || ''}
  </p>
);

const EffectiveDateViewField = ({ formData }) => {
  const { from, to } = formData;
  const dateFormat = 'MMM D, YYYY';
  const fromDateString = moment(from).format(dateFormat);
  return to ? (
    <p>
      We’ll use this address starting on {fromDateString} until{' '}
      {moment(to).format(dateFormat)}:
    </p>
  ) : (
    <p>We’ll use this address starting on {fromDateString}:</p>
  );
};

export const ForwardingAddressViewField = ({ formData }) => {
  const { effectiveDate } = formData;
  return (
    <div>
      <EffectiveDateViewField formData={effectiveDate} />
      <AddressViewField formData={formData} />
    </div>
  );
};

export const phoneEmailViewField = ({ formData }) => {
  const { primaryPhone, emailAddress } = formData;
  return (
    <div>
      <PhoneViewField formData={primaryPhone} name="Primary phone" />
      <EmailViewField formData={emailAddress} name="Email address" />
    </div>
  );
};

export const forwardingAddressDescription = () => (
  <p>
    If you give us a temporary or forwarding address, we’ll look at the dates
    you provide to see if we need to use this address when scheduling any exams.
  </p>
);

export const contactInfoDescription = ({ formName = 'disability claim' }) => (
  <p className="contact-info-description" id="contact-info">
    This is the contact information we have on file for you. Please review it
    make sure the information below is correct. We’ll send any important
    information about your {formName} to your mailing address. After you submit
    your claim, we’ll send you a confirmation email to your email address.
  </p>
);

export const contactInfoUpdateHelpDescription = () => (
  <div className="contact-info-help-description" id="help-description">
    <p>
      Any updates you make here to your contact information will only apply to
      this application. If you want to update your contact information for all
      of your VA accounts,{' '}
      <a href="/profile/contact-information">please go to your profile page.</a>
    </p>
  </div>
);
