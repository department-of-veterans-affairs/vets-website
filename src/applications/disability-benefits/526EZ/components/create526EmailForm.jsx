import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import { apiRequest } from '../../../../platform/utilities/api';
import { requestStates } from '../../../../platform/utilities/constants';
import backendServices from '../../../../platform/user/profile/constants/backendServices';

class EmailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submissionStatus: requestStates.notCalled,
      email: '',
    };
  }

  updateEmail = event => {
    this.setState({ email: event.target.value });
  };

  submitEmail = event => {
    event.preventDefault();

    this.setState({ submissionStatus: requestStates.pending });

    /* apiRequest(`/form526_opt_in?email=${this.state.email}`, */
    apiRequest(
      '/form526_opt_in',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email: this.state.email }),
      },
      () => {
        this.setState({ submissionStatus: requestStates.succeeded });
      },
      () => {
        this.setState({ submissionStatus: requestStates.failed });
      },
    );
  };

  render() {
    const { loading, isLoggedIn, hasEVSSService } = this.props;
    const { submissionStatus, email } = this.state;
    if (loading) {
      return null;
    }

    if (!isLoggedIn) {
      return (
        <AlertBox
          isVisible
          headline="To use our new tool, you’ll need to sign in with your premium My HealtheVet or DS Logon account"
          content="If you don’t have a verified account, you can create an ID.me account to complete the verification process."
          status="info"
        />
      );
    }

    if (!hasEVSSService) {
      return (
        <AlertBox
          isVisible
          headline="We’re sorry. It looks like we’re missing some information needed for you to apply online for increased disability compensation."
          content="For help, please call Veterans Benefits Assistance at 1-800-827-1000, Monday through Friday, 8:00 a.m. to 9:00 p.m. (ET)."
          status="error"
        />
      );
    }

    if (submissionStatus === requestStates.succeeded) {
      return (
        <AlertBox
          isVisible
          headline="Thank you."
          content="We received your email address. We’ll contact you to schedule a time to try out the claim for increase tool."
          status="success"
        />
      );
    }

    if (submissionStatus === requestStates.failed) {
      return (
        <AlertBox
          isVisible
          headline="We’re sorry. We didn’t receive your email address."
          content="We're working to fix the problem. Please try again later."
          status="error"
        />
      );
    }

    const disabled = submissionStatus !== requestStates.notCalled;
    return (
      <form className="row">
        <label htmlFor="email-address" aria-controls="email-address">
          Email address
        </label>
        <input
          id="email-address"
          type="email"
          value={email}
          disabled={disabled}
          onChange={this.updateEmail}
        />
        <button
          id="submit-button"
          className="usa-input"
          onClick={this.submitEmail}
        >
          Submit Your Email
        </button>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
  loading: state.user.profile.loading,
  hasEVSSService: state.user.profile.services.includes(
    backendServices.EVSS_CLAIMS,
  ),
});

const ConnectedEmailForm = connect(mapStateToProps)(EmailForm);

export default function createDisabilityIncreaseApplicationStatus(store) {
  const root = document.getElementById('react-emailForm');
  if (root) {
    ReactDOM.render(<ConnectedEmailForm store={store} />, root);
  }
}
