import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../../common/components/LoadingIndicator';

export class MHVApp extends React.Component {
  componentDidMount() {
    const { accountState } = this.props;

    if (!accountState) {
      this.props.checkAccountLevel();
    } else if (!this.isAccessible()) {
      this.props.createAccount();
    }
  }

  componentDidUpdate(/* prevProps */) {
  }

  isAccessible = () => ['existing', 'upgraded'].includes(this.props.accountState);

  render() {
    return <LoadingIndicator message="Loading the application..."/>;
  }
}

MHVApp.propTypes = {
  accountState: PropTypes.string,
  termsName: PropTypes.string.isRequired,
  cancelPath: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MHVApp);
