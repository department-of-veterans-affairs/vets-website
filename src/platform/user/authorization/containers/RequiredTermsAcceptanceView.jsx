import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import scrollTo from 'platform/utilities/ui/scrollTo';
import recordEvent from '../../../monitoring/record-event';

import { fetchLatestTerms, acceptTerms } from '../../profile/actions';

import AcceptTermsPrompt from '../components/AcceptTermsPrompt';

export class RequiredTermsAcceptanceView extends React.Component {
  componentDidMount() {
    if (this.props.termsNeeded) {
      this.props.fetchLatestTerms(this.props.termsName);
      scrollTo(0);
    }
    recordEvent({ event: 'terms-shown' });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.termsNeeded !== this.props.termsNeeded) {
      scrollTo(0);
    }
  }

  render() {
    const { terms, topContent } = this.props;
    const enabled =
      this.props.isDataAvailable === true ||
      typeof this.props.isDataAvailable === 'undefined';

    let view;

    if (terms.loading === true) {
      view = (
        <va-loading-indicator set-focus message="Loading your information..." />
      );
    } else if (!this.props.termsNeeded) {
      view = React.Children.map(this.props.children, child => {
        let props = null;
        if (typeof child.type === 'function') {
          props = { isDataAvailable: enabled };
        }
        return React.cloneElement(child, props);
      });
    } else {
      view = (
        <AcceptTermsPrompt
          terms={terms}
          cancelPath={this.props.cancelPath}
          onAccept={this.props.acceptTerms}
        />
      );
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
  termsName: PropTypes.string.isRequired,
  cancelPath: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  const userState = state.user;

  return {
    terms: userState.profile.terms,
  };
};

const mapDispatchToProps = {
  fetchLatestTerms,
  acceptTerms,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequiredTermsAcceptanceView);
