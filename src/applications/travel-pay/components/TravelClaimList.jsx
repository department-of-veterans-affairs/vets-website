import PropTypes from 'prop-types';
import TravelClaimCard from './TravelClaimCard';

export default function TravelClaimList(props) {
  const { claims } = props;

  return claims.map(travelClaim => TravelClaimCard(travelClaim));
}

TravelClaimList.propTypes = {
  claims: PropTypes.array,
};
