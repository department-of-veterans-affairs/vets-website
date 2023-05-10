export const fillProviderFacility = (data, arrayIndex) => {
  cy.fill(
    `input[name=root_providerFacility_${arrayIndex}_providerFacilityName]`,
    data.providerFacility[arrayIndex].providerFacilityName,
  );
  const selectId = `root_providerFacility_${arrayIndex}_providerFacilityAddress`;
  cy.fillAddress(
    selectId,
    data.providerFacility[arrayIndex].providerFacilityAddress,
  );
  cy.fill(
    `textarea#root_providerFacility_${arrayIndex}_conditionsTreated`,
    data.providerFacility[arrayIndex].conditionsTreated,
  );
  cy.fillDate(
    `root_providerFacility_${arrayIndex}_treatmentDateRange_from`,
    data.providerFacility[arrayIndex].treatmentDateRange.from,
  );
  cy.fillDate(
    `root_providerFacility_${arrayIndex}_treatmentDateRange_to`,
    data.providerFacility[arrayIndex].treatmentDateRange.to,
  );
};
