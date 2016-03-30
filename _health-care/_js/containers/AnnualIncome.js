import { connect } from 'react-redux';

import AnnualIncomeSection from '../components/financial-assessment/AnnualIncomeSection';
import { updateField } from '../actions';
import * as calculated from '../store/calculated.js';

function mapStateToProps(state) {
  return {
    data: state.annualIncome,
    external: calculated.financialAssessment(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(updateField(['annualIncome', field], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
const AnnualIncome = connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(AnnualIncomeSection);

export default AnnualIncome;
