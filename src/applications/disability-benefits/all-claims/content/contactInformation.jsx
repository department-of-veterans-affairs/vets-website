import PropTypes from 'prop-types';
import React from 'react';

import AddressViewField from '@department-of-veterans-affairs/platform-forms-system/AddressViewField';

import { formatDate } from '../utils/dates';

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

PhoneViewField.propTypes = {
  formData: PropTypes.shape({
    phoneNumber: PropTypes.string,
  }),
  name: PropTypes.string,
};

const EmailViewField = ({ formData, name }) => (
  <p>
    <strong>{name}</strong>: {formData || ''}
  </p>
);

EmailViewField.propTypes = {
  formData: PropTypes.string,
  name: PropTypes.string,
};

const EffectiveDateViewField = ({ formData }) => {
  const { from, to } = formData;
  const dateFormat = 'MMM D, YYYY';
  const addMonthPeriod = str =>
    (str || '').replace(
      /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) /,
      '$1. ',
    );
  const fromDateString = from
    ? addMonthPeriod(formatDate(from, dateFormat))
    : '';
  const toDateString = to ? addMonthPeriod(formatDate(to, dateFormat)) : '';
  return to ? (
    <p>
      We’ll use this address starting on {fromDateString} until {toDateString}:
    </p>
  ) : (
    <p>We’ll use this address starting on {fromDateString}:</p>
  );
};

EffectiveDateViewField.propTypes = {
  formData: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
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
ForwardingAddressViewField.propTypes = {
  formData: PropTypes.shape({
    effectiveDate: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  }),
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
