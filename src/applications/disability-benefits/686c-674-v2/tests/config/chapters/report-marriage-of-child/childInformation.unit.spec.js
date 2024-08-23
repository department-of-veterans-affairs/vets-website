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
};

describe('686 report marriage of child: Child information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildMarriage.pages.childInformation;

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

    expect($$('va-text-input', container).length).to.equal(4);
    expect($$('va-memorable-date', container).length).to.equal(2);
  });

  it('should render Array view when there are multiple entries', () => {
    const childMarriage = [
      {
        fullName: {
          first: 'My',
          last: 'Child',
        },
        ssn: '333445555',
        birthDate: '2000-01-01',
        dateMarried: '2024-01-01',
      },
      {
        fullName: {
          first: 'My',
          middle: 'Other',
          last: 'Child',
        },
        ssn: '333445556',
        birthDate: '2000-01-01',
        dateMarried: '2024-01-01',
      },
    ];

    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{ ...formData, childMarriage }}
        />
      </Provider>,
    );

    // screen.debug();

    expect($$('va-text-input', container).length).to.equal(4);
    expect($$('va-memorable-date', container).length).to.equal(2);
    // expect(
    //   $$('button[aria-label="Edit child child who got married"]', container)
    //     .length,
    // ).to.equal(1);
    // expect(
    //   $$('h3[aria-label="Remove child who got married"]', container).length,
    // ).to.equal(1);
  });
});
