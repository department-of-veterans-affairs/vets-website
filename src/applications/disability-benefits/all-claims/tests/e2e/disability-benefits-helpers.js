export const clickAddAnother = (client, i, list) => {
  if (i < list.length - 1) client.click('.va-growable-add-btn');
};

export const completeAlternateName = (client, data) => {
  const hasAlternateName = data['view:hasAlternateName'];

  client.selectYesNo('root_view:hasAlternateName', hasAlternateName);
  if (hasAlternateName) {
    data.alternateNames.forEach((name, i, list) => {
      client.fillName(`root_alternateNames_${i}`, name);

      clickAddAnother(client, i, list);
    });
  }
};

export const completeMilitaryRetiredPay = (client, data) => {
  const retiredPay = data['view:hasMilitaryRetiredPay'];

  client.selectYesNo('root_view:hasMilitaryRetiredPay', retiredPay);
  if (retiredPay) {
    client.selectDropdown(
      'root_militaryRetiredPayBranch',
      data.militaryRetiredPayBranch,
    );
  }
};

export const completeCombatZonePost911 = (client, data) => {
  const served = data.servedInCombatZonePost911;

  client.selectYesNo('root_servedInCombatZonePost911', served);
};

export const completeMilitaryHistory = (client, data) => {
  // With prefill there is already an entry for military history so need to click Add Another first
  client.click('.va-growable-add-btn');
  const { servicePeriods } = data.serviceInformation;

  servicePeriods.forEach((period, i, list) => {
    const { serviceBranch, dateRange } = period;

    // increment i by 1 because of prefill
    client
      .selectDropdown(
        `root_serviceInformation_servicePeriods_${i + 1}_serviceBranch`,
        serviceBranch,
      )
      .fillDate(
        `root_serviceInformation_servicePeriods_${i + 1}_dateRange_from`,
        dateRange.from,
      )
      .fillDate(
        `root_serviceInformation_servicePeriods_${i + 1}_dateRange_to`,
        dateRange.to,
      );

    clickAddAnother(client, i, list);
  });
};

export const completeReservesNationalGuardInfo = (client, data) => {
  const {
    unitName,
    obligationTermOfServiceDateRange,
  } = data.serviceInformation.reservesNationalGuardService;

  client
    .fill(
      'input[name="root_serviceInformation_reservesNationalGuardService_unitName"]',
      unitName,
    )
    .fillDate(
      'root_serviceInformation_reservesNationalGuardService_obligationTermOfServiceDateRange_from',
      obligationTermOfServiceDateRange.from,
    )
    .fillDate(
      'root_serviceInformation_reservesNationalGuardService_obligationTermOfServiceDateRange_to',
      obligationTermOfServiceDateRange.to,
    );
};

export const completeFederalOrders = (client, data) => {
  const reservesNationalGuardService =
    data.serviceInformation.reservesNationalGuardService;
  const activated = reservesNationalGuardService['view:isTitle10Activated'];

  client.selectYesNo(
    'root_serviceInformation_reservesNationalGuardService_view:isTitle10Activated',
    activated,
  );
  if (activated) {
    const {
      title10ActivationDate,
      anticipatedSeparationDate,
    } = reservesNationalGuardService.title10Activation;
    client
      .fillDate(
        'root_serviceInformation_reservesNationalGuardService_title10Activation_title10ActivationDate',
        title10ActivationDate,
      )
      .fillDate(
        'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
        anticipatedSeparationDate,
      );
  }
};

export const selectDisabilities = client => {
  // Prefill data allows this to work
  client.fillCheckbox('input[name="root_ratedDisabilities_0"]', true);
};

export const completeNewDisability = (client, data) => {
  const newDisabilities = data['view:newDisabilities'];

  client.selectYesNo('root_view:newDisabilities', newDisabilities);
};

export const addNewDisability = (client, data) => {
  data.newDisabilities.forEach((disability, i, list) => {
    client.fill(
      `input[name="root_newDisabilities_${i}_condition"]`,
      disability.condition,
    );
    clickAddAnother(client, i, list);
  });
  client.click('body');
};

export const completeNewDisabilityFollowUp = (client, disability, index) => {
  client.selectRadio(`root_cause`, disability.cause);

  switch (disability.cause) {
    case 'NEW':
      client.assert.fail(
        `All fields on /new-disabilities/follow-up/${index} are required`,
      );
      client.fill(
        `textarea[id="root_primaryDescription"]`,
        disability.primaryDescription,
      );
      break;
    case 'SECONDARY':
    case 'WORSENED':
    case 'VA':
    default:
      client.assert.fail(
        `All fields on /new-disabilities/follow-up/${index} are required`,
      );
      break;
  }
};

