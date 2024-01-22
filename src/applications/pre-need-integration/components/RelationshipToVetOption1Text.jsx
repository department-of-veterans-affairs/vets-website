import { useSelector } from 'react-redux';
import { isAuthorizedAgent } from '../utils/helpers';

export default function RelationshipToVetOption1Text() {
  const data = useSelector(state => state.form.data || {});
  let option1 = '';
  // if (isAuthorizedAgent(data)) {
  //   return 'Applicant is the Veteran or service member';
  // }
  // return 'I’m the Veteran or service member';

  if (isAuthorizedAgent(data)) {
    option1 = 'Applicant is the Veteran or service member';
  } else {
    option1 = 'I’m the Veteran or service member';
  }

  return {
    labels: {
      1: option1,
      2: 'Husband',
      3: 'Wife',
      4: 'Adult dependent daughter',
      5: 'Adult dependent son',
      6: 'Adult dependent stepdaughter',
      7: 'Adult dependent stepson',
      8: 'Other',
    },
    widgetProps: {
      1: { 'aria-describedby': 'veteran-relationship' },
      2: { 'aria-describedby': 'spouse-relationship' },
      3: { 'aria-describedby': 'spouse-relationship' },
      4: { 'aria-describedby': 'child-relationship' },
      5: { 'aria-describedby': 'child-relationship' },
      6: { 'aria-describedby': 'child-relationship' },
      7: { 'aria-describedby': 'child-relationship' },
      8: { 'aria-describedby': 'other-relationship' },
    },
  };
}
