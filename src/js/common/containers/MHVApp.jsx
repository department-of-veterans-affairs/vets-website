import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AcceptTermsPrompt from '../components/AcceptTermsPrompt';
import AlertBox from '../components/AlertBox';
import LoadingIndicator from '../components/LoadingIndicator';
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

  isIneligible = () => this.props.account.state === 'ineligible';

  handleAccountState = () => {
    if (this.isIneligible()) { return; }

    if (this.needsTermsAcceptance()) {
      this.props.fetchLatestTerms(TERMS_NAME);
    } else if (!this.isAccessible()) {
      this.props.createMHVAccount();
    }
  }

  render() {
    const { account, terms } = this.props;

    if (account.polling) {
      return <LoadingIndicator setFocus message="Creating your MHV account..."/>;
    }

    if (account.loading || terms.loading) {
      return <LoadingIndicator setFocus message="Loading your information..."/>;
    }

    if (account.errors || terms.errors) {
      const headline = terms.errors ?
        'We\'re not able to process the MHV terms and conditions' :
        'We\'re not able to process your MHV account';

      const content = (
        <p>
          Please <a onClick={() => { window.location.reload(true); }}>refresh this page</a> or try again later. If this problem persists, please call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
        </p>
      );

      return (
        <AlertBox
          headline={headline}
          content={content}
          isVisible
          status="error"/>
      );
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
  children: PropTypes.node
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
