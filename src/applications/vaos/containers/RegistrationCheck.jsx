import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import Breadcrumbs from '../components/Breadcrumbs';
import { FETCH_STATUS } from '../utils/constants';
import { checkRegistration } from '../actions/registration';
import NoRegistrationMessage from '../components/NoRegistrationMessage';
import ErrorMessage from '../components/ErrorMessage';

export class RegistrationCheck extends React.Component {
  componentDidMount() {
    this.props.checkRegistration();
  }
  render() {
    const { status, hasRegisteredSystems, children } = this.props;

    if (status === FETCH_STATUS.loading || status === FETCH_STATUS.notStarted) {
      return (
        <div className="vads-u-margin-y--5">
          <LoadingIndicator message="Looking for VA health care registrations" />
        </div>
      );
    }

    if (status === FETCH_STATUS.succeeded && hasRegisteredSystems) {
      return children;
    }

    let errorMessage;
    if (status === FETCH_STATUS.failed) {
      errorMessage = <ErrorMessage />;
    } else {
      errorMessage = <NoRegistrationMessage />;
    }

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs />
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
            {errorMessage}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.registration,
  };
}

const mapDispatchToProps = {
  checkRegistration,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationCheck);
