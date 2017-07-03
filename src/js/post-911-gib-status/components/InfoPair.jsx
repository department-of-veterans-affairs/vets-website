import React from 'react';
import PropTypes from 'prop-types';

class InfoPair extends React.Component {
  render() {
    const { spacingClass } = this.props;

    const gridRowClasses = spacingClass ?
        `usa-grid-full ${this.props.spacingClass}`
        : 'usa-grid-full';

    const row = (
      <div className={gridRowClasses}>
        <div className="usa-width-one-third">
          <span><strong>{this.props.label}: </strong></span>
        </div>
        <div className="usa-width-two-thirds">
          {this.props.value}
        </div>
      </div>
    );

    let rowToDisplay;
    // Some rows should display the value even if the value is 0,
    // while other rows shouldn't display anything if the value is 0.
    // If this prop is passed, the value should be displayed regardless
    // of if it is 0 or not.
    // If the prop is not passed, check first if the value exists before
    // determining whether or not to display it.
    if (this.props.displayIfZero) {
      rowToDisplay = row;
    } else {
      rowToDisplay = this.props.value && row;
    }

    return (
      rowToDisplay || null
    );
  }
}

InfoPair.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  spacingClass: PropTypes.string,
  displayIfZero: PropTypes.bool
};

export default InfoPair;

