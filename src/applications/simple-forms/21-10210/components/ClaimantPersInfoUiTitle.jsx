import PropTypes from 'prop-types';
import { CLAIM_OWNERSHIPS } from '../definitions/constants';

const ClaimantPersInfoUiTitle = props => {
  const { formData } = props;

  if (formData.claimOwnership === CLAIM_OWNERSHIPS.THIRD_PARTY) {
    return 'Tell us about the person who has the existing claim';
  }

  return 'Name and date of birth';
};

ClaimantPersInfoUiTitle.propTypes = {
  formData: PropTypes.shape({
    claimOwnership: PropTypes.string.isRequired,
  }).isRequired,
};

export default ClaimantPersInfoUiTitle;
