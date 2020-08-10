import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { bindActionCreators } from 'redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import PropTypes from 'prop-types';
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
      showDebtLetters,
      isLoggedIn,
    } = this.props;

    if (!isLoggedIn) {
      return window.location.replace('/manage-va-debt');
    }

    if (showDebtLetters === false) {
      return window.location.replace('/');
    }

    if (isPending || isPendingVBMS) {
      return <LoadingIndicator />;
    }

    return (
      <>
        {showDebtLetters ? (
          <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--4 vads-u-margin-top--2 vads-u-font-family--serif">
            {children}
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
  isPending: state.debtLetters.isPending,
  isPendingVBMS: state.debtLetters.isPendingVBMS,
  showDebtLetters: toggleValues(state)[
    FEATURE_FLAG_NAMES.debtLettersShowLetters
  ],
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ fetchDebtLetters, fetchDebtLettersVBMS }, dispatch),
});

DebtLettersWrapper.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isPending: PropTypes.bool.isRequired,
  isPendingVBMS: PropTypes.bool.isRequired,
  showDebtLetters: PropTypes.bool,
};

DebtLettersWrapper.defaultProps = {
  isLoggedIn: false,
  isPending: false,
  isPendingVBMS: false,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtLettersWrapper);
