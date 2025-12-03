import {
  getProviderDetailsTitle,
  getProviderModalDeleteTitle,
} from '../../utils/evidence';

export const content = {
  title: (addOrEdit, index) => getProviderDetailsTitle(addOrEdit, index, 'va'),
  locationAndName: 'Enter the name of facility or provider that treated you',
  locationAndNameHint: 'You can add the names of more locations later',
  treatmentDate:
    'If you received treatment before 2005, when did they treat you?',
  treatmentDateHint:
    'We’ll use this date to help us find your paper records from 2005 or earlier (you can estimate).',
  noDate: 'I don’t have the date',
  addAnotherLink: 'Add another VA or military treatment location',
  modal: {
    title: ({ locationAndName }) =>
      getProviderModalDeleteTitle(locationAndName),
    description: 'We’ve saved your current information.',
    yes: 'Yes, keep location',
    no: 'No, remove location',
  },
};
