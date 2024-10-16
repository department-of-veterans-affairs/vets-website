import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';
// import { addStudentsOptions } from '../../../../config/chapters/674/addStudentsArrayPages';

const defaultStore = createCommonStore();

const arrayPath = 'studentInformation';

const formData = () => {
  return {
    'view:selectable686Options': {
      report674: true,
    },
    studentInformation: [
      {
        //   remarks: 'No remarks',
        //   studentNetworthInformation: {
        //     savings: '2',
        //     securities: '3',
        //     realEstate: '4',
        //     otherAssets: '5',
        //     totalValue: '6',
        //   },
        //   studentExpectedEarningsNextYear: {
        //     earningsFromAllEmployment: '1',
        //     annualSocialSecurityPayments: '1',
        //     otherAnnuitiesIncome: '1',
        //     allOtherIncome: '1',
        //   },
        //   studentEarningsFromSchoolYear: {
        //     earningsFromAllEmployment: '2000',
        //     annualSocialSecurityPayments: '$4000',
        //     otherAnnuitiesIncome: '2000.86',
        //     allOtherIncome: '100',
        //   },
        //   claimsOrReceivesPension: true,
        //   schoolInformation: {
        //     lastTermSchoolInformation: {
        //       termBegin: '2000-01-12',
        //       dateTermEnded: '2000-02-23',
        //     },
        //     studentDidAttendSchoolLastTerm: true,
        //     currentTermDates: {
        //       officialSchoolStartDate: '1991-01-19',
        //       expectedStudentStartDate: '2000-03-19',
        //       expectedGraduationDate: '1991-09-19',
        //     },
        //     isSchoolAccredited: true,
        //     'view:accredited': {},
        //     dateFullTimeEnded: '2000-01-12',
        //     studentIsEnrolledFullTime: false,
        //     name: 'Test',
        //   },
        //   benefitPaymentDate: '2021-01-19',
        //   typeOfProgramOrBenefit: {
        //     ch35: true,
        //     fry: true,
        //     feca: true,
        //     other: true,
        //   },
        //   tuitionIsPaidByGovAgency: true,
        //   'view:programExamples': {},
        //   wasMarried: false,
        //   address: {
        //     'view:militaryBaseDescription': {},
        //     country: 'USA',
        //     street: '123 Fake St.',
        //     city: 'Fakesville',
        //     state: 'AL',
        //     postalCode: '12345',
        //   },
        //   studentIncome: false,
        //   ssn: '333445555',
        //   isParent: true,
        //   fullName: {
        //     first: 'John',
        //     last: 'Doe',
        //   },
        //   birthDate: '1991-03-19',
      },
    ],
  };
};

describe('674 Add students: Intro page ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsIntro;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('h3', container).length).to.equal(1);
    expect($$('p', container).length).to.equal(3);
  });
});

describe('674 Add students: Summary page ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsSummary;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('674 Add students: Student info page ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartOne;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerIemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
  });
});
