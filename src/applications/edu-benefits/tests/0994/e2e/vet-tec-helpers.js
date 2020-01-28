import get from 'lodash/get';

const E2eHelpers = require('../../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../../platform/testing/e2e/timeouts');

export const clickAddAnother = (client, i, list) => {
  if (i < list.length - 1) client.click('.va-growable-add-btn');
};

export const completeFormPage = (url, client, data, func) => {
  E2eHelpers.expectLocation(client, url);
  client.axeCheck('.main');
  if (typeof func === 'function') {
    func(client, data);
  }

  client.click('body').click('.form-progress-buttons .usa-button-primary');
};

export const completeApplicantInformation = (client, data) => {
  const {
    applicantFullName,
    applicantSocialSecurityNumber,
    dateOfBirth,
  } = data;

  client
    .fill('input[name="root_applicantFullName_first"]', applicantFullName.first)
    .fill('input[name="root_applicantFullName_last"]', applicantFullName.last)
    .fill(
      'input[name="root_applicantSocialSecurityNumber"]',
      applicantSocialSecurityNumber,
    )
    .fillDate(`root_dateOfBirth`, dateOfBirth);
};

export const completeAlreadySubmitted = (client, data) => {
  client.pause(1000);
  client.selectRadio(
    `root_appliedForVaEducationBenefits`,
    get(data, 'appliedForVaEducationBenefits', false) ? 'Y' : 'N',
  );
  client.pause(1000);
};

export const completeMilitaryService = (client, data) => {
  client
    .selectRadio(`root_activeDuty`, data.activeDuty ? 'Y' : 'N')
    .selectRadio(
      `root_activeDutyDuringVetTec`,
      get(data, 'activeDutyDuringVetTec', false) ? 'Y' : 'N',
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
  const currentHighTechnologyEmployment = get(
    data,
    'currentHighTechnologyEmployment',
    false,
  );
  const pastHighTechnologyEmployment = get(
    data,
    'pastHighTechnologyEmployment',
    false,
  );

  client.selectRadio(
    `root_currentHighTechnologyEmployment`,
    currentHighTechnologyEmployment ? 'Y' : 'N',
  );
  if (!currentHighTechnologyEmployment) {
    client.pause(1000);
    client.selectRadio(
      `root_pastHighTechnologyEmployment`,
      pastHighTechnologyEmployment ? 'Y' : 'N',
    );
  }

  const salaryEmploymentTypes = get(
    data,
    'view:salaryEmploymentTypes',
    undefined,
  );

  if (
    (currentHighTechnologyEmployment ||
      (!currentHighTechnologyEmployment && pastHighTechnologyEmployment)) &&
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

    Object.keys(highTechnologyEmploymentType)
      .filter(key => key !== 'noneApply')
      .forEach(key => {
        client.fillCheckbox(
          `input[name="root_view:salaryEmploymentTypes_highTechnologyEmploymentType_${key}"]`,
          highTechnologyEmploymentType[key],
        );
      });
  }
};

export const getHasSelectedPrograms = data =>
  get(data, 'hasSelectedPrograms', false);

export const completeHasSelectedPrograms = (client, data) => {
  client.selectRadio(
    'root_hasSelectedPrograms',
    getHasSelectedPrograms(data) ? 'Y' : 'N',
  );
};

export const completeTrainingProgramsInformation = (client, data) => {
  data.vetTecPrograms.forEach((program, i, list) => {
    const { providerName, programName, courseType } = program;
    client
      .fill(`input[name="root_vetTecPrograms_${i}_providerName"]`, providerName)
      .fill(`input[name="root_vetTecPrograms_${i}_programName"]`, programName)
      .selectRadio(`root_vetTecPrograms_${i}_courseType`, courseType);

    if (courseType === 'inPerson' || courseType === 'both') {
      const { locationCity, locationState } = program;
      client
        .fill(
          `input[name="root_vetTecPrograms_${i}_locationCity"`,
          locationCity,
        )
        .selectDropdown(
          `root_vetTecPrograms_${i}_locationState`,
          locationState,
        );
    }

    client.fillDate(
      `root_vetTecPrograms_${i}_plannedStartDate`,
      program.plannedStartDate,
    );

    clickAddAnother(client, i, list);
  });
};

export const completeContactInformation = (client, data) => {
  const { dayTimePhone, nightTimePhone, emailAddress } = get(
    data,
    'view:phoneAndEmail',
    {},
  );

  client
    .fill('input[name="root_view:phoneAndEmail_dayTimePhone"]', dayTimePhone)
    .fill(
      'input[name="root_view:phoneAndEmail_nightTimePhone"]',
      nightTimePhone,
    )
    .fill('input[name="root_view:phoneAndEmail_emailAddress"]', emailAddress)
    .click('body')
    .click('.usa-button-primary.update-button') // click Done for edit box for above fields
    .fillAddress('root_mailingAddress', get(data, 'mailingAddress', {}))
    .click('body')
    .click('.usa-button-primary.update-button'); // click Done for edit box for above fields
};

export const completeBankInformation = (client, data) => {
  const viewBankAccount = get(data, 'view:bankAccount', undefined);
  if (viewBankAccount) {
    const bankAccount = get(viewBankAccount, 'bankAccount', undefined);

    if (bankAccount) {
      const { accountType, routingNumber, accountNumber } = bankAccount;

      client
        .selectRadio(
          'root_view:bankAccount_bankAccount_accountType',
          accountType,
        )
        .fill(
          'input[name="root_view:bankAccount_bankAccount_accountNumber"]',
          accountNumber,
        )
        .fill(
          'input[name="root_view:bankAccount_bankAccount_routingNumber"]',
          routingNumber,
        )
        .click('body')
        .click('.usa-button-primary.update-button'); // click Save for edit box for above fields
    }
  }
};

export const completeReviewAndSubmit = (client, data) => {
  E2eHelpers.expectLocation(client, '/review-and-submit');
  client
    .axeCheck('.main')
    .fillCheckbox(
      'input[name="privacyAgreementAccepted"]',
      get(data, 'privacyAgreementAccepted', false),
    )
    .click('body')
    .click('.form-progress-buttons .usa-button-primary');
};

export const returnToBeginning = (client, url) => {
  client
    .openUrl(`${E2eHelpers.baseUrl}${url}`)
    .acceptAlert()
    .waitForElementVisible('body', Timeouts.normal)
    .click('.schemaform-start-button');
};
