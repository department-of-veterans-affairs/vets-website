import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
  checkAcceptance,
  fetchLatestTerms,
  acceptTerms,
} from '../../user-profile/actions';

import AcceptTermsPrompt from './AcceptTermsPrompt';
import LoadingIndicator from '../../common/components/LoadingIndicator';

export class RequiredTermsAcceptanceView extends React.Component {
  componentWillMount() {
    if (this.props.termsNeeded) {
      // this.props.checkAcceptance(this.props.termsName);
      this.props.fetchLatestTerms(this.props.termsName);
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { terms, topContent } = this.props;
    const enabled = this.props.isDataAvailable === true || typeof this.props.isDataAvailable === 'undefined';

    let view;

    if (terms.loading === true) {
      view = <LoadingIndicator setFocus message="Loading your information"/>;
    } else if (!this.props.termsNeeded) {
      view = React.Children.map(this.props.children,
        (child) => {
          let props = null;
          if (typeof child.type === 'function') {
            props = { isDataAvailable: enabled };
          }
          return React.cloneElement(child, props);
        }
      );
    } else {
      view = <AcceptTermsPrompt terms={terms} onAccept={this.props.acceptTerms}/>;
    }

    return (
      <div>
        {topContent}
        {view}
      </div>
    );
  }
}

RequiredTermsAcceptanceView.propTypes = {
  termsName: PropTypes.string.isRequired
};


const mapStateToProps = (state) => {
  const userState = state.user;

  return {
    terms: userState.profile.terms,
  };
};

const mapDispatchToProps = {
  checkAcceptance,
  fetchLatestTerms,
  acceptTerms,
};

export default connect(mapStateToProps, mapDispatchToProps)(RequiredTermsAcceptanceView);
