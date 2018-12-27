export const completeUnemployabilityStatus = (client, data) => {
  const unemployabilityStatus = data['view:unemployabilityStatus'];

  client.selectYesNo('root_view:unemployabilityStatus', unemployabilityStatus);
};
