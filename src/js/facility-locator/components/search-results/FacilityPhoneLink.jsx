import React, { Component, PropTypes } from 'react';

class FacilityPhoneLink extends Component {


  renderMentalHealthPhone() {
    const { attributes: { phone } } = this.props.facility;
    if (!phone.mental_health_clinic) {
      return null;
    }

    const re = /^(\d{3})[ -]?(\d{3})[ -]?(\d{4}) x (\d*)/;

    return (
      <div>
        <a href={`tel:${phone.mental_health_clinic}`}>
          <i className="fa fa-fw"/>
          Mental Health:<br/>
          <i className="fa fa-fw"/>{phone.mental_health_clinic.replace(re, '$1-$2-$3 x$4')}
        </a>
      </div>
    );
  }
  render() {
    const { attributes: { phone } } = this.props.facility;
    const re = /^(\d{3})[ -]?(\d{3})[ -]?(\d{4}) x (\d*)/;

    return (
      <div>
        <div>
          <a href={`tel:${phone.main}`}>
            <i className="fa fa-phone"/>
            Main:<br/>
            <i className="fa fa-fw"/>{phone.main.replace(re, '$1-$2-$3 x$4').replace(/ x$/, '')}
          </a>
        </div>
        {this.renderMentalHealthPhone()}
      </div>
    );
  }
}

FacilityPhoneLink.propTypes = {
  facility: PropTypes.object,
};

export default FacilityPhoneLink;
