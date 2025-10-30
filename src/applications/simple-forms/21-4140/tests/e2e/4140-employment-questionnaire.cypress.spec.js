import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import user from './fixtures/mocks/user.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  fillDateWebComponentPattern,
  fillFullNameWebComponentPattern,
  fillTextWebComponent,
  getPagePaths,
  reviewAndSubmitPageFlow,
  selectCheckboxWebComponent,
  selectYesNoWebComponent,
} from '../../shared/tests/e2e/helpers';

const pagePaths = getPagePaths(formConfig);
const employerDetailsPath = pagePaths.employerDetails?.replace(':index', '0');
const dataDir = path.join(__dirname, 'fixtures', 'data');

const isEmploymentFlow = data =>
  data?.employmentCheck?.hasEmploymentInLast12Months === 'yes';

let hasAddedEmployer = false;

const pageHooks = {
  introduction: ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.findByText(/start the employment questionnaire/i, {
        selector: 'button',
      }).click({ force: true });
    });
  },
  'form-verification': ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.selectVaRadioOption('employment-status-verification', 'yes');
      cy.axeCheck();
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  },
  'required-information': ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.selectVaCheckbox('acknowledged-statement', true);
      cy.axeCheck();
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  },
  'before-you-begin': ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  },
  'what-you-need': ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  },
};

if (pagePaths.sectionOneIntro) {
  pageHooks[pagePaths.sectionOneIntro] = ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  };
}

if (pagePaths.personalInformation1) {
  pageHooks[pagePaths.personalInformation1] = ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(({ veteran }) => {
        fillFullNameWebComponentPattern('veteran_fullName', veteran.fullName);
        fillTextWebComponent('veteran_ssn', veteran.ssn);
        fillTextWebComponent('veteran_vaFileNumber', veteran.vaFileNumber);
        fillDateWebComponentPattern('veteran_dateOfBirth', veteran.dateOfBirth);
        fillTextWebComponent(
          'veteran_veteranServiceNumber',
          veteran.veteranServiceNumber,
        );
      });
      cy.axeCheck();
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  };
}

if (pagePaths.contactInformation1) {
  pageHooks[pagePaths.contactInformation1] = ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(({ veteran }) => {
        cy.fillAddressWebComponentPattern('veteran_address', veteran.address);
        fillTextWebComponent('veteran_email', veteran.email);
        if (veteran.agreeToElectronicCorrespondence) {
          selectCheckboxWebComponent(
            'veteran_agreeToElectronicCorrespondence',
            true,
          );
        }
        if (veteran.homePhone) {
          cy.fillVaTelephoneInput('root_veteran_homePhone', veteran.homePhone);
        }
        if (veteran.alternatePhone) {
          cy.fillVaTelephoneInput(
            'root_veteran_alternatePhone',
            veteran.alternatePhone,
          );
        }
      });
      cy.axeCheck();
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  };
}

if (pagePaths.employmentCheck) {
  pageHooks[pagePaths.employmentCheck] = ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(({ employmentCheck }) => {
        const selection = employmentCheck?.hasEmploymentInLast12Months;
        cy.selectVaRadioOption('employment-check', selection);
      });
      cy.axeCheck();
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  };
}

if (pagePaths.employersIntro) {
  pageHooks[pagePaths.employersIntro] = ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(data => {
        if (!isEmploymentFlow(data)) {
          return;
        }
        cy.axeCheck();
        cy.findByText(/continue/i, { selector: 'button' }).click();
      });
    });
  };
}

if (pagePaths.employersSummary) {
  pageHooks[pagePaths.employersSummary] = ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(data => {
        if (!isEmploymentFlow(data)) {
          return;
        }
        const shouldAddEmployer = !hasAddedEmployer;
        selectYesNoWebComponent('view:hasEmployers', shouldAddEmployer);
        cy.axeCheck();
        cy.findByText(/continue/i, { selector: 'button' }).click();
        if (shouldAddEmployer) {
          hasAddedEmployer = true;
        }
      });
    });
  };
}

if (employerDetailsPath) {
  pageHooks[employerDetailsPath] = ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(data => {
        if (!isEmploymentFlow(data)) {
          return;
        }
        const employer = data.employers?.[0];
        if (!employer) {
          return;
        }
        fillTextWebComponent('employers_0_employerName', employer.employerName);
        cy.fillAddressWebComponentPattern(
          'employers_0_employerAddress',
          employer.employerAddress,
        );
        fillDateWebComponentPattern(
          'employers_0_datesOfEmployment_from',
          employer.datesOfEmployment?.from,
        );
        fillDateWebComponentPattern(
          'employers_0_datesOfEmployment_to',
          employer.datesOfEmployment?.to,
        );
        fillTextWebComponent('employers_0_typeOfWork', employer.typeOfWork);
        fillTextWebComponent(
          'employers_0_highestIncome',
          employer.highestIncome,
        );
        fillTextWebComponent('employers_0_hoursPerWeek', employer.hoursPerWeek);
        fillTextWebComponent('employers_0_lostTime', employer.lostTime);
      });
      cy.axeCheck();
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  };
}

if (pagePaths.sectionTwoSignature) {
  pageHooks[pagePaths.sectionTwoSignature] = ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(data => {
        if (!isEmploymentFlow(data)) {
          return;
        }
        selectCheckboxWebComponent(
          'employedByVA_hasCertifiedSection2',
          true,
        );
        selectCheckboxWebComponent(
          'employedByVA_hasUnderstoodSection2',
          true,
        );
      });
      cy.axeCheck();
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  };
}

if (pagePaths.sectionThreeIntro) {
  pageHooks[pagePaths.sectionThreeIntro] = ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(data => {
        if (isEmploymentFlow(data)) {
          return;
        }
        cy.axeCheck();
        cy.findByText(/continue/i, { selector: 'button' }).click();
      });
    });
  };
}

if (pagePaths.sectionThreeSignature) {
  pageHooks[pagePaths.sectionThreeSignature] = ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(data => {
        if (isEmploymentFlow(data)) {
          return;
        }
        selectCheckboxWebComponent(
          'employedByVA_hasCertifiedSection3',
          true,
        );
        selectCheckboxWebComponent(
          'employedByVA_hasUnderstoodSection3',
          true,
        );
      });
      cy.axeCheck();
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  };
}

pageHooks['review-and-submit'] = ({ afterHook }) => {
  cy.injectAxeThenAxeCheck();
  afterHook(() => {
    cy.get('@testData').then(({ veteran }) => {
      reviewAndSubmitPageFlow(veteran.fullName);
      cy.wait('@submitForm');
    });
  });
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['with-employment', 'without-employment'],
    dataDir,
    pageHooks,
    setupPerTest: () => {
      hasAddedEmployer = false;
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit).as('submitForm');
      cy.login(user);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
