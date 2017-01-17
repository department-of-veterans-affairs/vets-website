import React, { Component, PropTypes } from 'react';

class FacilityPhoneLink extends Component {
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
        <a href={`tel:${phone}`}>
          {phone.replace(re, '$1-$2-$3 $4$5').replace(/x$/, '')}
        </a>
      </div>
    );
  }

  render() {
    const { attributes: { phone } } = this.props.facility;

    return (
      <div>
        {this.renderPhoneNumber('Main Number', phone.main, 'phone')}
        {this.renderPhoneNumber('Mental Health', phone.mental_health_clinic)}
      </div>
    );
  }
}

FacilityPhoneLink.propTypes = {
  facility: PropTypes.object,
};

export default FacilityPhoneLink;
