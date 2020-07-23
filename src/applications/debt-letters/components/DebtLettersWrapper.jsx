import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import CallToActionWidget from 'platform/site-wide/cta-widget';
import { bindActionCreators } from 'redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { fetchDebtLetters, fetchDebtLettersVBMS } from '../actions';

class DebtLettersWrapper extends Component {
  componentDidMount() {
    if (this.props.showDebtLetters !== false) {
      this.props.fetchDebtLetters();
      this.props.fetchDebtLettersVBMS();
    }
  }

  render() {
    const {
      isPending,
      isPendingVBMS,
      children,
      isError,
      isErrorVBMS,
      showDebtLetters,
    } = this.props;

    if (showDebtLetters === false) {
      return document.location.replace('/');
    }

    if (isError && isErrorVBMS) {
      return (
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--4 vads-u-margin-top--2 vads-u-font-family--serif">
          <AlertBox
            headline="Error alert"
            content="Temp error text"
            status="error"
          />
        </div>
      );
    }

    if (isPending || isPendingVBMS) {
      return <LoadingIndicator />;
    }

    return (
      <>
        {showDebtLetters ? (
          <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--4 vads-u-margin-top--2 vads-u-font-family--serif">
            <CallToActionWidget appId="debt-letters">
              {children}
            </CallToActionWidget>
          </div>
        ) : (
          <div />
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
  isFetching: state.debtLetters.isFetching,
  isError: state.debtLetters.isError,
  isErrorVBMS: state.debtLetters.isErrorVBMS,
  isPending: state.debtLetters.isPending,
  isPendingVBMS: state.debtLetters.isPendingVBMS,
  showDebtLetters: toggleValues(state)[
    FEATURE_FLAG_NAMES.debtLettersShowLetters
  ],
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ fetchDebtLetters, fetchDebtLettersVBMS }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtLettersWrapper);
