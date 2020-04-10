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

export const fillChildNameInformation = (client, data) => {
  client
    .fill(
      'input[name="root_childrenToAdd_0_first"]',
      data.childInformation[0].firstName,
    )
    .fill(
      'input[name="root_childrenToAdd_0_last"]',
      data.childInformation[0].lastName,
    )
    .fill(
      'input[name="root_childrenToAdd_0_ssn"]',
      data.childInformation[0].ssn,
    )
    .selectDropdown(
      'root_childrenToAdd_0_birthDateMonth',
      data.childInformation[0].dobMonth,
    )
    .selectDropdown(
      'root_childrenToAdd_0_birthDateDay',
      data.childInformation[0].dobDay,
    )
    .fill(
      'input[name="root_childrenToAdd_0_birthDateYear"]',
      data.childInformation[0].dobYear,
    );
};

export const fillChildPlaceOfBirthAndStatusInformation = (client, data) => {
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
    )
    .selectRadio(
      'root_childPreviouslyMarried',
      data.childInformation[0].previouslyMarried,
    );
};

export const fillChildAddressStatus = (client, data) => {
  client.selectRadio(
    'root_doesChildLiveWithYou',
    data.childInformation[0].doesChildLiveWithYou,
  );
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
    .selectRadio('root_isSpouseVeteran', data.spouseInformation.isVeteran);
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

export const fillSpouseAddressInformation = (client, data) => {
  client.selectRadio(
    'root_spouseDoesLiveWithVeteran',
    data.currentMarriageInformation.doesLiveWithVeteran,
  );
  client.selectRadio(
    'root_spouseDoesLiveWithVeteran',
    data.currentMarriageInformation.doesLiveWithVeteran,
  );
};

export const fillSpouseMarriageHistory = (client, data) => {
  client.selectRadio(
    'root_spouseWasMarriedBefore',
    data.currentMarriageInformation.spouseWasMarriedBefore,
  );
};

export const fillVeteranMarriageHistory = (client, data) => {
  client.selectRadio(
    'root_veteranWasMarriedBefore',
    data.currentMarriageInformation.veteranWasMarriedBefore,
  );
};
