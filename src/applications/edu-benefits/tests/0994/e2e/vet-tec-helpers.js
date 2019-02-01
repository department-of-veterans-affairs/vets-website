const E2eHelpers = require('../../../../../platform/testing/e2e/helpers');

export const completeAlreadySubmitted = (client, data) => {
  E2eHelpers.expectLocation(client, '/benefits-eligibility');
  client.axeCheck('.main');
  client.selectRadio(
    `root_appliedForVAEducationBenefits`,
    data.appliedForVAEducationBenefits ? 'Y' : 'N',
  );
  client.click('.usa-button-primary');
};

export const completeMilitaryService = (client, data) => {
  E2eHelpers.expectLocation(client, '/military-service');
  client.axeCheck('.main');
  client.selectRadio(`root_activeDuty`, data.activeDuty ? 'Y' : 'N');
  client.selectRadio(
    `root_activeDutyDuringVetTec`,
    data.activeDutyDuringVetTec ? 'Y' : 'N',
  );
  client.click('.form-progress-buttons .usa-button-primary');
};

export const completeEducationHistory = (client, data) => {
  E2eHelpers.expectLocation(client, '/education-history');
  client.axeCheck('.main');
  client.selectDropdown(
    `root_highestLevelofEducation`,
    data.highestLevelofEducation,
  );
  client.click('.form-progress-buttons .usa-button-primary');
};

export const completeHighTechWorkExp = (client, data) => {
  E2eHelpers.expectLocation(client, '/work-experience');
  client.axeCheck('.main');

  const { currentEmployment, currentHighTechnologyEmployment } = data;
  client.selectRadio(`root_currentEmployment`, currentEmployment ? 'Y' : 'N');
  if (!currentEmployment) {
    client.selectRadio(
      `root_currentHighTechnologyEmployment`,
      currentHighTechnologyEmployment ? 'Y' : 'N',
    );
  }

  if (
    currentEmployment ||
    (!currentEmployment && currentHighTechnologyEmployment)
  ) {
    const { currentSalary, highTechnologyEmploymentType } = data[
      'view:salaryEmploymentTypes'
    ];

    client.selectRadio(
      'root_view:salaryEmploymentTypes_currentSalary',
      currentSalary,
    );

    Object.keys(highTechnologyEmploymentType).forEach(key => {
      client.fillCheckbox(
        `root_view:salaryEmploymentTypes_highTechnologyEmploymentType_${key}`,
        highTechnologyEmploymentType[key],
      );
    });
  }

  client.click('.form-progress-buttons .usa-button-primary');
};
