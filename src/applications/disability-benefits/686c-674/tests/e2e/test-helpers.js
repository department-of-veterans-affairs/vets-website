const mock = require('platform/testing/e2e/mock-helpers');

// loop through all options and click each one
export const select686Options = (client, options, data) => {
  options.forEach(option => {
    client.fillCheckbox(
      `input[name="root_view:selectable686Options_${option}"]`,
      data.optionsSelection[option],
    );
  });
};

export const fillVeteranData = (client, data) => {
  client
    .fill('input[name="root_first"]', data.veteranInformation.firstName)
    .fill('input[name="root_last"]', data.veteranInformation.lastName)
    .fill('input[name="root_ssn"]', data.veteranInformation.ssn)
    .selectDropdown('root_birthDateMonth', data.veteranInformation.dobMonth)
    .selectDropdown('root_birthDateDay', data.veteranInformation.dobDay)
    .fill('input[name="root_birthDateYear"]', data.veteranInformation.dobYear);
};

export const fillVeteranDomesticAddress = (client, data) => {
  client
    .selectDropdown(
      'root_veteranAddress_countryName',
      data.veteranDomesticAddress.countryName,
    )
    .fill(
      'input[name="root_veteranAddress_addressLine1"]',
      data.veteranDomesticAddress.addressLine1,
    )
    .fill(
      'input[name="root_veteranAddress_city"]',
      data.veteranDomesticAddress.city,
    )
    .selectDropdown(
      'root_veteranAddress_stateCode',
      data.veteranDomesticAddress.stateCode,
    )
    .fill(
      'input[name="root_veteranAddress_zipCode"]',
      data.veteranDomesticAddress.zipCode,
    )
    .fill(
      'input[name="root_phoneNumber"]',
      data.veteranDomesticAddress.phoneNumber,
    );
};

export const fillChildNameInformation = (client, data, index = 0) => {
  client
    .fill(
      `input[name="root_childrenToAdd_${index}_first"]`,
      data.childInformation[0].firstName,
    )
    .fill(
      `input[name="root_childrenToAdd_${index}_last"]`,
      data.childInformation[0].lastName,
    )
    .fill(
      `input[name="root_childrenToAdd_${index}_ssn"]`,
      data.childInformation[0].ssn,
    )
    .selectDropdown(
      `root_childrenToAdd_${index}_birthDateMonth`,
      data.childInformation[0].dobMonth,
    )
    .selectDropdown(
      `root_childrenToAdd_${index}_birthDateDay`,
      data.childInformation[0].dobDay,
    )
    .fill(
      `input[name="root_childrenToAdd_${index}_birthDateYear"]`,
      data.childInformation[0].dobYear,
    );
};

export const fillChildPlaceOfBirthAndStatusInformation = (
  client,
  data,
  isMarried = false,
) => {
  client
    .fill(
      'input[name="root_childPlaceOfBirth_state"]',
      data.childInformation[0].birthLocationState,
    )
    .fill(
      'input[name="root_childPlaceOfBirth_city"]',
      data.childInformation[0].birthLocationCity,
    )
    .fillCheckbox(
      'input[name="root_childStatus_biological"]',
      data.childInformation[0].status.biological,
    );
  if (isMarried) {
    client
      .selectRadio(
        'root_childPreviouslyMarried',
        data.childInformation[0].previouslyMarriedYes,
      )
      .selectDropdown(
        'root_childPreviousMarriageDetails_dateMarriageEndedMonth',
        data.childInformation[0].previousMarriageInformation.monthEnded,
      )
      .selectDropdown(
        'root_childPreviousMarriageDetails_dateMarriageEndedDay',
        data.childInformation[0].previousMarriageInformation.dayEnded,
      )
      .fill(
        'input[name="root_childPreviousMarriageDetails_dateMarriageEndedYear"]',
        data.childInformation[0].previousMarriageInformation.yearEnded,
      )
      .selectRadio(
        'root_childPreviousMarriageDetails_reasonMarriageEnded',
        data.childInformation[0].previousMarriageInformation
          .reasonMarriageEnded,
      );
  } else {
    client.selectRadio(
      'root_childPreviouslyMarried',
      data.childInformation[0].previouslyMarriedNo,
    );
  }
};

