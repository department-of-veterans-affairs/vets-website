import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    addSpouse: true,
  },
  spouseWasMarriedBefore: true,
  spouseMarriageHistory: [
    {
      fullName: {
        first: 'My',
        last: 'Ex',
      },
      reasonMarriageEnded: 'Death',
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

describe('686 current marriage information: spouse marriage ending question ', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryDetails;

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

  it('should render text field when Other is selected', () => {
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

describe('686 current marriage information: spouse marriage start date', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryDetailsPartTwo;

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

describe('686 current marriage information: spouse marriage end date', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryDetailsPartThree;

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

describe('686 current marriage information: spouse marriage start location', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryDetailsPartFour;

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
  });

  it('should render without select field when checkbox is checked', () => {
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

describe('686 current marriage information: spouse marriage end location', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryDetailsPartFive;

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
  });

  it('should render without select field when checkbox is checked', () => {
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
