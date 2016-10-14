import React from 'react';

import MessageProviderLink from './MessageProviderLink';

class ContactCard extends React.Component {
  render() {
    return (
      <div className="rx-contact-card">
        <h3 className="rx-heading va-h-ruled">Contact</h3>
        <div className="rx-contact-line">
          <span className="rx-contact-header">Facility:&nbsp;</span>
          {this.props.facilityName}
        </div>
        <div className="rx-contact-line">
          <span className="rx-contact-header">Phone number:&nbsp;</span>
          {this.props.phoneNumber}
        </div>
        <MessageProviderLink/>
      </div>
    );
  }
}

ContactCard.propTypes = {
  facilityName: React.PropTypes.string.isRequired,
  phoneNumber: React.PropTypes.string.isRequired
};

export default ContactCard;
