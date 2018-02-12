import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AcceptTermsPrompt from './AcceptTermsPrompt';
import LoadingIndicator from './LoadingIndicator';
import { mhvAccessError } from '../utils/error-messages';
import {
  acceptTerms,
  createMHVAccount,
  fetchLatestTerms,
  fetchMHVAccount
} from '../../user-profile/actions';

const TERMS_NAME = 'mhvac';

export class MHVApp extends React.Component {
  componentDidMount() {
    const { account } = this.props;

    if (!account.state) {
      this.props.fetchMHVAccount();
    } else {
      this.handleAccountState();
    }
  }

  componentDidUpdate(prevProps) {
    const { account } = this.props;

    const accountStateChanged = prevProps.account.state !== account.state;
    if (accountStateChanged) { this.handleAccountState(); }

    const shouldPollAccount = account.polling && !account.loading && !this.isAccessible();
    if (shouldPollAccount) {
      setTimeout(() => {
        this.props.fetchMHVAccount();
      }, 1000 * account.polledTimes);
    }
  }

  needsTermsAcceptance = () => this.props.account.state === 'needs_terms_acceptance';

  isAccessible = () => ['existing', 'upgraded'].includes(this.props.account.state);

  handleAccountState = () => {
    if (this.needsTermsAcceptance()) {
      this.props.fetchLatestTerms(TERMS_NAME);
    } else if (!this.isAccessible()) {
      this.props.createMHVAccount();
    }
  }

  render() {
    const { account, terms } = this.props;

    if (account.loading || terms.loading) {
      return <LoadingIndicator setFocus message="Loading your information..."/>;
    }

    if (account.polling) {
      return <LoadingIndicator setFocus message="Creating your MHV account..."/>;
    }

    if (account.errors) {
      return <p>There was an error with your MHV account.</p>;
    }

    if (terms.errors) {
      return <p>There was an error fetching or accepting MHV terms and conditions.</p>;
    }

    if (this.needsTermsAcceptance()) {
      return <AcceptTermsPrompt terms={terms} cancelPath="/health-care/" onAccept={this.props.acceptTerms}/>;
    }

    if (!this.isAccessible()) {
      return mhvAccessError;
    }

    const enabled = this.props.isDataAvailable === true || typeof this.props.isDataAvailable === 'undefined';

    const view = React.Children.map(this.props.children,
      (child) => {
        let props = null;
        if (typeof child.type === 'function') {
          props = { isDataAvailable: enabled };
        }
        return React.cloneElement(child, props);
      }
    );

    return <div>{view}</div>;
  }
}

MHVApp.propTypes = {
  children: PropTypes.element
};

const mapStateToProps = (state) => {
  const { account, terms } = state.user.profile.mhv;
  return { account, terms };
};

const mapDispatchToProps = {
  acceptTerms,
  createMHVAccount,
  fetchLatestTerms,
  fetchMHVAccount
};

export default connect(mapStateToProps, mapDispatchToProps)(MHVApp);
