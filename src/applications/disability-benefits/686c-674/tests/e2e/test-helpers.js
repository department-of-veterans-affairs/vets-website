const mock = require('platform/testing/e2e/mock-helpers');

// Helper for filling a date
const dateFiller = (client, selector, month, day, year) => {
  client.selectDropdown(`${selector}Month`, month);
  client.selectDropdown(`${selector}Day`, day);
  client.fill(`input[name="${selector}Year"]`, year);
};

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
    .fill(
      'input[name="root_veteranInformation_fullName_first"]',
      data.veteranInformation.firstName,
    )
    .fill(
      'input[name="root_veteranInformation_fullName_last"]',
      data.veteranInformation.lastName,
    )
    .fill(
      'input[name="root_veteranInformation_ssn"]',
      data.veteranInformation.ssn,
    )
    .selectDropdown(
      'root_veteranInformation_birthDateMonth',
      data.veteranInformation.dobMonth,
    )
    .selectDropdown(
      'root_veteranInformation_birthDateDay',
      data.veteranInformation.dobDay,
    )
    .fill(
      'input[name="root_veteranInformation_birthDateYear"]',
      data.veteranInformation.dobYear,
    );
};

export const fillVeteranDomesticAddress = (client, data) => {
  client
    .selectDropdown(
      'root_veteranContactInformation_veteranAddress_countryName',
      data.veteranDomesticAddress.countryName,
    )
    .fill(
      'input[name="root_veteranContactInformation_veteranAddress_addressLine1"]',
      data.veteranDomesticAddress.addressLine1,
    )
    .fill(
      'input[name="root_veteranContactInformation_veteranAddress_city"]',
      data.veteranDomesticAddress.city,
    )
    .selectDropdown(
      'root_veteranContactInformation_veteranAddress_stateCode',
      data.veteranDomesticAddress.stateCode,
    )
    .fill(
      'input[name="root_veteranContactInformation_veteranAddress_zipCode"]',
      data.veteranDomesticAddress.zipCode,
    )
    .fill(
      'input[name="root_veteranContactInformation_phoneNumber"]',
      data.veteranDomesticAddress.phoneNumber,
    );
};

