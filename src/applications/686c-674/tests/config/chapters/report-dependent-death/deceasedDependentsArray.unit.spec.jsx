import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { deceasedDependentOptions } from '../../../../config/chapters/report-dependent-death/deceasedDependentArrayPages';
import formConfig from '../../../../config/form';
import { relationshipLabels } from '../../../../config/chapters/report-dependent-death/helpers';

const defaultStore = createCommonStore();

// deaths array options

describe('deceasedDependentOptions', () => {
  it('should have the correct base properties', () => {
    expect(deceasedDependentOptions.arrayPath).to.equal('deaths');
    expect(deceasedDependentOptions.nounSingular).to.equal('dependent');
    expect(deceasedDependentOptions.nounPlural).to.equal('dependents');
    expect(deceasedDependentOptions.required).to.be.true;
    expect(deceasedDependentOptions.maxItems).to.equal(20);
  });

  describe('isItemIncomplete', () => {
    it('should return true if any required fields are missing', () => {
      const incompleteItem = {
        fullName: { first: 'John' },
        ssn: '333445555',
        birthDate: '1991-02-19',
        dependentType: 'SPOUSE',
        dependentDeathLocation: {
          location: { city: 'Some City' },
          outsideUsa: false,
        },
        dependentDeathDate: '1991-01-19',
      };
      expect(deceasedDependentOptions.isItemIncomplete(incompleteItem)).to.be
        .true;
    });

    it('should return false if all required fields are present', () => {
      const completeItem = {
        fullName: { first: 'John', last: 'Doe' },
        ssn: '333445555',
        birthDate: '1991-02-19',
        dependentType: 'SPOUSE',
        dependentDeathLocation: {
          location: { city: 'Some City', state: 'Some State' },
          outsideUsa: false,
        },
        dependentDeathDate: '1991-01-19',
      };
      expect(deceasedDependentOptions.isItemIncomplete(completeItem)).to.be
        .false;
    });

    it('should return true if "outsideUsa" is true but "country" is missing', () => {
      const incompleteItem = {
        fullName: { first: 'John', last: 'Doe' },
        ssn: '333445555',
        birthDate: '1991-02-19',
        dependentType: 'SPOUSE',
        dependentDeathLocation: {
          location: { city: 'Some City' },
          outsideUsa: true,
        },
        dependentDeathDate: '1991-01-19',
      };
      expect(deceasedDependentOptions.isItemIncomplete(incompleteItem)).to.be
        .true;
    });

    it('should return false if "outsideUsa" is true and "country" is present', () => {
      const completeItem = {
        fullName: { first: 'John', last: 'Doe' },
        ssn: '333445555',
        birthDate: '1991-02-19',
        dependentType: 'SPOUSE',
        dependentDeathLocation: {
          location: { city: 'Some City', country: 'Some Country' },
          outsideUsa: true,
        },
        dependentDeathDate: '1991-01-19',
      };
      expect(deceasedDependentOptions.isItemIncomplete(completeItem)).to.be
        .false;
    });
  });

  describe('text.getItemName + cardDescription', () => {
    it('should return the relationship label if dependentType is valid', () => {
      const item = {
        dependentType: 'SPOUSE',
        fullName: { first: 'John', last: 'Doe' },
      };
      expect(deceasedDependentOptions.text.getItemName(item)).to.equal(
        relationshipLabels.SPOUSE,
      );
      expect(deceasedDependentOptions.text.cardDescription(item)).to.equal(
        'John Doe',
      );
    });

    it('should return partial name', () => {
      const item = {
        dependentType: 'CHILD',
        fullName: { first: 'John' },
      };
      expect(deceasedDependentOptions.text.getItemName(item)).to.equal(
        relationshipLabels.CHILD,
      );
      expect(deceasedDependentOptions.text.cardDescription(item)).to.equal(
        'John',
      );
    });

    it('should return "Dependent" if dependentType is missing', () => {
      const item = {};
      expect(deceasedDependentOptions.text.getItemName(item)).to.equal(
        'Dependent',
      );
    });

    it('should return "Dependent" if dependentType is invalid', () => {
      const item = { dependentType: 'invalidType' };
      expect(deceasedDependentOptions.text.getItemName(item)).to.equal(
        'Dependent',
      );
    });
  });

  describe('text.cardDescription', () => {
    it('should return a formatted full name with capitalized first and last names', () => {
      const item = {
        fullName: { first: 'john', last: 'doe' },
      };
      expect(deceasedDependentOptions.text.cardDescription(item)).to.equal(
        'John Doe',
      );
    });

    it('should handle missing first or last name gracefully', () => {
      const missingLastName = { fullName: { first: 'John' } };
      expect(
        deceasedDependentOptions.text.cardDescription(missingLastName),
      ).to.equal('John');

      const missingFirstName = { fullName: { last: 'Doe' } };
      expect(
        deceasedDependentOptions.text.cardDescription(missingFirstName),
      ).to.equal('Doe');

      const missingBoth = { fullName: {} };
      expect(
        deceasedDependentOptions.text.cardDescription(missingBoth),
      ).to.equal('');
    });
  });
});

// deaths array pages

const formData = (state = 'CA') => {
  return {
    'view:selectable686Options': {
      reportDeath: true,
    },
    deaths: [
      {
        dependentDeathDate: '2023-04-17',
        dependentType: 'SPOUSE',
        fullName: {
          first: 'John',
          last: 'Doe',
        },
        ssn: '333445555',
        birthDate: '1991-02-19',
        dependentDeathLocation: {
          outsideUsa: false,
          location: {
            city: 'Some city',
            state,
          },
        },
      },
      {
        dependentDeathDate: '2000-12-14',
        dependentType: 'SPOUSE',
        ssn: '333445555',
        birthDate: '1991-02-19',
        dependentDeathLocation: {
          outsideUsa: false,
          location: {
            city: 'Some city',
            state,
          },
        },
      },
      {
        dependentDeathDate: '2012-10-31',
        dependentType: 'CHILD',
        ssn: '333445555',
        birthDate: '2010-02-19',
        fullName: {
          first: 'Tom',
          last: 'Riddle',
        },
        dependentDeathLocation: {
          outsideUsa: true,
          location: {
            city: 'Some city',
          },
        },
        childStatus: {
          childUnder18: true,
          adopted: true,
        },
      },
    ],
  };
};

const arrayPath = 'deaths';

describe('686 report death: Introduction page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformationIntro;

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

describe('686 report death: Summary page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformationSummary;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('686 report death: Dependent information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformationPartOne;

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
    expect($$('va-memorable-date', container).length).to.equal(1);
  });
});

describe('686 report death: Dependent Type', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformationPartTwo;

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
    expect($$('va-radio-option', container).length).to.equal(3);
  });
});

describe('686 report death: Child Type', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformationPartThree;

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

    expect(container.querySelectorAll('va-checkbox-group').length).to.equal(1);
    expect(container.querySelectorAll('va-checkbox').length).to.equal(5);
  });
});

describe('686 report death: Date of Death', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformationPartFour;

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

describe('686 report death: Location of Death', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformationPartFive;

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
    expect($$('va-text-input', container).length).to.equal(1);
    expect($$('va-select', container).length).to.equal(1);
  });

  it('should render w/ hidden State selector', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={2}
        />
      </Provider>,
    );

    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(1);
  });
});

describe('686 report death: Dependent income', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformationPartSix;

  it('should render', () => {
    const { container, queryByText } = render(
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

    expect(queryByText(/Dependent’s income/i)).to.not.be.null;
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});