export const fillChildAddressStatus = (
  client,
  data,
  doesLiveWithVeteran = true,
) => {
  if (!doesLiveWithVeteran) {
    client
      .selectRadio(
        'root_doesChildLiveWithYou',
        data.childInformation[0].doesChildLiveWithYouNo,
      )
      .selectRadio(
        'root_doesChildLiveWithYou',
        data.childInformation[0].doesChildLiveWithYouNo,
      )
      .fill(
        'input[name="root_childAddressInfo_personChildLivesWith_first"]',
        data.childInformation[0].personChildLivesWithDetails.firstName,
      )
      .fill(
        'input[name="root_childAddressInfo_personChildLivesWith_last"]',
        data.childInformation[0].personChildLivesWithDetails.lastName,
      )
      .selectDropdown(
        'root_childAddressInfo_childAddress_countryName',
        data.childInformation[0].personChildLivesWithDetails.countryName,
      )
      .fill(
        'input[name="root_childAddressInfo_childAddress_addressLine1"]',
        data.childInformation[0].personChildLivesWithDetails.addressLine1,
      )
      .fill(
        'input[name="root_childAddressInfo_childAddress_city"]',
        data.childInformation[0].personChildLivesWithDetails.city,
      )
      .selectDropdown(
        'root_childAddressInfo_childAddress_stateCode',
        data.childInformation[0].personChildLivesWithDetails.stateCode,
      )
      .fill(
        'input[name="root_childAddressInfo_childAddress_zipCode"]',
        data.childInformation[0].personChildLivesWithDetails.zipCode,
      );
  } else {
    client
      .selectRadio(
        'root_doesChildLiveWithYou',
        data.childInformation[0].doesChildLiveWithYouYes,
      )
      .selectRadio(
        'root_doesChildLiveWithYou',
        data.childInformation[0].doesChildLiveWithYouYes,
      );
  }
};

export const fillSpousePersonalInformation = (client, data) => {
  client
    .fill(
      'input[name="root_spouseFullName_first"]',
      data.spouseInformation.firstName,
    )
    .fill(
      'input[name="root_spouseFullName_last"]',
      data.spouseInformation.lastName,
    )
    .fill('input[name="root_spouseSSN"]', data.spouseInformation.ssn)
    .selectDropdown('root_spouseDOBMonth', data.spouseInformation.dobMonth)
    .selectDropdown('root_spouseDOBDay', data.spouseInformation.dobDay)
    .fill('input[name="root_spouseDOBYear"]', data.spouseInformation.dobYear)
    .selectRadio('root_isSpouseVeteran', data.spouseInformation.isVeteran)
    .fill(
      'input[name="root_spouseVAFileNumber"]',
      data.spouseInformation.vaFileNumber,
    )
    .fill(
      'input[name="root_spouseServiceNumber"]',
      data.spouseInformation.serviceNumber,
    );
};

export const fillCurrentMarriageInformation = (client, data) => {
  client
    .selectDropdown(
      'root_dateOfMarriageMonth',
      data.currentMarriageInformation.dateOfMarriage.month,
    )
    .selectDropdown(
      'root_dateOfMarriageDay',
      data.currentMarriageInformation.dateOfMarriage.day,
    )
    .fill(
      'input[name="root_dateOfMarriageYear"]',
      data.currentMarriageInformation.dateOfMarriage.year,
    )
    .fill(
      'input[name="root_locationOfMarriage_state"]',
      data.currentMarriageInformation.locationOfMarriage.state,
    )
    .fill(
      'input[name="root_locationOfMarriage_city"]',
      data.currentMarriageInformation.locationOfMarriage.city,
    )
    .selectRadio(
      'root_marriageType',
      data.currentMarriageInformation.typeOfMarriage,
    );
};

