import { connect } from 'react-redux';
import { getAppData } from '../selectors/selectors';

const CannotRelinquishLabel = () => {
  return 'I’m not eligible for Chapter 30 or Chapter 1606 benefits';
};

const mapStateToProps = state => ({
  ...getAppData(state),
});

export default connect(mapStateToProps)(CannotRelinquishLabel);
