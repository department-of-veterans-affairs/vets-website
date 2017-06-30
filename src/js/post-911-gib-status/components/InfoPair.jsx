import React from 'react';
import PropTypes from 'prop-types';

class InfoPair extends React.Component {
  render() {
    const { spacingClass } = this.props;

    const gridRowClasses = spacingClass ?
        `usa-grid-full ${this.props.spacingClass}`
        : 'usa-grid-full';

    return (
      this.props.value &&
        <div className={gridRowClasses}>
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
  value: PropTypes.any,
  spacingClass: PropTypes.string
};

export default InfoPair;

