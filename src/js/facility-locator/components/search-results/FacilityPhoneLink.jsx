import React, { Component, PropTypes } from 'react';

class FacilityPhoneLink extends Component {


  renderMentalHealthPhone() {
    const { attributes: { phone } } = this.props.facility;
    if (!phone.mental_health_clinic) {
      return null;
    }

    return (
      <span>
        <a href={`tel:${phone.mental_health_clinic}`}>
          <i className="fa fa-fw"/>
          Mental Health: {phone.main.replace(/ +x */, '')}
        </a>
      </span>
    );
  }
  render() {
    const { attributes: { phone } } = this.props.facility;

    return (
      <div>
        <span>
          <a href={`tel:${phone.main}`}>
            <i className="fa fa-phone" style={{ marginRight: '0.75rem' }}></i>
            Main: {phone.main.replace(/ +x */, '')}
          </a>
        </span><br/>
        {this.renderMentalHealthPhone()}
      </div>
    );
  }
}

FacilityPhoneLink.propTypes = {
  facility: PropTypes.object,
};

export default FacilityPhoneLink;
