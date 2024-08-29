import directDepositDefinition from 'platform/forms-system/src/js/definitions/directDeposit';

export default directDepositDefinition({
  affectedBenefits: 'disability compensation',
  unaffectedBenefits: 'pension and education',
  optionalFields: {
    declineDirectDeposit: true,
    bankName: true,
  },
});
