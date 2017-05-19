import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { checkAcceptance } from '../../user-profile/actions';

import AcceptTermsPrompt from './AcceptTermsPrompt';
import LoadingIndicator from '../../common/components/LoadingIndicator';

class RequiredTermsAcceptanceView extends React.Component {
  componentWillMount() {
    this.props.checkAcceptance();
    window.scrollTo(0, 0);
  }

  render() {
    const { terms } = this.props;
    const acceptTermsComponent = <AcceptTermsPrompt/>;

    let view;

    if (terms.loading === true) {
      view = <LoadingIndicator setFocus message="Loading your information"/>;
    } else if (terms.acceptance) {
      view = this.props.children;
    } else {
      view = acceptTermsComponent;
    }

    return (
      <div>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(RequiredTermsAcceptanceView);
