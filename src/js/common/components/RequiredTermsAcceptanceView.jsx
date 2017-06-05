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
    if (!this.props.terms.acceptance) {
      this.props.checkAcceptance(this.props.termsName);
      this.props.fetchLatestTerms(this.props.termsName);
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { terms, topContent } = this.props;

    let view;

    if (terms.loading === true) {
      view = <LoadingIndicator setFocus message="Loading your information"/>;
    } else if (terms.acceptance) {
      view = this.props.children;
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
