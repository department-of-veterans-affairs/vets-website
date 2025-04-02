import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';
import { spouseMarriageHistoryOptions } from '../../../../config/chapters/report-add-a-spouse/spouseMarriageHistoryArrayPages';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    addSpouse: true,
  },
  veteranWasMarriedBefore: true,
  spouseMarriageHistory: [
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

describe('spouseMarriageHistoryOptions', () => {
  it('should have the correct base properties', () => {
    expect(spouseMarriageHistoryOptions.arrayPath).to.equal(
      'spouseMarriageHistory',
    );
    expect(spouseMarriageHistoryOptions.nounSingular).to.equal(
      'former marriage',
    );
    expect(spouseMarriageHistoryOptions.nounPlural).to.equal(
      'former marriages',
    );
    expect(spouseMarriageHistoryOptions.required).to.be.false;
    expect(spouseMarriageHistoryOptions.maxItems).to.equal(20);
  });

  describe('isItemIncomplete', () => {
    it('should return true if any required fields are missing', () => {
      const incompleteItem = {
        fullName: { first: 'John' },
        startDate: '1991-02-19',
        endDate: '2000-02-19',
        reasonMarriageEnded: 'Divorce',
        startLocation: { location: { city: 'Some City' }, outsideUsa: false },
        endLocation: { location: { city: 'Another City' }, outsideUsa: false },
      };
      expect(spouseMarriageHistoryOptions.isItemIncomplete(incompleteItem)).to
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
      expect(spouseMarriageHistoryOptions.isItemIncomplete(completeItem)).to.be
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
        spouseMarriageHistoryOptions.isItemIncomplete(completeItemOutsideUsa),
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
        spouseMarriageHistoryOptions.isItemIncomplete(
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
        spouseMarriageHistoryOptions.isItemIncomplete(
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
        spouseMarriageHistoryOptions.isItemIncomplete(
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
        spouseMarriageHistoryOptions.isItemIncomplete(
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
        spouseMarriageHistoryOptions.isItemIncomplete(
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
        spouseMarriageHistoryOptions.isItemIncomplete(
          itemMissingEndLocationCountry,
        ),
      ).to.be.true;
    });
  });

  describe('text.getItemName + text.cardDescription', () => {
    it('should return the full name of the item', () => {
      const item = {
        fullName: { first: 'John', last: 'Doe' },
      };
      expect(spouseMarriageHistoryOptions.text.getItemName()).to.equal(
        'Spouse’s former marriage',
      );
      expect(spouseMarriageHistoryOptions.text.cardDescription(item)).to.equal(
        'John Doe',
      );
    });

    it('should return an empty string if first or last name is missing', () => {
      const incompleteItem = { fullName: { first: 'John' } };
      expect(
        spouseMarriageHistoryOptions.text.cardDescription(incompleteItem),
      ).to.equal('John ');

      const missingBoth = { fullName: {} };
      expect(spouseMarriageHistoryOptions.text.getItemName()).to.equal(
        'Spouse’s former marriage',
      );
      expect(
        spouseMarriageHistoryOptions.text.cardDescription(missingBoth),
      ).to.equal(' ');
    });
  });

  // describe('text.cardDescription', () => {
  //   it('should return formatted start and end dates', () => {
  //     const item = {
  //       startDate: '1991-02-19',
  //       endDate: '2000-02-19',
  //     };
  //     expect(spouseMarriageHistoryOptions.text.cardDescription(item)).to.equal(
  //       '02/19/1991 - 02/19/2000',
  //     );
  //   });

  //   it('should return "Unknown" if start or end date is missing', () => {
  //     const missingStartDate = { endDate: '2000-02-19' };
  //     expect(
  //       spouseMarriageHistoryOptions.text.cardDescription(missingStartDate),
  //     ).to.equal('Unknown - 02/19/2000');

  //     const missingEndDate = { startDate: '1991-02-19' };
  //     expect(
  //       spouseMarriageHistoryOptions.text.cardDescription(missingEndDate),
  //     ).to.equal('02/19/1991 - Unknown');

  //     const missingBoth = {};
  //     expect(
  //       spouseMarriageHistoryOptions.text.cardDescription(missingBoth),
  //     ).to.equal('Unknown - Unknown');
  //   });
  // });
});

// Array pages

describe('686 current marriage information: Spouse marriage history question / Array summary ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistorySummary;

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

describe('686 current marriage information: Former spouse name ', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryPartOne;

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

describe('686 current marriage information: Former spouse name ', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryPartTwo;

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
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryPartThree;

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
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryPartFour;

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
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryPartFive;

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
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryPartSix;

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
