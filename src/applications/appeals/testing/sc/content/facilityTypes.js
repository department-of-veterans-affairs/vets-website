export const facilityTypeTitle =
  'Select all the types of facilities or providers that treated you';

export const facilityTypeTextLabel = 'Specify any other facility or provider';

export const facilityTypeChoices = {
  vetCenter: 'A VA Vet center',
  ccp: 'A community care provider that VA paid for',
  vamc: 'A VA medical center (also called a VAMC)',
  cobc: 'A community-based outpatient clinic (also called a COBC)',
  mtf:
    'A Department of Defense military treatment facility (also called an MTF)',
  nonVa: {
    title: 'A non-VA healthcare provider',
    description:
      'This includes providers who aren’t community care providers, and who don’t work at a military treatment facility. We’ll need to get your permission to get your medical records from this type of provider. Or you can upload these medical records yourself later in this application.',
  },
};
