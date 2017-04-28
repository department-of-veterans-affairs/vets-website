import PropTypes from 'prop-types';
import React from 'react';

class SampleFeature extends React.Component {
  render() {
    if (!this.props.isEnabled) {
      return null;
    }

    return <div></div>;
  }
}

SampleFeature.propTypes = {
  isEnabled: PropTypes.bool,
};

SampleFeature.defaultProps = {
  isEnabled: __SAMPLE_ENABLED__, // eslint-disable-line no-undef
};

export default SampleFeature;
