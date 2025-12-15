import React from 'react';
import PropTypes from 'prop-types';

export const MailDescription = ({ address }) => {
  return (
    <>
      <p>Mail the document to this address:</p>
      <p className="va-address-block">
        {address.organization}
        <br />
        {address.department}
        <br />
        {address.poBox}
        <br />
        {address.city}, {address.state} {address.zip}
      </p>
    </>
  );
};

MailDescription.propTypes = {
  address: PropTypes.shape({
    organization: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    poBox: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
  }).isRequired,
};

export const InPersonDescription = ({ findVaLocations }) => {
  return (
    <>
      <p>Bring the document to a VA regional office.</p>
      <p>
        <va-link
          href={findVaLocations}
          text="Find a VA regional office near you"
        />
      </p>
    </>
  );
};

InPersonDescription.propTypes = {
  findVaLocations: PropTypes.string.isRequired,
};

export const ConfirmationDescription = ({ contactInfo }) => {
  return (
    <p>
      To confirm we’ve received a document you submitted by mail or in person,
      call us at {contactInfo.phone} (TTY: {contactInfo.tty}
      ). We’re here {contactInfo.hours}.
    </p>
  );
};

ConfirmationDescription.propTypes = {
  contactInfo: PropTypes.shape({
    phone: PropTypes.string.isRequired,
    tty: PropTypes.string.isRequired,
    hours: PropTypes.string.isRequired,
  }).isRequired,
};
