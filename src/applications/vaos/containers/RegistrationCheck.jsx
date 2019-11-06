import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import Breadcrumbs from '../components/Breadcrumbs';
import { FETCH_STATUS } from '../utils/constants';
import { checkRegistration } from '../actions/registration';
import NoEnrollmentMessage from '../components/NoEnrollmentMessage';
import NoRegistrationMessage from '../components/NoRegistrationMessage';

export class RegistrationCheck extends React.Component {
  componentDidMount() {
    this.props.checkRegistration();
  }
  render() {
    const { status, isEnrolled, hasRegisteredSystems, children } = this.props;

    if (status === FETCH_STATUS.loading || status === FETCH_STATUS.notStarted) {
      return <LoadingIndicator message="Check your VA registration" />;
    }

    if (status === FETCH_STATUS.failed) {
      return (
        <AlertBox status="error" headline="Sorry, something went wrong">
          Sorry, we ran into an error when trying to check your VHA facility
          registration. Please try again later.
        </AlertBox>
      );
    }

    if (isEnrolled && hasRegisteredSystems) {
      return children;
    }

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs />
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
            {!isEnrolled && <NoEnrollmentMessage />}
            {isEnrolled && !hasRegisteredSystems && <NoRegistrationMessage />}
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
