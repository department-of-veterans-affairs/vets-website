import PropTypes from 'prop-types';
import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../definitions/constants';

const VetPersInfoUiTitle = props => {
  const { formData } = props;

  if (formData.claimantType === CLAIMANT_TYPES.NON_VETERAN) {
    // Flows 3 & 4: non-vet claimant
    if (formData.claimOwnership === CLAIM_OWNERSHIPS.SELF) {
      // Flow 3: self-claim
      return 'Tell us about the Veteran you’re connected to';
    }
    // Flow 4: third-party claim
    return 'Tell us about the Veteran who’s connected to the claimant';
  }

  return 'Name and date of birth'; // Flows 1 & 2: vet claimant
};

VetPersInfoUiTitle.propTypes = {
  formData: PropTypes.shape({
    claimOwnership: PropTypes.string.isRequired,
    claimantType: PropTypes.string.isRequired,
  }).isRequired,
};

export default VetPersInfoUiTitle;
