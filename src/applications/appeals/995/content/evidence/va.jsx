import {
  getProviderDetailsTitle,
  getProviderModalDeleteTitle,
} from '../../utils/evidence';

// Prompt
export const promptTitle =
  'Do you want us to get your VA medical records or military health records?';

export const locationContent = {
  question: (addOrEdit, index) =>
    getProviderDetailsTitle(addOrEdit, index, 'va'),
  label: 'Enter the name of facility or provider that treated you',
  hint: 'You can add the names of more locations later',
  requiredError: 'Enter a treatment location',
  maxLengthError: 'You can enter a maximum of 255 characters',
};

export const content = {
  treatmentDate:
    'If you received treatment before 2005, when did they treat you?',
  treatmentDateHint:
    'We’ll use this date to help us find your paper records from 2005 or earlier (you can estimate).',
  noDate: 'I don’t have the date',
  addAnotherLink: 'Add another VA or military treatment location',
  modal: {
    title: ({ location }) => getProviderModalDeleteTitle(location),
    description: 'We’ve saved your current information.',
    yes: 'Yes, keep location',
    no: 'No, remove location',
  },
};