export const fillSpouseAddressInformation = (
  client,
  data,
  doesLiveWithVeteran = true,
) => {
  if (!doesLiveWithVeteran) {
    client
      .selectRadio(
        'root_spouseDoesLiveWithVeteran',
        data.currentMarriageInformation.doesLiveWithVeteranNo,
      )
      .selectRadio(
        'root_spouseDoesLiveWithVeteran',
        data.currentMarriageInformation.doesLiveWithVeteranNo,
      )
      .fill(
        'input[name="root_currentSpouseReasonForSeparation"]',
        data.currentMarriageInformation.reasonForSeparation,
      )
      .selectDropdown(
        'root_currentSpouseAddress_countryName',
        data.currentMarriageInformation.spouseAddress.countryName,
      )
      .fill(
        'input[name="root_currentSpouseAddress_addressLine1"]',
        data.currentMarriageInformation.spouseAddress.addressLine1,
      )
      .fill(
        'input[name="root_currentSpouseAddress_city"]',
        data.currentMarriageInformation.spouseAddress.city,
      )
      .selectDropdown(
        'root_currentSpouseAddress_stateCode',
        data.currentMarriageInformation.spouseAddress.stateCode,
      )
      .fill(
        'input[name="root_currentSpouseAddress_zipCode"]',
        data.currentMarriageInformation.spouseAddress.zipCode,
      );
  } else {
    client
      .selectRadio(
        'root_spouseDoesLiveWithVeteran',
        data.currentMarriageInformation.doesLiveWithVeteranYes,
      )
      .selectRadio(
        'root_spouseDoesLiveWithVeteran',
        data.currentMarriageInformation.doesLiveWithVeteranYes,
      );
  }
};

export const fillSpouseMarriageHistory = (
  client,
  data,
  spouseWasMarriedBefore = false,
) => {
  if (spouseWasMarriedBefore) {
    client
      .selectRadio(
        'root_spouseWasMarriedBefore',
        data.currentMarriageInformation.spouseWasMarriedBeforeYes,
      )
      .selectRadio(
        'root_spouseWasMarriedBefore',
        data.currentMarriageInformation.spouseWasMarriedBeforeYes,
      )
      .fill(
        'input[name="root_spouseMarriageHistory_0_formerSpouseName_first"]',
        data.spouseInformation.marriageHistory[0].firstName,
      )
      .fill(
        'input[name="root_spouseMarriageHistory_0_formerSpouseName_last"]',
        data.spouseInformation.marriageHistory[0].lastName,
      );
  } else {
    client
      .selectRadio(
        'root_spouseWasMarriedBefore',
        data.currentMarriageInformation.spouseWasMarriedBeforeNo,
      )
      .selectRadio(
        'root_spouseWasMarriedBefore',
        data.currentMarriageInformation.spouseWasMarriedBeforeNo,
      );
  }
};

export const fillSpouseMarriageHistoryDetails = (client, data) => {
  client
    .selectDropdown(
      'root_marriageStartDateMonth',
      data.spouseInformation.marriageHistory[0].marriageStartDateMonth,
    )
    .selectDropdown(
      'root_marriageStartDateDay',
      data.spouseInformation.marriageHistory[0].marriageStartDateDay,
    )
    .fill(
      'input[name="root_marriageStartDateYear"]',
      data.spouseInformation.marriageHistory[0].marriageStartDateYear,
    )
    .fill(
      'input[name="root_marriageStartLocation_state"]',
      data.spouseInformation.marriageHistory[0].locationState,
    )
    .fill(
      'input[name="root_marriageStartLocation_city"]',
      data.spouseInformation.marriageHistory[0].locationCity,
    )
    .selectRadio(
      'root_reasonMarriageEnded',
      data.spouseInformation.marriageHistory[0].reasonMarriageEnded,
    )
    .selectDropdown(
      'root_marriageEndDateMonth',
      data.spouseInformation.marriageHistory[0].marriageEndDateMonth,
    )
    .selectDropdown(
      'root_marriageEndDateDay',
      data.spouseInformation.marriageHistory[0].marriageEndDateDay,
    )
    .fill(
      'input[name="root_marriageEndDateYear"]',
      data.spouseInformation.marriageHistory[0].marriageEndDateYear,
    )
    .fill(
      'input[name="root_marriageEndLocation_state"]',
      data.spouseInformation.marriageHistory[0].locationState,
    )
    .fill(
      'input[name="root_marriageEndLocation_city"]',
      data.spouseInformation.marriageHistory[0].locationCity,
    );
};

