import { useSelector } from 'react-redux';
import { isAuthorizedAgent } from '../utils/helpers';

export default function RelationshipToVetDescription() {
  const data = useSelector(state => state.form.data || {});

  if (isAuthorizedAgent(data)) {
    return 'You told us you’re filling out this application for someone else. Now we’ll ask you about their details (the applicant).';
  }
  return ' ';
}
