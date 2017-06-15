import React from 'react';
import PropTypes from 'prop-types';


class InfoPair extends React.Component {
  render() {
    return (
      this.props.value &&
        <div className="usa-grid-full section-line">
          <div className="usa-width-one-third">
            <span><strong>{this.props.label}: </strong></span>
          </div>
          <div className="usa-width-one-third">
            {this.props.value}
          </div>
        </div>
    || null);
  }
}

InfoPair.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any
};

export default InfoPair;

