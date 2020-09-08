import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import DebtLettersSummaryV1 from './DebtLettersSummaryV1';
import DebtLettersSummaryV2 from './DebtLettersSummaryV2';

const DebtLettersSummary = ({ showDebtLettersV2 }) => {
  return (
    <>
      {showDebtLettersV2 ? <DebtLettersSummaryV2 /> : <DebtLettersSummaryV1 />}
    </>
  );
};

const mapStateToProps = state => ({
  showDebtLettersV2: toggleValues(state)[
    FEATURE_FLAG_NAMES.debtLettersShowLettersV2
  ],
});

DebtLettersSummary.propTypes = {
  showDebtLettersV2: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(DebtLettersSummary);
