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
    const accountStateChanged = prevProps.account.state !== this.props.account.state;
    if (accountStateChanged) { this.handleAccountState(); }
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
    const { account, errors, terms } = this.props;

    if (errors) {
      return mhvAccessError;
    }

    if (account.loading || terms.loading) {
      return <LoadingIndicator setFocus message="Loading your information..."/>;
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
  const { account, errors, terms } = state.user.profile.mhv;
  return { account, errors, terms };
};

const mapDispatchToProps = {
  acceptTerms,
  createMHVAccount,
  fetchLatestTerms,
  fetchMHVAccount
};

export default connect(mapStateToProps, mapDispatchToProps)(MHVApp);
