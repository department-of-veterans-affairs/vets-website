import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { removeMarriedChildOptions } from '../../../../config/chapters/report-marriage-of-child/removeMarriedChildArrayPages';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    reportMarriageOfChildUnder18: true,
  },
  childMarriage: [{}],
};

const arrayPath = 'childMarriage';

// Array options
describe('removeMarriedChildOptions', () => {
  describe('isItemIncomplete', () => {
    it('should return true for an item missing required fields', () => {
      const incompleteItem = {
        fullName: { first: '', last: 'Doe' },
        birthDate: '2000-01-01',
        ssn: '123-45-6789',
        dateMarried: '2020-01-01',
      };

      expect(removeMarriedChildOptions.isItemIncomplete(incompleteItem)).to.be
        .true;
    });

    it('should return false for a complete item', () => {
      const completeItem = {
        fullName: { first: 'John', last: 'Doe' },
        birthDate: '2000-01-01',
        ssn: '123-45-6789',
        dateMarried: '2020-01-01',
      };

      expect(removeMarriedChildOptions.isItemIncomplete(completeItem)).to.be
        .false;
    });
  });

  describe('getItemName + cardDescription', () => {
    it('should return a correctly formatted name for a child', () => {
      const item = {
        fullName: { first: 'Jane', last: 'Doe' },
      };

      const expectedName = 'Jane Doe';
      expect(removeMarriedChildOptions.text.getItemName()).to.equal('Child');
      expect(removeMarriedChildOptions.text.cardDescription(item)).to.equal(
        expectedName,
      );
    });

    it('should handle cases with missing first name', () => {
      const item = {
        fullName: { first: '', last: 'Smith' },
      };

      const expectedName = ' Smith';
      expect(removeMarriedChildOptions.text.getItemName()).to.equal('Child');
      expect(removeMarriedChildOptions.text.cardDescription(item)).to.equal(
        expectedName,
      );
    });

    it('should handle cases with missing last name', () => {
      const item = {
        fullName: { first: 'John', last: '' },
      };

      const expectedName = 'John ';
      expect(removeMarriedChildOptions.text.getItemName()).to.equal('Child');
      expect(removeMarriedChildOptions.text.cardDescription(item)).to.equal(
        expectedName,
      );
    });
  });
});

// Array pages
describe('686 report child who was married: Intro page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildMarriage.pages.removeMarriedChildIntro;

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

describe('686 report child who was married: Summary page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildMarriage.pages.removeMarriedChildSummary;

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

describe('686 report child who was married: Child information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildMarriage.pages.removeMarriedChildPartOne;

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

describe('686 report child who was married: Date child was married', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildMarriage.pages.removeMarriedChildPartTwo;

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

describe('686 report child who was married: Child income', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildMarriage.pages.removeMarriedChildPartThree;

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
