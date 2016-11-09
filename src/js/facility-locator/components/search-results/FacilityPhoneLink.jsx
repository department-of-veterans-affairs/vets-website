import React, { Component, PropTypes } from 'react';

class FacilityPhoneLink extends Component {


  renderMentalHealthPhone() {
    const { attributes: { phone } } = this.props.facility;
    if (!phone.mental_health_clinic) {
      return null;
    }

    const re = /^(\d{3})[ -]?(\d{3})[ -]?(\d{4}) x (\d*)/;

    return (
      <span>
        <a href={`tel:${phone.mental_health_clinic}`}>
          <i className="fa fa-fw"/>
          Mental Health: {phone.mental_health_clinic.replace(re, '$1-$2-$3 x$4')}
        </a>
      </span>
    );
  }
  render() {
    const { attributes: { phone } } = this.props.facility;

    return (
      <span>
        <span>
          <a href={`tel:${phone.main}`}>
            <i className="fa fa-phone" style={{ marginRight: '0.75rem' }}></i>
            Main: {phone.main.replace(/ +x */, '')}
          </a>
        </span><br/>
        {this.renderMentalHealthPhone()}
      </span>
    );
  }
}

FacilityPhoneLink.propTypes = {
  facility: PropTypes.object,
};

export default FacilityPhoneLink;
