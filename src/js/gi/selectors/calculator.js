import { createSelector } from 'reselect';

const getConstants = (state) => state.constants.constants;

const getEligibilityDetails = (state) => {
  const details = Object.assign({}, state.eligibility);
  delete details.dropdowns;
  return details;
};

const getRequiredAttributes = (_state, props) => {
  const { type, bah } = props;
  return { type, bah };
};

export const calculatedBenefits = createSelector(
  [getConstants, getEligibilityDetails, getRequiredAttributes],
  (constant, eligibility, attribute) => {
    // const derived = getDerivedAttributes(constant, eligibility, attribute);

    return {};
  }
);
