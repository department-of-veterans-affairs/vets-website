import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import objectValues from 'lodash/fp/values';
import { isUserRegisteredForBeta } from '../../beta-enrollment/actions';
import { features } from '../../beta-enrollment/routes';

class BetaApp extends React.Component {

  static propTypes = {
    featureName: PropTypes.oneOf(objectValues(features)).isRequired
  };

  render() {
    if (this.props.loading) return null;
    if (this.props.isUserRegisteredForBeta(this.props.featureName)) return this.props.children;

    document.location.replace(this.props.redirect);
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.user.profile.loading
  };
};

const mapDispatchToProps = {
  isUserRegisteredForBeta
};

export { BetaApp, features };

export default connect(mapStateToProps, mapDispatchToProps)(BetaApp);
