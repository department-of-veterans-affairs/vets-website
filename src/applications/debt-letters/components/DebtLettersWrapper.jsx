import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { bindActionCreators } from 'redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import PropTypes from 'prop-types';
import { fetchDebtLetters } from '../actions';

class DebtLettersWrapper extends Component {
  componentDidMount() {
    if (this.props.showDebtLetters !== false) {
      this.props.fetchDebtLetters();
    }
  }

  render() {
    const {
      isPending,
      isPendingVBMS,
      children,
      showDebtLetters,
      isProfileUpdating,
      isLoggedIn,
    } = this.props;

    if (isPending || isPendingVBMS || isProfileUpdating) {
      return <LoadingIndicator />;
    }

    if (showDebtLetters === false) {
      return window.location.replace('/');
    }

    if (isLoggedIn === false) {
      return window.location.replace('/manage-va-debt');
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
  isProfileUpdating: state.debtLetters.isProfileUpdating,
  isPendingVBMS: state.debtLetters.isPendingVBMS,
  showDebtLetters: toggleValues(state)[
    FEATURE_FLAG_NAMES.debtLettersShowLetters
  ],
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ fetchDebtLetters }, dispatch),
});

DebtLettersWrapper.propTypes = {
  isPending: PropTypes.bool.isRequired,
  isPendingVBMS: PropTypes.bool.isRequired,
  showDebtLetters: PropTypes.bool,
};

DebtLettersWrapper.defaultProps = {
  isPending: false,
  isPendingVBMS: false,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtLettersWrapper);
