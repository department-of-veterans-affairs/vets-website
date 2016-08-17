import React from 'react';
import faker from 'faker';

import MessageProviderLink from './MessageProviderLink';

class ContactCard extends React.Component {
  render() {
    return (
      <div className="rx-contact-card">
        <h3 className="rx-heading va-h-ruled">Contact</h3>
        <MessageProviderLink/>
        <div className="rx-contact-line">
          <span className="rx-contact-header">Provider:&nbsp;</span>
          {faker.fake('{{name.firstName}} {{name.lastName}}')}
        </div>
        <div className="rx-contact-line">
          <span className="rx-contact-header">Facility:&nbsp;</span>
          {faker.commerce.department()}
        </div>
        <div className="rx-contact-line">
          <span className="rx-contact-header">Phone number:&nbsp;</span>
          {faker.phone.phoneNumber()}
        </div>
      </div>
    );
  }
}

export default ContactCard;
