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
  spouseInformation: {
    spouseLegalName: {
      first: 'John',
      last: 'Doe',
    },
  },
};

describe('686 current marriage information: Spouse previous marriage question', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistory;

  it('should render marital status question', () => {
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

describe('686 current marriage information: Spouse former spouses list', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryPartTwo;

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

    expect($$('va-text-input', container).length).to.equal(3);
  });

  it('should render', () => {
    const spouseMarriageHistory = [
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
        reasonMarriageEnded: 'Death',
        startDate: '2000-02-19',
        endDate: '2000-03-20',
        startLocation: {},
        endLocation: {},
      },
    ];

    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            ...formData,
            spouseMarriageHistory,
          }}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(3);
    expect(
      $$('button[aria-label="Edit former spouse"]', container).length,
    ).to.equal(1);
    expect(
      $$('button[aria-label="Remove former spouse"]', container).length,
    ).to.equal(1);
  });
});
