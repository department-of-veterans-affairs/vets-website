import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
// import { capitalize } from 'lodash';
import formConfig from '../../../../config/form';
import { addStudentsOptions } from '../../../../config/chapters/674/addStudentsArrayPages';

const defaultStore = createCommonStore();

const arrayPath = 'studentInformation';

const formData = () => {
  return {
    'view:selectable686Options': {
      report674: true,
    },
    studentInformation: [{}],
  };
};

// Array options

describe('addStudentsOptions', () => {
  describe('isItemIncomplete', () => {
    const incompleteItem = {
      fullName: { first: '', last: '' },
      birthDate: '',
      ssn: '',
      isParent: true,
      address: { country: '', street: '', city: '', state: '', postalCode: '' },
      wasMarried: undefined,
      tuitionIsPaidByGovAgency: undefined,
      schoolInformation: {
        name: '',
        studentIsEnrolledFullTime: true,
        isSchoolAccredited: false,
        currentTermDates: {
          officialSchoolStartDate: '',
          expectedStudentStartDate: '',
          expectedGraduationDate: '',
        },
        studentDidAttendSchoolLastTerm: true,
        lastTermSchoolInformation: { termBegin: '', dateTermEnded: '' },
      },
      claimsOrReceivesPension: true,
      typeOfProgramOrBenefit: { someBenefit: true },
      benefitPaymentDate: '',
    };

    it('should return true when required fields are missing', () => {
      const item = { ...incompleteItem, fullName: { first: '', last: 'Doe' } };
      expect(addStudentsOptions.isItemIncomplete(item)).to.be.true;
    });

    it('should return false when all required fields are present', () => {
      const item = {
        ...incompleteItem,
        fullName: { first: 'John', last: 'Doe' },
        birthDate: '2000-01-01',
        ssn: '123-45-6789',
        address: {
          country: 'USA',
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
        wasMarried: false,
        tuitionIsPaidByGovAgency: false,
        schoolInformation: {
          name: 'Springfield High',
          studentIsEnrolledFullTime: true,
          isSchoolAccredited: true,
          currentTermDates: {
            officialSchoolStartDate: '2024-01-01',
            expectedStudentStartDate: '2024-08-01',
            expectedGraduationDate: '2024-05-01',
          },
          studentDidAttendSchoolLastTerm: true,
          lastTermSchoolInformation: {
            termBegin: '2023-09-01',
            dateTermEnded: '2024-06-01',
          },
        },
        benefitPaymentDate: '2024-01-01',
      };
      expect(addStudentsOptions.isItemIncomplete(item)).to.be.false;
    });

    it('should return true when wasMarried is true but not set correctly', () => {
      const item = { ...incompleteItem, wasMarried: true };
      expect(addStudentsOptions.isItemIncomplete(item)).to.be.true;
    });

    it('should return true when tuitionIsPaidByGovAgency is true but not set correctly', () => {
      const item = { ...incompleteItem, tuitionIsPaidByGovAgency: true };
      expect(addStudentsOptions.isItemIncomplete(item)).to.be.true;
    });

    it('should return true when maximum items exceeded', () => {
      const items = Array.from({ length: 8 }, (_, i) => ({
        fullName: { first: `Student${i}`, last: 'Test' },
        birthDate: '2000-01-01',
        ssn: '123-45-6789',
        address: {
          country: 'USA',
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
        },
        wasMarried: false,
        tuitionIsPaidByGovAgency: false,
        schoolInformation: {
          name: 'Springfield High',
          studentIsEnrolledFullTime: true,
          isSchoolAccredited: true,
          currentTermDates: {
            officialSchoolStartDate: '2024-01-01',
            expectedStudentStartDate: '2024-08-01',
            expectedGraduationDate: '2024-05-01',
          },
          studentDidAttendSchoolLastTerm: true,
          lastTermSchoolInformation: {
            termBegin: '2023-09-01',
            dateTermEnded: '2024-06-01',
          },
        },
        benefitPaymentDate: '2024-01-01',
      }));

      expect(addStudentsOptions.isItemIncomplete({ studentInformation: items }))
        .to.be.true;
    });

    it('should return the correct summary title', () => {
      expect(addStudentsOptions.text.summaryTitle).to.equal(
        'Review your students',
      );
    });

    it('should return correct item name', () => {
      const item = { fullName: { first: 'Jane', last: 'Doe' } };
      expect(addStudentsOptions.text.getItemName(item)).to.equal('Jane Doe');
    });
  });
  describe('getItemName', () => {
    it('should return a full name when both first and last names are provided', () => {
      const item = { fullName: { first: 'john', last: 'doe' } };
      const expectedName = 'John Doe';
      expect(addStudentsOptions.text.getItemName(item)).to.equal(expectedName);
    });

    it('should return only the first name when the last name is missing', () => {
      const item = { fullName: { first: 'john' } };
      const expectedName = 'John ';
      expect(addStudentsOptions.text.getItemName(item)).to.equal(expectedName);
    });

    it('should return only the last name when the first name is missing', () => {
      const item = { fullName: { last: 'doe' } };
      const expectedName = ' Doe';
      expect(addStudentsOptions.text.getItemName(item)).to.equal(expectedName);
    });

    it('should return an empty string when both first and last names are missing', () => {
      const item = { fullName: {} };
      const expectedName = ' ';
      expect(addStudentsOptions.text.getItemName(item)).to.equal(expectedName);
    });

    it('should return an empty string when fullName is not provided', () => {
      const item = {};
      const expectedName = ' ';
      expect(addStudentsOptions.text.getItemName(item)).to.equal(expectedName);
    });
  });
});

// Array pages

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
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(3);
    expect($$('va-memorable-date', container).length).to.equal(1);
  });
});

describe('674 Add students: Student ID info page ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartTwo;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(1);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('674 Add students: Student income the past year ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartThree;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('674 Add students: Student address ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartFour;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-select', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(6);
  });
});

describe('674 Add students: Student was married ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartFive;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('674 Add students: Student education benefits ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartSix;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-checkbox', container).length).to.equal(4);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('674 Add students: Student education benefits payment start date ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartSeven;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(1);
  });
});

describe('674 Add students: Program name ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartEight;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(1);
  });
});

describe('674 Add students: Student attended continuously ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartNine;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('674 Add students: Date student stopped attending ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartTen;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(1);
  });
});

describe('674 Add students: School is accredited', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartEleven;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
    expect($$('va-additional-info', container).length).to.equal(1);
  });
});

describe('674 Add students: Term dates', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartTwelve;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(3);
  });
});

describe('674 Add students: Did student attend last term?', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartThirteen;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('674 Add students: Previous term dates', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartFourteen;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(2);
  });
});

describe('674 Add students: Veteran claims pension', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartFifteen;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('674 Add students: Current term student income', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartSixteen;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(4);
  });
});

describe('674 Add students: Student income next year', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartSeventeen;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(4);
  });
});

describe('674 Add students: Student assets', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartEighteen;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(5);
  });
});

describe('674 Add students: Student assets', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.addStudentsPartNineteen;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-textarea', container).length).to.equal(1);
  });
});
