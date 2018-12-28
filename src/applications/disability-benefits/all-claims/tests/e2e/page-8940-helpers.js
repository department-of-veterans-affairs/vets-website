export const completeUnemployabilityStatus = (client, data) => {
  client.selectYesNo('root_view:unemployable', data['view:unemployable']);
};
