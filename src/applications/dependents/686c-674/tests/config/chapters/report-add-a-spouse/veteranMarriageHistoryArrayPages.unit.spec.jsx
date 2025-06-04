import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';
import { veteranMarriageHistoryOptions } from '../../../../config/chapters/report-add-a-spouse/veteranMarriageHistoryArrayPages';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    addSpouse: true,
  },
  veteranWasMarriedBefore: true,
  veteranMarriageHistory: [
    {
      fullName: {
        first: 'My',
        last: 'Ex',
      },
      startDate: '1991-02-19',
      endDate: '1992-03-20',
      startLocation: {},
      endLocation: {},
    },
    {
      fullName: {
        first: 'My',
        middle: 'Other',
        last: 'Ex',
      },
      reasonMarriageEnded: 'Other',
      otherReasonMarriageEnded: 'A reason',
      startDate: '2000-02-19',
      endDate: '2000-03-20',
      startLocation: {
        outsideUsa: true,
        location: {
          city: 'Fakesville',
        },
      },
      endLocation: {
        outsideUsa: true,
        location: {
          city: 'Fakesville',
        },
      },
    },
  ],
};

// Array options

describe('veteranMarriageHistoryOptions', () => {
  it('should have the correct base properties', () => {
    expect(veteranMarriageHistoryOptions.arrayPath).to.equal(
      'veteranMarriageHistory',
    );
    expect(veteranMarriageHistoryOptions.nounSingular).to.equal(
      'former marriage',
    );
    expect(veteranMarriageHistoryOptions.nounPlural).to.equal(
      'former marriages',
    );
    expect(veteranMarriageHistoryOptions.required).to.be.false;
    expect(veteranMarriageHistoryOptions.maxItems).to.equal(20);
  });

  describe('isItemIncomplete', () => {
    it('should return true if any required fields are missing', () => {
      const incompleteItem = {
        fullName: { first: 'John' }, // Missing last name
        startDate: '1991-02-19',
        endDate: '2000-02-19',
        reasonMarriageEnded: 'Divorce',
        startLocation: { location: { city: 'Some City' }, outsideUsa: false },
        endLocation: { location: { city: 'Another City' }, outsideUsa: false },
      };
      expect(veteranMarriageHistoryOptions.isItemIncomplete(incompleteItem)).to
        .be.true;
    });

    it('should return false if all required fields are present (inside USA, with state)', () => {
      const completeItem = {
        fullName: { first: 'John', last: 'Doe' },
        startDate: '1991-02-19',
        endDate: '2000-02-19',
        reasonMarriageEnded: 'Divorce',
        startLocation: {
          location: { city: 'Some City', state: 'NY' },
          outsideUsa: false,
        },
        endLocation: {
          location: { city: 'Another City', state: 'NY' },
          outsideUsa: false,
        },
      };
      expect(veteranMarriageHistoryOptions.isItemIncomplete(completeItem)).to.be
        .false;
    });

    it('should return false if all required fields are present (outside USA, with country)', () => {
      const completeItemOutsideUsa = {
        fullName: { first: 'Jane', last: 'Smith' },
        startDate: '1995-06-15',
        endDate: '2005-06-15',
        reasonMarriageEnded: 'Annulment',
        startLocation: {
          location: { city: 'Paris', country: 'France' },
          outsideUsa: true,
        },
        endLocation: {
          location: { city: 'Berlin', country: 'Germany' },
          outsideUsa: true,
        },
      };
      expect(
        veteranMarriageHistoryOptions.isItemIncomplete(completeItemOutsideUsa),
      ).to.be.false;
    });

    it('should return true if startLocation city is missing', () => {
      const itemMissingStartLocationCity = {
        fullName: { first: 'Jane', last: 'Smith' },
        startDate: '1995-06-15',
        endDate: '2005-06-15',
        reasonMarriageEnded: 'Annulment',
        startLocation: { location: {}, outsideUsa: true },
        endLocation: {
          location: { city: 'Berlin', country: 'Germany' },
          outsideUsa: true,
        },
      };
      expect(
        veteranMarriageHistoryOptions.isItemIncomplete(
          itemMissingStartLocationCity,
        ),
      ).to.be.true;
    });

    it('should return true if startLocation state is missing (inside USA)', () => {
      const itemMissingStartLocationState = {
        fullName: { first: 'Jane', last: 'Smith' },
        startDate: '1995-06-15',
        endDate: '2005-06-15',
        reasonMarriageEnded: 'Annulment',
        startLocation: { location: { city: 'Some City' }, outsideUsa: false },
        endLocation: {
          location: { city: 'Berlin', country: 'Germany' },
          outsideUsa: true,
        },
      };
      expect(
        veteranMarriageHistoryOptions.isItemIncomplete(
          itemMissingStartLocationState,
        ),
      ).to.be.true;
    });

    it('should return true if startLocation country is missing (outside USA)', () => {
      const itemMissingStartLocationCountry = {
        fullName: { first: 'Jane', last: 'Smith' },
        startDate: '1995-06-15',
        endDate: '2005-06-15',
        reasonMarriageEnded: 'Annulment',
        startLocation: { location: { city: 'Paris' }, outsideUsa: true },
        endLocation: {
          location: { city: 'Berlin', country: 'Germany' },
          outsideUsa: true,
        },
      };
      expect(
        veteranMarriageHistoryOptions.isItemIncomplete(
          itemMissingStartLocationCountry,
        ),
      ).to.be.true;
    });

    it('should return true if endLocation city is missing', () => {
      const itemMissingEndLocationCity = {
        fullName: { first: 'Jane', last: 'Smith' },
        startDate: '1995-06-15',
        endDate: '2005-06-15',
        reasonMarriageEnded: 'Annulment',
        startLocation: {
          location: { city: 'Paris', country: 'France' },
          outsideUsa: true,
        },
        endLocation: { location: {}, outsideUsa: true },
      };
      expect(
        veteranMarriageHistoryOptions.isItemIncomplete(
          itemMissingEndLocationCity,
        ),
      ).to.be.true;
    });

    it('should return true if endLocation state is missing (inside USA)', () => {
      const itemMissingEndLocationState = {
        fullName: { first: 'Jane', last: 'Smith' },
        startDate: '1995-06-15',
        endDate: '2005-06-15',
        reasonMarriageEnded: 'Annulment',
        startLocation: {
          location: { city: 'Paris', country: 'France' },
          outsideUsa: true,
        },
        endLocation: { location: { city: 'Berlin' }, outsideUsa: false },
      };
      expect(
        veteranMarriageHistoryOptions.isItemIncomplete(
          itemMissingEndLocationState,
        ),
      ).to.be.true;
    });

    it('should return true if endLocation country is missing (outside USA)', () => {
      const itemMissingEndLocationCountry = {
        fullName: { first: 'Jane', last: 'Smith' },
        startDate: '1995-06-15',
        endDate: '2005-06-15',
        reasonMarriageEnded: 'Annulment',
        startLocation: {
          location: { city: 'Paris', country: 'France' },
          outsideUsa: true,
        },
        endLocation: { location: { city: 'Berlin' }, outsideUsa: true },
      };
      expect(
        veteranMarriageHistoryOptions.isItemIncomplete(
          itemMissingEndLocationCountry,
        ),
      ).to.be.true;
    });
  });

  describe('veteranMarriageHistoryOptions.text.getItemName', () => {
    it('should return the full name of the item', () => {
      const item = {
        fullName: { first: 'John', last: 'Doe' },
      };
      const { container } = render(
        veteranMarriageHistoryOptions.text.getItemName(item),
      );
      expect(container.textContent).to.equal('John Doe');
    });

    it('should return a trimmed name even if one part is missing', () => {
      const itemMissingLast = { fullName: { first: 'John' } };
      const { container: container1 } = render(
        veteranMarriageHistoryOptions.text.getItemName(itemMissingLast),
      );
      expect(container1.textContent).to.equal('John');

      const itemMissingFirst = { fullName: { last: 'Doe' } };
      const { container: container2 } = render(
        veteranMarriageHistoryOptions.text.getItemName(itemMissingFirst),
      );
      expect(container2.textContent).to.equal('Doe');

      const itemMissingBoth = { fullName: {} };
      const { container: container3 } = render(
        veteranMarriageHistoryOptions.text.getItemName(itemMissingBoth),
      );
      expect(container3.textContent).to.equal('');
    });
  });
});

