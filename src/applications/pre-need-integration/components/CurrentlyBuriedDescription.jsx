import { useSelector } from 'react-redux';
import { isAuthorizedAgent, isVeteran } from '../utils/helpers';

export default function CurrentlyBuriedDescription() {
  const data = useSelector(state => state.form.data || {});

  if (isVeteran(data)) {
    if (!isAuthorizedAgent(data)) {
      return 'Provide the details of the person(s) currently buried in a VA national cemetery under your eligibility.';
    }
    return 'Provide the details of the person(s) currently buried in a VA national cemetery under the applicant’s eligibility.';
  }
  return 'Provide the details of the person(s) currently buried in a VA national cemetery under the sponsor’s eligibility.';
}
