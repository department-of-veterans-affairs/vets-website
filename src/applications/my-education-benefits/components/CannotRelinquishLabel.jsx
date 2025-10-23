import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAppData } from '../selectors/selectors';

const CannotRelinquishLabel = ({ showMebEnhancements09 }) => {
  return showMebEnhancements09
    ? "I'm not eligible for Chapter 30 or Chapter 1606 benefits"
    : "I'm not sure";
};

CannotRelinquishLabel.prototypes = {
  showMebEnhancements09: PropTypes.bool,
};

const mapStateToProps = state => ({
  ...getAppData(state),
});

export default connect(mapStateToProps)(CannotRelinquishLabel);
