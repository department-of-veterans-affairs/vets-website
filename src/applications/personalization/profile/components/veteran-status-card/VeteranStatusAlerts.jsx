import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const buildContactElements = item => {
  const contactNumber = `${CONTACTS.DS_LOGON.slice(
    0,
    3,
  )}-${CONTACTS.DS_LOGON.slice(3, 6)}-${CONTACTS.DS_LOGON.slice(6)}`;
  const startIndex = item.indexOf(contactNumber);

  if (startIndex === -1) {
    return item;
  }

  const before = item.slice(0, startIndex);
  const telephone = item.slice(
    startIndex,
    startIndex + contactNumber.length + 11,
  );
  const after = item.slice(startIndex + telephone.length);

  return (
    <>
      {before}
      <va-telephone contact={contactNumber} /> (
      <va-telephone contact={CONTACTS[711]} tty />){after}
    </>
  );
};

const VeteranStatusAlert = ({ headline, messages, status = 'error' }) => {
  return (
    <va-alert
      class="vads-u-margin-bottom--4"
      close-btn-aria-label="Close notification"
      status={status}
      visible
    >
      {headline && <h2 slot="headline">{headline}</h2>}
      {messages?.map((message, i) => (
        <p
          key={i}
          className={`${i === 0 ? 'vads-u-margin-top--0' : ''} ${
            i === messages.length - 1 ? 'vads-u-margin-bottom--0' : ''
          }`}
        >
          {message}
        </p>
      ))}
    </va-alert>
  );
};

VeteranStatusAlert.propTypes = {
  headline: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
};

export const NoServiceHistoryAlert = () => {
  return (
    <va-alert status="warning" class="vads-u-margin-bottom--4">
      <h2 slot="headline">
        We can’t match your information to any military service records
      </h2>
      <div>
        <p>We’re sorry for this issue.</p>
        <p>
          <b>
            If you want to learn what military service records may be on file
            for you
          </b>
          , call the Defense Manpower Data Center (DMDC) at{' '}
          <va-telephone contact={CONTACTS.DS_LOGON} />
          &nbsp;(
          <va-telephone contact={CONTACTS['711']} tty />
          ). The DMDC office is open Monday through Friday (except federal
          holidays), 8:00 a.m. to 8:00 p.m. ET.
        </p>
        <p>
          <b>
            If you think there might be a problem with your military service
            records
          </b>
          , you can apply for a correction.
        </p>
        <va-link
          href="https://www.archives.gov/veterans/military-service-records/correct-service-records.html"
          text="Learn how to correct your military service records on the National Archives website"
        />
        .
      </div>
    </va-alert>
  );
};

export const NotConfirmedAlert = ({
  headline = '',
  message = [],
  status = 'warning',
}) => {
  const messages = message.map(item => buildContactElements(item));
  return (
    <VeteranStatusAlert
      headline={headline}
      messages={messages}
      status={status}
    />
  );
};

NotConfirmedAlert.propTypes = {
  headline: PropTypes.string,
  message: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
};

export const PDFErrorAlert = () => {
  return (
    <VeteranStatusAlert
      headline="Something went wrong"
      messages={['We’re sorry. Try to print your Veteran Status Card later.']}
    />
  );
};

export const SystemErrorAlert = () => {
  return (
    <VeteranStatusAlert
      headline="Something went wrong"
      messages={['We’re sorry. Try to view your Veteran Status Card later.']}
      status="warning"
    />
  );
};

/**
 * Renders a dynamic alert body item based on its type
 * @param {Object} item - The body item from the API response
 * @param {number} index - The item index for key
 */
const renderBodyItem = (item, index) => {
  switch (item.type) {
    case 'text':
      return (
        <p key={index} className="vads-u-margin-y--1">
          {item.value}
        </p>
      );
    case 'phone':
      return (
        <p key={index} className="vads-u-margin-y--1">
          <va-telephone contact={item.value} />
          {item.tty && (
            <>
              {' '}
              (<va-telephone contact="711" tty />)
            </>
          )}
        </p>
      );
    case 'link':
      return (
        <p key={index} className="vads-u-margin-y--1">
          <va-link href={item.url} text={item.value} />
        </p>
      );
    default:
      return null;
  }
};

/**
 * Dynamic alert component for veteran status alerts
 * Renders alerts based on the new shared service API response structure
 */
export const DynamicVeteranStatusAlert = ({ attributes }) => {
  const { header, body, alert_type: alertType } = attributes;

  return (
    <va-alert
      class="vads-u-margin-bottom--4"
      close-btn-aria-label="Close notification"
      status={alertType || 'warning'}
      visible
    >
      {header && <h2 slot="headline">{header}</h2>}
      <div>{body?.map((item, index) => renderBodyItem(item, index))}</div>
    </va-alert>
  );
};

DynamicVeteranStatusAlert.propTypes = {
  attributes: PropTypes.shape({
    // eslint-disable-next-line camelcase -- API response uses snake_case
    alert_type: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
    body: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['text', 'phone', 'link']),
        url: PropTypes.string,
        value: PropTypes.string,
        tty: PropTypes.bool,
      }),
    ),
    header: PropTypes.string,
  }),
};
