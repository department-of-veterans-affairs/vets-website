import PropTypes from 'prop-types';

import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../definitions/constants';

const StatementUiTitle = props => {
  const { formData } = props;
  const { claimOwnership, claimantType } = formData;
  let titleStr = '';

  if (claimantType === CLAIMANT_TYPES.VETERAN) {
    titleStr =
      claimOwnership === CLAIM_OWNERSHIPS.SELF
        ? // Flow 1: self claim, vet claimant
          'Provide your statement'
        : // Flow 2: 3rd-party claim, vet claimant
          'Tell us about the claimed issue that you’re addressing on behalf of the Veteran';
  } else {
    // Flows 3 & 4: non-vet claimant
    titleStr = 'Tell us about the claimed issue that you’re addressing';
  }

  return titleStr;
};

StatementUiTitle.propTypes = {
  formData: PropTypes.shape({
    claimOwnership: PropTypes.string.isRequired,
    claimantType: PropTypes.string.isRequired,
  }).isRequired,
};

export default StatementUiTitle;
