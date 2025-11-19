import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/feature-toggles.json';
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
} from '../../../shared/tests/e2e/helpers';

const pagePaths = getPagePaths(formConfig);
const employerDetailsPath = pagePaths.employerDetails;
const dataDir = path.join(__dirname, 'fixtures', 'data');

const isEmploymentFlow = data =>
  data?.employmentCheck?.hasEmploymentInLast12Months === 'yes';

let employersAdded = 0;

const formatUsPhoneNumber = contact => {
  if (!contact) {
    return contact;
  }
  const digitsOnly = contact.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    const area = digitsOnly.slice(0, 3);
    const exchange = digitsOnly.slice(3, 6);
    const subscriber = digitsOnly.slice(6);
    return `(${area}) ${exchange}-${subscriber}`;
  }
  return contact;
};

const fillTelephoneField = (fieldName, phone) => {
  if (!phone?.contact) {
    return;
  }
  const alias = `${fieldName}Input`.replace(/[^A-Za-z0-9_-]/g, '');
  cy.get(`va-telephone-input[name="${fieldName}"]`)
    .shadow()
    .find('va-text-input')
    .shadow()
    .find('input')
    .as(alias);

  cy.get(`@${alias}`)
    .click({ force: true })
    .clear({ force: true })
    .type(phone.contact, { force: true })
    .should('have.value', formatUsPhoneNumber(phone.contact));
};

const fillEmployerDetails = employer => {
  if (!employer) {
    return;
  }

  fillTextWebComponent('employerName', employer.employerName);
  cy.fillAddressWebComponentPattern(
    'employerAddress',
    employer.employerAddress,
  );
  fillDateWebComponentPattern(
    'datesOfEmployment_from',
    employer.datesOfEmployment?.from,
  );
  fillDateWebComponentPattern(
    'datesOfEmployment_to',
    employer.datesOfEmployment?.to,
  );
  fillTextWebComponent('typeOfWork', employer.typeOfWork);
  fillTextWebComponent('highestIncome', employer.highestIncome);
  fillTextWebComponent('hoursPerWeek', employer.hoursPerWeek);
  fillTextWebComponent('lostTime', employer.lostTime);
};

const pageHooks = {
  introduction: ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.findByText(/start the employment questionnaire/i, {
        selector: 'a',
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
          fillTelephoneField('root_veteran_homePhone', veteran.homePhone);
        }
        if (veteran.alternatePhone) {
          fillTelephoneField(
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
        if (!selection) {
          return;
        }
        const radioLabels = {
          yes: /Yes, I was employed or self-employed during the past 12 months/i,
          no: /No, I was not employed during the past 12 months/i,
        };

        cy.findByRole('radio', { name: radioLabels[selection] })
          .scrollIntoView()
          .click({ force: true, waitForAnimations: false })
          .should('be.checked');
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
        const totalEmployers = data.employers?.length || 0;
        const shouldAddEmployer = employersAdded < totalEmployers;

        selectYesNoWebComponent('view:hasEmployers', shouldAddEmployer);
        cy.axeCheck();
        cy.findByText(/continue/i, { selector: 'button' }).click();
        if (shouldAddEmployer) {
          employersAdded += 1;
        }
      });
    });
  };
}

if (employerDetailsPath) {
  pageHooks[employerDetailsPath] = ({ afterHook, index }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(data => {
        if (!isEmploymentFlow(data)) {
          return;
        }
        if (!data.employers?.length) {
          return;
        }

        const candidateIndexes = new Set();

        if (typeof index === 'number' && !Number.isNaN(index)) {
          candidateIndexes.add(index);
          if (index > 0) {
            candidateIndexes.add(index - 1);
          }
        }

        if (employersAdded > 0) {
          candidateIndexes.add(employersAdded - 1);
        }

        candidateIndexes.add(0);

        const { employers } = data;
        const dataIndex = [...candidateIndexes].find(
          idx => employers[idx] != null,
        );

        const employer =
          dataIndex !== undefined ? employers[dataIndex] : undefined;

        expect(
          employer,
          `employer data for indexes [${[...candidateIndexes].join(', ')}]`,
        ).to.exist;

        fillEmployerDetails(employer);
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
        selectCheckboxWebComponent('employedByVA_hasCertifiedSection2', true);
        selectCheckboxWebComponent('employedByVA_hasUnderstoodSection2', true);
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
        selectCheckboxWebComponent('employedByVA_hasCertifiedSection3', true);
        selectCheckboxWebComponent('employedByVA_hasUnderstoodSection3', true);
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
      reviewAndSubmitPageFlow(
        veteran.fullName,
        'Submit employment questionnaire',
      );
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
      employersAdded = 0;
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit).as('submitForm');
      cy.login(user);
    },
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
