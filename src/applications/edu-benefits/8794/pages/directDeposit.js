import directDepositDefinition from '@department-of-veterans-affairs/platform-forms-system/directDeposit';

export default directDepositDefinition({
  affectedBenefits: 'disability compensation',
  unaffectedBenefits: 'pension and education',
  optionalFields: {
    declineDirectDeposit: true,
    bankName: true,
  },
});