export const fillChildNameInformation = (client, data, index = 0) => {
  client
    .fill(
      `input[name="root_childrenToAdd_${index}_fullName_first"]`,
      data.childInformation[0].firstName,
    )
    .fill(
      `input[name="root_childrenToAdd_${index}_fullName_last"]`,
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
      'input[name="root_placeOfBirth_state"]',
      data.childInformation[0].birthLocationState,
    )
    .fill(
      'input[name="root_placeOfBirth_city"]',
      data.childInformation[0].birthLocationCity,
    )
    .fillCheckbox(
      'input[name="root_childStatus_biological"]',
      data.childInformation[0].status.biological,
    );
  if (isMarried) {
    client
      .selectRadio(
        'root_previouslyMarried',
        data.childInformation[0].previouslyMarriedYes,
      )
      .selectDropdown(
        'root_previousMarriageDetails_dateMarriageEndedMonth',
        data.childInformation[0].previousMarriageInformation.monthEnded,
      )
      .selectDropdown(
        'root_previousMarriageDetails_dateMarriageEndedDay',
        data.childInformation[0].previousMarriageInformation.dayEnded,
      )
      .fill(
        'input[name="root_previousMarriageDetails_dateMarriageEndedYear"]',
        data.childInformation[0].previousMarriageInformation.yearEnded,
      )
      .selectRadio(
        'root_previousMarriageDetails_reasonMarriageEnded',
        data.childInformation[0].previousMarriageInformation
          .reasonMarriageEnded,
      );
  } else {
    client.selectRadio(
      'root_previouslyMarried',
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
        'root_childAddressInfo_address_countryName',
        data.childInformation[0].personChildLivesWithDetails.countryName,
      )
      .fill(
        'input[name="root_childAddressInfo_address_addressLine1"]',
        data.childInformation[0].personChildLivesWithDetails.addressLine1,
      )
      .fill(
        'input[name="root_childAddressInfo_address_city"]',
        data.childInformation[0].personChildLivesWithDetails.city,
      )
      .selectDropdown(
        'root_childAddressInfo_address_stateCode',
        data.childInformation[0].personChildLivesWithDetails.stateCode,
      )
      .fill(
        'input[name="root_childAddressInfo_address_zipCode"]',
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
      'input[name="root_spouseInformation_fullName_first"]',
      data.spouseInformation.firstName,
    )
    .fill(
      'input[name="root_spouseInformation_fullName_last"]',
      data.spouseInformation.lastName,
    )
    .fill(
      'input[name="root_spouseInformation_ssn"]',
      data.spouseInformation.ssn,
    )
    .selectDropdown(
      'root_spouseInformation_birthDateMonth',
      data.spouseInformation.dobMonth,
    )
    .selectDropdown(
      'root_spouseInformation_birthDateDay',
      data.spouseInformation.dobDay,
    )
    .fill(
      'input[name="root_spouseInformation_birthDateYear"]',
      data.spouseInformation.dobYear,
    )
    .selectRadio(
      'root_spouseInformation_isVeteran',
      data.spouseInformation.isVeteran,
    )
    .fill(
      'input[name="root_spouseInformation_VAFileNumber"]',
      data.spouseInformation.vaFileNumber,
    )
    .fill(
      'input[name="root_spouseInformation_serviceNumber"]',
      data.spouseInformation.serviceNumber,
    );
};

export const fillCurrentMarriageInformation = (client, data) => {
  client
    .selectDropdown(
      'root_currentMarriageInformation_dateMonth',
      data.currentMarriageInformation.dateOfMarriage.month,
    )
    .selectDropdown(
      'root_currentMarriageInformation_dateDay',
      data.currentMarriageInformation.dateOfMarriage.day,
    )
    .fill(
      'input[name="root_currentMarriageInformation_dateYear"]',
      data.currentMarriageInformation.dateOfMarriage.year,
    )
    .fill(
      'input[name="root_currentMarriageInformation_location_state"]',
      data.currentMarriageInformation.locationOfMarriage.state,
    )
    .fill(
      'input[name="root_currentMarriageInformation_location_city"]',
      data.currentMarriageInformation.locationOfMarriage.city,
    )
    .selectRadio(
      'root_currentMarriageInformation_type',
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
        'root_doesLiveWithSpouse_spouseDoesLiveWithVeteran',
        data.currentMarriageInformation.doesLiveWithVeteranNo,
      )
      .selectRadio(
        'root_doesLiveWithSpouse_spouseDoesLiveWithVeteran',
        data.currentMarriageInformation.doesLiveWithVeteranNo,
      )
      .selectDropdown(
        'root_doesLiveWithSpouse_currentSpouseReasonForSeparation',
        data.currentMarriageInformation.reasonForSeparation,
      )
      .selectDropdown(
        'root_doesLiveWithSpouse_address_countryName',
        data.currentMarriageInformation.spouseAddress.countryName,
      )
      .fill(
        'input[name="root_doesLiveWithSpouse_address_addressLine1"]',
        data.currentMarriageInformation.spouseAddress.addressLine1,
      )
      .fill(
        'input[name="root_doesLiveWithSpouse_address_city"]',
        data.currentMarriageInformation.spouseAddress.city,
      )
      .selectDropdown(
        'root_doesLiveWithSpouse_address_stateCode',
        data.currentMarriageInformation.spouseAddress.stateCode,
      )
      .fill(
        'input[name="root_doesLiveWithSpouse_address_zipCode"]',
        data.currentMarriageInformation.spouseAddress.zipCode,
      );
  } else {
    client
      .selectRadio(
        'root_doesLiveWithSpouse_spouseDoesLiveWithVeteran',
        data.currentMarriageInformation.doesLiveWithVeteranYes,
      )
      .selectRadio(
        'root_doesLiveWithSpouse_spouseDoesLiveWithVeteran',
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
        'input[name="root_spouseMarriageHistory_0_fullName_first"]',
        data.spouseInformation.marriageHistory[0].firstName,
      )
      .fill(
        'input[name="root_spouseMarriageHistory_0_fullName_last"]',
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
      'root_startDateMonth',
      data.spouseInformation.marriageHistory[0].marriageStartDateMonth,
    )
    .selectDropdown(
      'root_startDateDay',
      data.spouseInformation.marriageHistory[0].marriageStartDateDay,
    )
    .fill(
      'input[name="root_startDateYear"]',
      data.spouseInformation.marriageHistory[0].marriageStartDateYear,
    )
    .fill(
      'input[name="root_startLocation_state"]',
      data.spouseInformation.marriageHistory[0].locationState,
    )
    .fill(
      'input[name="root_startLocation_city"]',
      data.spouseInformation.marriageHistory[0].locationCity,
    )
    .selectRadio(
      'root_reasonMarriageEnded',
      data.spouseInformation.marriageHistory[0].reasonMarriageEnded,
    )
    .selectDropdown(
      'root_endDateMonth',
      data.spouseInformation.marriageHistory[0].marriageEndDateMonth,
    )
    .selectDropdown(
      'root_endDateDay',
      data.spouseInformation.marriageHistory[0].marriageEndDateDay,
    )
    .fill(
      'input[name="root_endDateYear"]',
      data.spouseInformation.marriageHistory[0].marriageEndDateYear,
    )
    .fill(
      'input[name="root_endLocation_state"]',
      data.spouseInformation.marriageHistory[0].locationState,
    )
    .fill(
      'input[name="root_endLocation_city"]',
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
        'input[name="root_veteranMarriageHistory_0_fullName_first"]',
        data.veteranInformation.marriageHistory[0].firstName,
      )
      .fill(
        'input[name="root_veteranMarriageHistory_0_fullName_last"]',
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
      'root_startDateMonth',
      data.veteranInformation.marriageHistory[0].marriageStartDateMonth,
    )
    .selectDropdown(
      'root_startDateDay',
      data.veteranInformation.marriageHistory[0].marriageStartDateDay,
    )
    .fill(
      'input[name="root_startDateYear"]',
      data.veteranInformation.marriageHistory[0].marriageStartDateYear,
    )
    .fill(
      'input[name="root_startLocation_state"]',
      data.veteranInformation.marriageHistory[0].locationState,
    )
    .fill(
      'input[name="root_startLocation_city"]',
      data.veteranInformation.marriageHistory[0].locationCity,
    )
    .selectRadio(
      'root_reasonMarriageEnded',
      data.veteranInformation.marriageHistory[0].reasonMarriageEnded,
    )
    .selectDropdown(
      'root_endDateMonth',
      data.veteranInformation.marriageHistory[0].marriageEndDateMonth,
    )
    .selectDropdown(
      'root_endDateDay',
      data.veteranInformation.marriageHistory[0].marriageEndDateDay,
    )
    .fill(
      'input[name="root_endDateYear"]',
      data.veteranInformation.marriageHistory[0].marriageEndDateYear,
    )
    .fill(
      'input[name="root_endLocation_state"]',
      data.veteranInformation.marriageHistory[0].locationState,
    )
    .fill(
      'input[name="root_endLocation_city"]',
      data.veteranInformation.marriageHistory[0].locationCity,
    );
};

export const fillReportDivorceSpouseInformation = (client, data) => {
  client
    .fill(
      'input[name="root_reportDivorce_fullName_first"]',
      data.spouseInformation.firstName,
    )
    .fill(
      'input[name="root_reportDivorce_fullName_last"]',
      data.spouseInformation.lastName,
    )
    .selectDropdown(
      'root_reportDivorce_dateMonth',
      data.veteranInformation.marriageHistory[0].marriageEndDateMonth,
    )
    .selectDropdown(
      'root_reportDivorce_dateDay',
      data.veteranInformation.marriageHistory[0].marriageEndDateDay,
    )
    .fill(
      'input[name="root_reportDivorce_dateYear"]',
      data.veteranInformation.marriageHistory[0].marriageEndDateYear,
    );
};

export const fillReportDivorceLocationOfDivorce = (client, data) => {
  client
    .fill(
      'input[name="root_reportDivorce_location_state"]',
      data.veteranDomesticAddress.stateCode,
    )
    .fill(
      'input[name="root_reportDivorce_location_city"]',
      data.veteranDomesticAddress.city,
    );
};

export const fillReportDivorceReasonMarriageEnded = (client, data) => {
  client.selectRadio(
    'root_reportDivorce_reasonMarriageEnded',
    data.reportDivorce.reasonMarriageEnded,
  );
};

export const fillDeceasedName = (client, data) => {
  client
    .fill(
      'input[name="root_deaths_0_fullName_first"]',
      data.deceasedDependent.firstName,
    )
    .fill(
      'input[name="root_deaths_0_fullName_last"]',
      data.deceasedDependent.lastName,
    )
    .selectRadio('root_deaths_0_dependentType', data.deceasedDependent.type)
    .fillCheckbox(
      'input[name="root_deaths_0_childStatus_childUnder18"]',
      data.deceasedDependent.childTypes.under18,
    )
    .fillCheckbox(
      'input[name="root_deaths_0_childStatus_stepChild"]',
      data.deceasedDependent.childTypes.stepchild,
    );
};

export const fillDeceasedDetails = (client, data) => {
  client
    .selectDropdown('root_dateMonth', data.deceasedDependent.date.month)
    .selectDropdown('root_dateDay', data.deceasedDependent.date.day)
    .fill('input[name="root_dateYear"]', data.deceasedDependent.date.year)
    .fill(
      'input[name="root_location_state"]',
      data.deceasedDependent.location.state,
    )
    .fill(
      'input[name="root_location_city"]',
      data.deceasedDependent.location.city,
    );
};

export const fillChildMarriageDetails = (client, data) => {
  client
    .fill(
      'input[name="root_childMarriage_fullName_first"]',
      data.marriedChild.firstName,
    )
    .fill(
      'input[name="root_childMarriage_fullName_last"]',
      data.marriedChild.lastName,
    )
    .selectDropdown(
      'root_childMarriage_dateMarriedMonth',
      data.marriedChild.date.month,
    )
    .selectDropdown(
      'root_childMarriage_dateMarriedDay',
      data.marriedChild.date.day,
    )
    .fill(
      'input[name="root_childMarriage_dateMarriedYear"]',
      data.marriedChild.date.year,
    );
};

export const fillChildStoppedAttendingDetails = (client, data) => {
  client
    .fill(
      'input[name="root_childStoppedAttendingSchool_fullName_first"]',
      data.childStoppedAttending.firstName,
    )
    .fill(
      'input[name="root_childStoppedAttendingSchool_fullName_last"]',
      data.childStoppedAttending.lastName,
    )
    .selectDropdown(
      'root_childStoppedAttendingSchool_dateChildLeftSchoolMonth',
      data.childStoppedAttending.date.month,
    )
    .selectDropdown(
      'root_childStoppedAttendingSchool_dateChildLeftSchoolDay',
      data.childStoppedAttending.date.day,
    )
    .fill(
      'input[name="root_childStoppedAttendingSchool_dateChildLeftSchoolYear"]',
      data.childStoppedAttending.date.year,
    );
};

export const fillStepchildName = (client, data) => {
  client
    .fill(
      'input[name="root_stepChildren_0_fullName_first"]',
      data.deceasedDependent.firstName,
    )
    .fill(
      'input[name="root_stepChildren_0_fullName_last"]',
      data.deceasedDependent.lastName,
    );
};

export const fillStepchildDetails = (client, data) => {
  client
    .selectRadio('root_supportingStepchild', data.stepchild.supporting)
    .selectRadio('root_livingExpensesPaid', data.stepchild.supportingValue)
    .fill(
      'input[name="root_whoDoesTheStepchildLiveWith_first"]',
      data.stepchild.personChildLivesWith.first,
    )
    .fill(
      'input[name="root_whoDoesTheStepchildLiveWith_last"]',
      data.stepchild.personChildLivesWith.last,
    )
    .selectDropdown(
      'root_address_countryName',
      data.veteranDomesticAddress.countryName,
    )
    .fill(
      'input[name="root_address_addressLine1"]',
      data.veteranDomesticAddress.addressLine1,
    )
    .fill('input[name="root_address_city"]', data.veteranDomesticAddress.city)
    .selectDropdown(
      'root_address_stateCode',
      data.veteranDomesticAddress.stateCode,
    )
    .fill(
      'input[name="root_address_zipCode"]',
      data.veteranDomesticAddress.zipCode,
    );
};

export const fill674StudentInformation = (client, data) => {
  client.fill(
    'input[name="root_studentNameAndSSN_fullName_first"]',
    data.for674.studentInformation.firstName,
  );
  client.fill(
    'input[name="root_studentNameAndSSN_fullName_last"]',
    data.for674.studentInformation.lastName,
  );
  client.fill(
    'input[name="root_studentNameAndSSN_ssn"]',
    data.for674.studentInformation.ssn,
  );
  client.selectDropdown(
    'root_studentNameAndSSN_birthDateMonth',
    data.for674.studentInformation.dob.month,
  );
  client.selectDropdown(
    'root_studentNameAndSSN_birthDateDay',
    data.for674.studentInformation.dob.day,
  );
  client.fill(
    'input[name="root_studentNameAndSSN_birthDateYear"]',
    data.for674.studentInformation.dob.year,
  );
};

export const fill674StudentAddress = (client, data) => {
  client.selectDropdown(
    'root_studentAddressMarriageTuition_address_countryName',
    data.for674.studentAddress.country,
  );

  client.fill(
    'input[name="root_studentAddressMarriageTuition_address_addressLine1"]',
    data.for674.studentAddress.line1,
  );

  client.fill(
    'input[name="root_studentAddressMarriageTuition_address_city"]',
    data.for674.studentAddress.city,
  );

  client.selectDropdown(
    'root_studentAddressMarriageTuition_address_stateCode',
    data.for674.studentAddress.state,
  );

  client.fill(
    'input[name="root_studentAddressMarriageTuition_address_zipCode"]',
    data.for674.studentAddress.postal,
  );

  client.selectRadio('root_studentAddressMarriageTuition_wasMarried', 'N');
  client.selectRadio(
    'root_studentAddressMarriageTuition_tuitionIsPaidByGovAgency',
    'N',
  );
};

export const fill674StudentSchoolAddress = (client, data) => {
  client.fill(
    'input[name="root_schoolInformation_name"]',
    data.for674.schoolAddress.name,
  );
  client.selectDropdown(
    'root_schoolInformation_address_countryName',
    data.for674.schoolAddress.country,
  );
  client.fill(
    'input[name="root_schoolInformation_address_addressLine1"]',
    data.for674.schoolAddress.line1,
  );
  client.fill(
    'input[name="root_schoolInformation_address_city"]',
    data.for674.schoolAddress.city,
  );
  client.selectDropdown(
    'root_schoolInformation_address_stateCode',
    data.for674.schoolAddress.state,
  );
  client.fill(
    'input[name="root_schoolInformation_address_zipCode"]',
    data.for674.schoolAddress.postal,
  );
};

export const fill674StudentTermDates = (client, data) => {
  dateFiller(
    client,
    'root_currentTermDates_officialSchoolStartDate',
    data.for674.studentTermDates.schoolStart.month,
    data.for674.studentTermDates.schoolStart.day,
    data.for674.studentTermDates.schoolStart.year,
  );
  dateFiller(
    client,
    'root_currentTermDates_expectedStudentStartDate',
    data.for674.studentTermDates.studentStart.month,
    data.for674.studentTermDates.studentStart.day,
    data.for674.studentTermDates.studentStart.year,
  );
  dateFiller(
    client,
    'root_currentTermDates_expectedGraduationDate',
    data.for674.studentTermDates.graduation.month,
    data.for674.studentTermDates.graduation.day,
    data.for674.studentTermDates.graduation.year,
  );
  // This will need to change to 'N' when the bug fix for ticket #9835 is merged
  client.selectRadio('root_programInformation_studentIsEnrolledFullTime', 'Y');
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

export const initValidVaFileNumberMock = token => {
  return mock(token, {
    path: '/v0/profile/valid_va_file_number',
    verb: 'get',
    value: {
      data: {
        attributes: {
          validVaFileNumber: true,
        },
      },
    },
  });
};