// Array pages

describe('686 current marriage information: Veteran marriage history question / Array summary ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.veteranMarriageHistorySummary;

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

describe('686 current marriage information: Former veteran name ', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.veteranMarriageHistoryPartOne;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(3);
  });
});

describe('686 current marriage information: Former veteran name ', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.veteranMarriageHistoryPartTwo;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(4);
  });

  it('should render additional field when Other is selected', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(4);
    expect($$('va-text-input', container).length).to.equal(1);
  });
});

describe('686 current marriage information: Marriage starting date', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.veteranMarriageHistoryPartThree;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(1);
  });
});

describe('686 current marriage information: Marriage ending date', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.veteranMarriageHistoryPartFour;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(1);
  });
});

describe('686 current marriage information: Marriage start location', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.veteranMarriageHistoryPartFive;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(1);
    expect($$('va-select', container).length).to.equal(1);
    expect($$('option', container).length).to.equal(59);
  });

  it('should render w/o select field if Outside US is checked', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(1);
  });
});

describe('686 current marriage information: Marriage end location', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.veteranMarriageHistoryPartSix;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(1);
    expect($$('va-select', container).length).to.equal(1);
    expect($$('option', container).length).to.equal(59);
  });

  it('should render w/o select field if Outside US is checked', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(1);
  });
});
