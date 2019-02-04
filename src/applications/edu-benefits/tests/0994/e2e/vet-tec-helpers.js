import _ from 'lodash';

const E2eHelpers = require('../../../../../platform/testing/e2e/helpers');

export const clickAddAnother = (client, i, list) => {
  if (i < list.length - 1) client.click('.va-growable-add-btn');
};

export const completeFormPage = (url, client, data, func) => {
  E2eHelpers.expectLocation(client, url);
  client.axeCheck('.main');
  if (typeof func === 'function') {
    func(client, data);
  }

  client.click('.usa-button-primary');
};

export const completeAlreadySubmitted = (client, data) => {
  client.selectRadio(
    `root_appliedForVAEducationBenefits`,
    _.get(data, 'appliedForVAEducationBenefits', false) ? 'Y' : 'N',
  );
};

export const completeMilitaryService = (client, data) => {
  client
    .selectRadio(`root_activeDuty`, data.activeDuty ? 'Y' : 'N')
    .selectRadio(
      `root_activeDutyDuringVetTec`,
      _.get(data, 'activeDutyDuringVetTec', false) ? 'Y' : 'N',
    );
};

export const completeEducationHistory = (client, data) => {
  const { highestLevelofEducation, otherEducation } = data;
  client.selectDropdown(
    `root_highestLevelofEducation`,
    highestLevelofEducation,
  );

  if (highestLevelofEducation === 'other') {
    client.fill('input[name="root_otherEducation"]', otherEducation);
  }
};

export const completeHighTechWorkExp = (client, data) => {
  const currentEmployment = _.get(data, 'currentEmployment', false);
  const currentHighTechnologyEmployment = _.get(
    data,
    'currentHighTechnologyEmployment',
    false,
  );
  client.selectRadio(`root_currentEmployment`, currentEmployment ? 'Y' : 'N');
  if (!currentEmployment) {
    client.selectRadio(
      `root_currentHighTechnologyEmployment`,
      currentHighTechnologyEmployment ? 'Y' : 'N',
    );
  }

  const salaryEmploymentTypes = _.get(
    data,
    'view:salaryEmploymentTypes',
    undefined,
  );

  if (
    (currentEmployment ||
      (!currentEmployment && currentHighTechnologyEmployment)) &&
    salaryEmploymentTypes
  ) {
    const {
      currentSalary,
      highTechnologyEmploymentType,
    } = salaryEmploymentTypes;

    client.selectRadio(
      'root_view:salaryEmploymentTypes_currentSalary',
      currentSalary,
    );

    Object.keys(highTechnologyEmploymentType).forEach(key => {
      client.fillCheckbox(
        `input[name="root_view:salaryEmploymentTypes_highTechnologyEmploymentType_${key}"]`,
        highTechnologyEmploymentType[key],
      );
    });
  }
};

export const getTrainingProgramsChoice = data =>
  _.get(data, 'view:trainingProgramsChoice', false);

export const completeTrainingProgramChoice = (client, data) => {
  client.selectRadio(
    'root_view:trainingProgramsChoice',
    getTrainingProgramsChoice(data) ? 'Y' : 'N',
  );
};

export const completeTrainingProgramsInformation = (client, data) => {
  data.vetTecPrograms.forEach((program, i, list) => {
    const { providerName, programName, courseType } = program;
    client
      .fill(`input[name="root_vetTecPrograms_${i}_providerName"]`, providerName)
      .fill(`input[name="root_vetTecPrograms_${i}_programName"]`, programName)
      .selectRadio(`root_vetTecPrograms_${i}_courseType`, courseType);

    const location = _.get(program, 'location', undefined);
    if ((courseType === 'inPerson' || courseType === 'both') && location) {
      const { city, state } = location;
      client
        .fill(`input[name="root_vetTecPrograms_${i}_location_city"`, city)
        .selectDropdown(`root_vetTecPrograms_${i}_location_state`, state);
    }

    client.fillDate(
      `root_vetTecPrograms_${i}_plannedStartDate`,
      program.plannedStartDate,
    );

    clickAddAnother(client, i, list);
  });
};

export const completeContactInformation = (client, data) => {
  const phoneAndEmail = _.get(data, 'view:phoneAndEmail', undefined);

  if (phoneAndEmail) {
    const { dayTimePhone, nightTimePhone, emailAddress } = phoneAndEmail;
    client
      .fill('input[name="root_view:phoneAndEmail_dayTimePhone"]', dayTimePhone)
      .fill(
        'input[name="root_view:phoneAndEmail_nightTimePhone"]',
        nightTimePhone,
      )
      .fill('input[name="root_view:phoneAndEmail_emailAddress"]', emailAddress);
  }

  client.fillAddress('root_mailingAddress', data.mailingAddress);
};

export const completeBankInformation = (client, data) => {
  const bankAccount = _.get(data, 'bankAccount', undefined);

  const { accountType, routingNumber, accountNumber } = bankAccount;

  client
    .selectRadio('root_bankAccount_accountType', accountType)
    .fill('input[name="root_bankAccount_accountNumber"]', accountNumber)
    .fill('input[name="root_bankAccount_routingNumber"]', routingNumber);
};

export const completeReviewAndSubmit = (client, data) => {
  client.fillCheckbox(
    'privacyAgreementAccepted',
    _.get(data, 'privacyAgreementAccepted', false),
  );
};
