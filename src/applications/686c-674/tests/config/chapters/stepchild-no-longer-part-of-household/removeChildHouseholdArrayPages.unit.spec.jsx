import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';
import { removeChildHouseholdOptions } from '../../../../config/chapters/stepchild-no-longer-part-of-household/removeChildHouseholdArrayPages';

const defaultStore = createCommonStore();

const arrayPath = 'stepChildren';

const formData = {
  'view:selectable686Options': {
    reportStepchildNotInHousehold: true,
  },
  stepChildren: [{}],
};

// Array options
describe('686 Remove child no longer in household array options', () => {
  describe('isItemIncomplete', () => {
    const { isItemIncomplete } = removeChildHouseholdOptions;

    it('should return true if any required fields are missing', () => {
      const incompleteItem = {
        fullName: { first: 'John' },
        birthDate: '1990-01-01',
        ssn: '123-45-6789',
        supportingStepchild: true,
        livingExpensesPaid: '1000',
        whoDoesTheStepchildLiveWith: { first: 'Jane', last: 'Doe' },
        address: {
          country: 'USA',
          street: '123 Main St',
          city: 'Somewhere',
          state: 'CA',
          postalCode: '90210',
        },
      };

      expect(isItemIncomplete(incompleteItem)).to.be.true;
    });

    it('should return false if all required fields are present', () => {
      const completeItem = {
        fullName: { first: 'John', last: 'Doe' },
        birthDate: '1990-01-01',
        ssn: '123-45-6789',
        supportingStepchild: false,
        whoDoesTheStepchildLiveWith: { first: 'Jane', last: 'Doe' },
        address: {
          country: 'USA',
          street: '123 Main St',
          city: 'Somewhere',
          state: 'CA',
          postalCode: '90210',
        },
      };

      expect(isItemIncomplete(completeItem)).to.be.false;
    });

    it('should return true if supportingStepchild is true but livingExpensesPaid is missing', () => {
      const itemWithoutExpenses = {
        fullName: { first: 'John', last: 'Doe' },
        birthDate: '1990-01-01',
        ssn: '123-45-6789',
        supportingStepchild: true,
        whoDoesTheStepchildLiveWith: { first: 'Jane', last: 'Doe' },
        address: {
          country: 'USA',
          street: '123 Main St',
          city: 'Somewhere',
          state: 'CA',
          postalCode: '90210',
        },
      };

      expect(isItemIncomplete(itemWithoutExpenses)).to.be.true;
    });
  });

  describe('text.getItemName + cardDescription', () => {
    const {
      text: { getItemName, cardDescription },
    } = removeChildHouseholdOptions;

    it('should return a full name with capitalized first and last name', () => {
      const item = { fullName: { first: 'john', last: 'doe' } };
      expect(getItemName()).to.equal('Stepchild');
      expect(cardDescription(item)).to.equal('John Doe');
    });

    it('should return only the first name if the last name is missing', () => {
      const item = { fullName: { first: 'john' } };
      expect(getItemName()).to.equal('Stepchild');
      expect(cardDescription(item)).to.equal('John ');
    });

    it('should return only the last name if the first name is missing', () => {
      const item = { fullName: { last: 'doe' } };
      expect(getItemName()).to.equal('Stepchild');
      expect(cardDescription(item)).to.equal(' Doe');
    });

    it('should return an empty string if both first and last names are missing', () => {
      const item = { fullName: {} };
      expect(getItemName()).to.equal('Stepchild');
      expect(cardDescription(item)).to.equal(' ');
    });
  });

  describe('maxItems', () => {
    const { maxItems } = removeChildHouseholdOptions;

    it('should have a maxItems value of 7', () => {
      expect(maxItems).to.equal(20);
    });
  });
});

// Array pages
describe('686 Remove child no longer in household: Intro page ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportStepchildNotInHousehold.pages.removeChildHouseholdIntro;

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

describe('686 Remove child no longer in household: Summary page ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportStepchildNotInHousehold.pages.removeChildHouseholdSummary;

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

describe('686 Remove child no longer in household: Child information ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportStepchildNotInHousehold.pages.removeChildHouseholdPartOne;

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

describe('686 Remove child no longer in household: Veteran’s support of child', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportStepchildNotInHousehold.pages.removeChildHouseholdPartTwo;

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

describe('686 Remove child no longer in household: Veteran’s support amount ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportStepchildNotInHousehold.pages.removeChildHouseholdPartThree;

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
    expect($$('va-radio-option', container).length).to.equal(3);
  });

  it('should render undefined', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            ...formData,
            stepChildren: [
              {
                supportingStepchild: false,
                livingExpensesPaid: 'Less than half',
              },
            ],
          }}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(3);
    expect(formData.livingExpensesPaid).to.be.undefined;
  });
});

describe('686 Remove child no longer in household: Stepchild’s address', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportStepchildNotInHousehold.pages.removeChildHouseholdPartFour;

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

    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(6);
    expect($$('va-select', container).length).to.equal(1);
  });
});

describe('686 Remove child no longer in household: Who does this stepchild live with?', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportStepchildNotInHousehold.pages.removeChildHouseholdPartFive;

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

    expect($$('va-text-input', container).length).to.equal(3);
  });
});
