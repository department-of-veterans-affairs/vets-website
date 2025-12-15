import {
  getProviderDetailsTitle,
  getProviderModalDeleteTitle,
} from '../../utils/evidence';

export const content = {
  title: (addOrEdit, index) =>
    getProviderDetailsTitle(addOrEdit, index, 'nonVa'),
  description:
    'Enter the name and address of the private provider, facility, medical center, clinic, or VA Vet Center you want us to request your records from.',
  nameLabel: 'Location name',
  addressLabels: {
    country: 'Country',
    street: 'Street address',
    street2: 'Street address line 2',
    city: 'City',
    state: 'State',
    postal: 'Postal code',
  },
  dateStart: 'First treatment date',
  dateEnd: 'Last treatment date',
  modal: {
    title: ({ locationAndName }) =>
      getProviderModalDeleteTitle(locationAndName),
    description: 'We’ve saved your current information',
    yes: 'Yes, keep location',
    no: 'No, remove location',
  },
  addAnotherLink: 'Add another private provider or VA Vet Center location',
};