export const selectPtsdTypes = (client, data) => {
  const selectablePtsdTypes = data['view:selectablePtsdTypes'];
  client
    .fillCheckbox(
      'input[name="root_view:selectablePtsdTypes_view:combatPtsdType"]',
      selectablePtsdTypes['view:combatPtsdType'],
    )
    .fillCheckbox(
      'input[name="root_view:selectablePtsdTypes_view:mstPtsdType"]',
      selectablePtsdTypes['view:mstPtsdType'],
    )
    .fillCheckbox(
      'input[name="root_view:selectablePtsdTypes_view:assaultPtsdType"]',
      selectablePtsdTypes['view:assaultPtsdType'],
    )
    .fillCheckbox(
      'input[name="root_view:selectablePtsdTypes_view:nonCombatPtsdType"]',
      selectablePtsdTypes['view:nonCombatPtsdType'],
    );
};

export const completePowStatus = (client, data) => {
  const powStatus = data['view:powStatus'];

  client.selectYesNo('root_view:powStatus', powStatus);
  if (powStatus) {
    const isPOW = data['view:isPOW'];

    isPOW.confinements.forEach((confinement, i, list) => {
      client
        .fillDate(`root_view:isPOW_confinements_${i}_from`, confinement.from)
        .fillDate(`root_view:isPOW_confinements_${i}_to`, confinement.to);
      clickAddAnother(client, i, list);
    });
  }
};

export const completeAdaptiveBenefits = (client, data) => {
  const modifyingCar = data['view:modifyingCar'];
  client
    .selectYesNo('root_view:modifyingHome', data['view:modifyingHome'])
    .selectYesNo('root_view:modifyingCar', modifyingCar);

  if (modifyingCar) {
    const needsCarHelp = data['view:needsCarHelp'];

    if (needsCarHelp) {
      client.selectYesNo(
        'root_view:needsCarHelp_view:alreadyClaimedVehicleAllowance',
        needsCarHelp['view:alreadyClaimedVehicleAllowance'],
      );
    }
  }
};

export const compeleteAidAndAttendance = (client, data) => {
  client.selectYesNo(
    'root_view:aidAndAttendance',
    data['view:aidAndAttendance'],
  );
};

// Possibly used outside of flow to, and including, 4142
// const completeApplicantInformation= (client, data) => {
//   client
//     .fillName('root_fullName', data.fullName)
//     .selectDropdown('root_gender', data.gender)
//     .fill('input[name="root_socialSecurityNumber"]', data.socialSecurityNumber)
//     .fillDate('root_dateOfBirth', data.dateOfBirth)
//     .selectDropdown('root_serviceBranch', data.serviceBranch);
// }

// const completeVeteranAddressInformation= (client, data) => {
//   const { addressLine1, city, state, zipCode } = data.veteran.mailingAddress;

//   client
//     .fill(
//       'input[name="root_veteran_mailingAddress_addressLine1"]',
//       addressLine1,
//     )
//     .fill('input[name="root_veteran_mailingAddress_city"]', city)
//     .selectDropdown('root_veteran_mailingAddress_state', state)
//     .fill('input[name="root_veteran_mailingAddress_zipCode"]', zipCode);
// }

// const completeHomelessness= (client, data) => {
//   client.selectYesNo(
//     'root_veteran_homelessness_isHomeless',
//     data.veteran.homelessness.isHomeless,
//   );
// }

// const completeVAFacilitiesInformation= (client, data) => {
//   data.treatments.forEach((treatment, i, list) => {
//     client
//       .waitForElementVisible(
//         `input[name="root_treatments_${i}_treatment_treatmentCenterName"]`,
//         Timeouts.normal,
//       )
//       .selectDropdown(
//         `root_treatments_${i}_treatment_startTreatmentMonth`,
//         data.treatments[0].startTreatmentMonth,
//       )
//       .selectDropdown(
//         `root_treatments_${i}_treatment_startTreatmentDay`,
//         data.treatments[0].startTreatmentDay,
//       )
//       .fill(
//         `input[name="root_treatments_${i}_treatment_startTreatmentYear"]`,
//         data.treatments[0].startTreatmentYear,
//       )
//       .selectDropdown(
//         `root_treatments_${i}_treatment_endTreatmentMonth`,
//         data.treatments[0].endTreatmentMonth,
//       )
//       .selectDropdown(
//         `root_treatments_${i}_treatment_endTreatmentDay`,
//         data.treatments[0].endTreatmentDay,
//       )
//       .fill(
//         `input[name="root_treatments_${i}_treatment_endTreatmentYear"]`,
//         data.treatments[0].endTreatmentYear,
//       )
//       .fill(
//         `input[name="root_treatments_${i}_treatment_treatmentCenterName"]`,
//         data.treatments[0].treatmentCenterName,
//       );
//     if (i < list.length - 1) client.click('.va-growable-add-btn');
//   });
// }
