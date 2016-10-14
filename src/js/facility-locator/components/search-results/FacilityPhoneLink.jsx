import React, { Component, PropTypes } from 'react';

class FacilityPhoneLink extends Component {
  render() {
    const { attributes: { phone } } = this.props.facility;

    return (
      <span>
        <a href={`tel:${phone.main}`}>
          <i className="fa fa-phone" style={{ marginRight: '0.5rem' }}/> {phone.main}
        </a>
      </span>
    );
  }
}

FacilityPhoneLink.propTypes = {
  facility: PropTypes.object,
};

export default FacilityPhoneLink;
