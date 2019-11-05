import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import { FETCH_STATUS } from '../utils/constants';
import { checkRegistration } from '../actions/registration';

export class RegistrationCheck extends React.Component {
  componentDidMount() {
    this.props.checkRegistration();
  }
  render() {
    const { status, hasRegisteredSystems, children } = this.props;

    if (status === FETCH_STATUS.loading || status === FETCH_STATUS.notStarted) {
      return <LoadingIndicator message="Check your VA registration" />;
    }

    if (hasRegisteredSystems) {
      return children;
    }

    return (
      <AlertBox
        status="error"
        headline="Sorry, we couldn't find a VHA facility registration"
      >
        <p>
          To use this app to schedule or request an appointment at a VA
          facility, or to request community care assistance, you need to be:
        </p>
        <ol>
          <li>Actively enrolled in VA Healthcare, and</li>
          <li>Registered with a VA health care facility</li>
        </ol>
        <p>
          If you need to register, or you believe this is an error, please
          contact your{' '}
          <a href="/find-locations" target="_blank" rel="noopener noreferrer">
            local facility's
          </a>{' '}
          registration office.
        </p>
      </AlertBox>
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
