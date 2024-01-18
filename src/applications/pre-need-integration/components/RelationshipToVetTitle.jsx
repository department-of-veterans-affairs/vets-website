import { useSelector } from 'react-redux';
import { isAuthorizedAgent } from '../utils/helpers';

export default function RelationshipToVetTitle() {
  const data = useSelector(state => state.form.data || {});

  if (isAuthorizedAgent(data)) {
    return 'What’s the applicant’s relationship to the Veteran or service member they’re connected to?';
  }
  return 'What’s your relationship to the Veteran or service member you’re connected to?';
}
