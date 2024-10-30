import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { deceasedDependentOptions } from '../../../../config/chapters/report-dependent-death/deceasedDependentArrayPages';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

// deaths array options

describe('deceasedDependentOptions', () => {
  it('should have the correct base properties', () => {
    expect(deceasedDependentOptions.arrayPath).to.equal('deaths');
    expect(deceasedDependentOptions.nounSingular).to.equal('dependent');
    expect(deceasedDependentOptions.nounPlural).to.equal('dependents');
    expect(deceasedDependentOptions.required).to.be.true;
    expect(deceasedDependentOptions.maxItems).to.equal(7);
  });

  describe('isItemIncomplete', () => {
    it('should return true if any required fields are missing', () => {
      const incompleteItem = {
        fullName: { first: 'John' },
        ssn: '333445555',
        birthDate: '1991-02-19',
        dependentType: 'spouse',
        dependentDeathLocation: {
          location: { city: 'Some City' },
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
        dependentType: 'spouse',
        dependentDeathLocation: {
          location: { city: 'Some City' },
        },
        dependentDeathDate: '1991-01-19',
      };
      expect(deceasedDependentOptions.isItemIncomplete(completeItem)).to.be
        .false;
    });

    it('should return true if state is missing and outsideUsa is false', () => {
      const incompleteItem = {
        fullName: { first: 'John', last: 'Doe' },
        ssn: '333445555',
        birthDate: '1991-02-19',
        dependentType: 'spouse',
        dependentDeathLocation: {
          location: { city: 'Some City' },
          outsideUsa: false,
        },
        dependentDeathDate: '1991-01-19',
      };
      expect(deceasedDependentOptions.isItemIncomplete(incompleteItem)).to.be
        .true;
    });

    it('should return false if state is missing but outsideUsa is true', () => {
      const completeItemWithoutState = {
        fullName: { first: 'John', last: 'Doe' },
        ssn: '333445555',
        birthDate: '1991-02-19',
        dependentType: 'spouse',
        dependentDeathLocation: {
          location: { city: 'Some City' },
          outsideUsa: true,
        },
        dependentDeathDate: '1991-01-19',
      };
      expect(
        deceasedDependentOptions.isItemIncomplete(completeItemWithoutState),
      ).to.be.false;
    });
  });

  describe('text.getItemName', () => {
    it('should return the full name of the item', () => {
      const item = {
        fullName: { first: 'John', last: 'Doe' },
      };
      expect(deceasedDependentOptions.text.getItemName(item)).to.equal(
        'John Doe',
      );
    });

    it('should return an empty string if first or last name is missing', () => {
      const incompleteItem = { fullName: { first: 'John' } };
      expect(
        deceasedDependentOptions.text.getItemName(incompleteItem),
      ).to.equal('John ');

      const missingBoth = { fullName: {} };
      expect(deceasedDependentOptions.text.getItemName(missingBoth)).to.equal(
        ' ',
      );
    });
  });

  describe('text.cardDescription', () => {
    it('should return formatted birth and death dates', () => {
      const item = {
        birthDate: '1991-02-19',
        dependentDeathDate: '1991-01-19',
      };
      expect(deceasedDependentOptions.text.cardDescription(item)).to.equal(
        '02/19/1991 - 01/19/1991',
      );
    });

    it('should return "Unknown" if birth or death date is missing', () => {
      const missingBirthDate = { dependentDeathDate: '1991-01-19' };
      expect(
        deceasedDependentOptions.text.cardDescription(missingBirthDate),
      ).to.equal('Unknown - 01/19/1991');

      const missingDeathDate = { birthDate: '1991-02-19' };
      expect(
        deceasedDependentOptions.text.cardDescription(missingDeathDate),
      ).to.equal('02/19/1991 - Unknown');

      const missingBoth = {};
      expect(
        deceasedDependentOptions.text.cardDescription(missingBoth),
      ).to.equal('Unknown - Unknown');
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
        dependentType: 'spouse',
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
        dependentType: 'spouse',
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
        dependentType: 'child',
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

  it('should clear childStatus checkboxes if dependentType is not "child"', () => {
    const customFormData = {
      deaths: [
        {
          dependentType: 'child',
          childStatus: {
            biological: true,
            adopted: true,
            stepchild: false,
            other: true,
          },
        },
      ],
    };

    const { container, rerender } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={customFormData}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    // Confirm initial state with selected checkboxes
    expect(container.querySelectorAll('va-checkbox[checked]').length).to.equal(
      3,
    );

    // Update dependentType to 'spouse' and rerender
    customFormData.deaths[0].dependentType = 'spouse';
    rerender(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{ ...customFormData }}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    // After re-render, expect childStatus checkboxes to be cleared
    expect(container.querySelectorAll('va-checkbox[checked]').length).to.equal(
      0,
    );

    // Verify childStatus fields are cleared in formData as well
    const updatedChildStatus = customFormData.deaths[0].childStatus;
    expect(
      Object.values(updatedChildStatus).every(value => value === undefined),
    ).to.be.true;
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
