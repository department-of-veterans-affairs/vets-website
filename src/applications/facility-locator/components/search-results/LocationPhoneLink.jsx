import PropTypes from 'prop-types';
import React, { Component } from 'react';

class LocationPhoneLink extends Component {
  renderPhoneNumber(title, phone, icon = 'fw') {
    if (!phone) {
      return null;
    }

    const re = /^(\d{3})[ -]?(\d{3})[ -]?(\d{4})[ ]?(x?)[ ]?(\d*)/;

    return (
      <div>
        <i className={`fa fa-${icon}`}/>
        <strong>{title}:</strong><br/>
        <i className="fa fa-fw"/>
        <a href={`tel:${phone.replace(/[ ]?x/, '')}`}>
          {phone.replace(re, '$1-$2-$3 $4$5').replace(/x$/, '')}
        </a>
      </div>
    );
  }

  render() {
    const { attributes: { phone } } = this.props.location;

    return (
      <div>
        {this.renderPhoneNumber('Main Number', phone.main, 'phone')}
        {this.renderPhoneNumber('Mental Health', phone.mentalHealthClinic)}
      </div>
    );
  }
}

LocationPhoneLink.propTypes = {
  location: PropTypes.object,
};

export default LocationPhoneLink;
