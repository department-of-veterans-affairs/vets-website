import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { fetchDebtLetters } from '../actions';

const DebtLettersWrapper = ({
  isPending,
  isPendingVBMS,
  children,
  showDebtLetters,
  isProfileUpdating,
  isLoggedIn,
  getDebtLetters,
}) => {
  useEffect(
    () => {
      if (showDebtLetters) {
        getDebtLetters();
      }
    },
    [getDebtLetters, showDebtLetters],
  );

  if (isPending || isPendingVBMS || isProfileUpdating) {
    return (
      <div className="vads-u-margin--5">
        <LoadingIndicator
          setFocus
          message="Please wait while we load the application for you."
        />
      </div>
    );
  }

  if (showDebtLetters === false || isLoggedIn === false) {
    window.location.replace('/manage-va-debt');
    return (
      <div className="vads-u-margin--5">
        <LoadingIndicator
          setFocus
          message="Please wait while we load the application for you."
        />
      </div>
    );
  }

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--4 vads-u-margin-top--2 vads-u-font-family--serif">
      {children}
    </div>
  );
};

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
  ...bindActionCreators({ getDebtLetters: fetchDebtLetters }, dispatch),
});

DebtLettersWrapper.propTypes = {
  children: PropTypes.array,
  getDebtLetters: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  isPending: PropTypes.bool,
  isPendingVBMS: PropTypes.bool,
  isProfileUpdating: PropTypes.bool,
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
