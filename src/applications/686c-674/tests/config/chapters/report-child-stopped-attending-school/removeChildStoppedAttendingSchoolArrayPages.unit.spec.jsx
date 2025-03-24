import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { removeChildStoppedAttendingSchoolOptions } from '../../../../config/chapters/report-child-stopped-attending-school/removeChildStoppedAttendingSchoolArrayPages';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    reportChild18OrOlderIsNotAttendingSchool: true,
  },
  childStoppedAttendingSchool: [{}],
};

const arrayPath = 'childStoppedAttendingSchool';

// Array options
describe('removeChildStoppedAttendingSchoolOptions', () => {
  it('should have the correct properties', () => {
    expect(removeChildStoppedAttendingSchoolOptions).to.have.property(
      'arrayPath',
      'childStoppedAttendingSchool',
    );
    expect(removeChildStoppedAttendingSchoolOptions).to.have.property(
      'nounSingular',
      'child',
    );
    expect(removeChildStoppedAttendingSchoolOptions).to.have.property(
      'nounPlural',
      'children',
    );
    expect(removeChildStoppedAttendingSchoolOptions).to.have.property(
      'required',
      true,
    );
    expect(removeChildStoppedAttendingSchoolOptions).to.have.property(
      'maxItems',
      20,
    );
  });

  it('should define a text property with correct structure', () => {
    expect(removeChildStoppedAttendingSchoolOptions)
      .to.have.property('text')
      .that.is.an('object');
    expect(removeChildStoppedAttendingSchoolOptions.text).to.have.property(
      'summaryTitle',
      'Review your children between ages 18 and 23 who left school',
    );
    expect(removeChildStoppedAttendingSchoolOptions.text)
      .to.have.property('getItemName')
      .that.is.a('function');
  });

  describe('isItemIncomplete', () => {
    const { isItemIncomplete } = removeChildStoppedAttendingSchoolOptions;

    it('should return true if any required field is missing', () => {
      expect(isItemIncomplete({})).to.be.true;

      expect(
        isItemIncomplete({
          fullName: {},
          birthDate: null,
          ssn: null,
          dateChildLeftSchool: null,
        }),
      ).to.be.true;

      expect(
        isItemIncomplete({
          fullName: { first: 'John' },
          birthDate: '2000-01-01',
          ssn: null,
          dateChildLeftSchool: '2020-05-01',
        }),
      ).to.be.true;

      expect(
        isItemIncomplete({
          fullName: { first: null, last: 'Doe' },
          birthDate: '2000-01-01',
          ssn: '123-45-6789',
          dateChildLeftSchool: '2020-05-01',
        }),
      ).to.be.true;

      expect(
        isItemIncomplete({
          fullName: { first: 'John', last: null },
          birthDate: '2000-01-01',
          ssn: '123-45-6789',
          dateChildLeftSchool: '2020-05-01',
        }),
      ).to.be.true;
    });

    it('should return false if all required fields are present', () => {
      const item = {
        fullName: { first: 'John', last: 'Doe' },
        birthDate: '2000-01-01',
        ssn: '123-45-6789',
        dateChildLeftSchool: '2020-05-01',
      };

      expect(isItemIncomplete(item)).to.be.false;
    });
  });

  describe('getItemName', () => {
    const { getItemName } = removeChildStoppedAttendingSchoolOptions.text;

    it('should return the correctly capitalized full name', () => {
      const item = {
        fullName: { first: 'john', last: 'doe' },
      };
      expect(getItemName(item)).to.equal('John Doe');
    });

    it('should return the correctly capitalized full name with mixed case', () => {
      const item = {
        fullName: { first: 'jOhN', last: 'dOe' },
      };
      expect(getItemName(item)).to.equal('John Doe');
    });

    it('should handle the case when both names are empty', () => {
      const item = {
        fullName: { first: '', last: '' },
      };
      expect(getItemName(item)).to.equal(' ');
    });
  });
});

// Array pages
describe('686 report child who stopped attending school: Intro page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildStoppedAttendingSchool.pages.childNoLongerInSchoolIntro;

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
    expect($$('span', container).length).to.equal(1);
  });
});

describe('686 report child who stopped attending school: Summary page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildStoppedAttendingSchool.pages.childNoLongerInSchoolSummary;

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

describe('686 report child who stopped attending school: Child information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildStoppedAttendingSchool.pages.childNoLongerInSchoolPartOne;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(4);
    expect($$('va-memorable-date', container).length).to.equal(1);
  });
});

describe('686 report child who stopped attending school: Date child stopped attending', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildStoppedAttendingSchool.pages.childNoLongerInSchoolPartTwo;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(1);
  });
});

describe('686 report child who stopped attending school: Date child stopped attending', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildStoppedAttendingSchool.pages.childNoLongerInSchoolPartThree;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});