export const fillVeteranMarriageHistory = (
  client,
  data,
  veteranWasMarriedBefore = false,
) => {
  if (veteranWasMarriedBefore) {
    client
      .selectRadio(
        'root_veteranWasMarriedBefore',
        data.currentMarriageInformation.veteranWasMarriedBeforeYes,
      )
      .selectRadio(
        'root_veteranWasMarriedBefore',
        data.currentMarriageInformation.veteranWasMarriedBeforeYes,
      )
      .fill(
        'input[name="root_veteranMarriageHistory_0_formerSpouseName_first"]',
        data.veteranInformation.marriageHistory[0].firstName,
      )
      .fill(
        'input[name="root_veteranMarriageHistory_0_formerSpouseName_last"]',
        data.veteranInformation.marriageHistory[0].lastName,
      );
  } else {
    client
      .selectRadio(
        'root_veteranWasMarriedBefore',
        data.currentMarriageInformation.veteranWasMarriedBeforeNo,
      )
      .selectRadio(
        'root_veteranWasMarriedBefore',
        data.currentMarriageInformation.veteranWasMarriedBeforeNo,
      );
  }
};

export const fillVeteranMarriageHistoryDetails = (client, data) => {
  client
    .selectDropdown(
      'root_marriageStartDateMonth',
      data.veteranInformation.marriageHistory[0].marriageStartDateMonth,
    )
    .selectDropdown(
      'root_marriageStartDateDay',
      data.veteranInformation.marriageHistory[0].marriageStartDateDay,
    )
    .fill(
      'input[name="root_marriageStartDateYear"]',
      data.veteranInformation.marriageHistory[0].marriageStartDateYear,
    )
    .fill(
      'input[name="root_marriageStartLocation_state"]',
      data.veteranInformation.marriageHistory[0].locationState,
    )
    .fill(
      'input[name="root_marriageStartLocation_city"]',
      data.veteranInformation.marriageHistory[0].locationCity,
    )
    .selectRadio(
      'root_reasonMarriageEnded',
      data.veteranInformation.marriageHistory[0].reasonMarriageEnded,
    )
    .selectDropdown(
      'root_marriageEndDateMonth',
      data.veteranInformation.marriageHistory[0].marriageEndDateMonth,
    )
    .selectDropdown(
      'root_marriageEndDateDay',
      data.veteranInformation.marriageHistory[0].marriageEndDateDay,
    )
    .fill(
      'input[name="root_marriageEndDateYear"]',
      data.veteranInformation.marriageHistory[0].marriageEndDateYear,
    )
    .fill(
      'input[name="root_marriageEndLocation_state"]',
      data.veteranInformation.marriageHistory[0].locationState,
    )
    .fill(
      'input[name="root_marriageEndLocation_city"]',
      data.veteranInformation.marriageHistory[0].locationCity,
    );
};

export const initApplicationSubmitMock = token => {
  mock(token, {
    path: '/v0/21-686c',
    verb: 'post',
    value: {
      data: {
        attributes: {
          formSubmissionId: '123fake-submission-id-567',
          timestamp: '2016-05-16',
        },
      },
    },
  });
};
