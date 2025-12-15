import { sub, format } from 'date-fns';

const child1 = sub(new Date(), { months: 11 });
const child2 = sub(new Date(), { years: 17 });

export const defaultData = {
  dependents: [
    {
      fullName: 'Morty Smith',
      relationship: 'Child',
      dob: format(child1, 'MMMM d, yyyy'),
      dateOfBirth: format(child1, 'MM/dd/yyyy'),
      ssn: '6791',
      age: 0,
    },
    {
      fullName: 'Summer Smith',
      relationship: 'Child',
      dob: format(child2, 'MMMM d, yyyy'),
      dateOfBirth: format(child2, 'MM/dd/yyyy'),
      ssn: '6790',
      age: 17,
      removalDate: format(sub(new Date(), { years: -1 }), 'MMMM d, yyyy'),
    },
  ],
  hasDependentsStatusChanged: 'Y',
};
