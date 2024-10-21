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
    report674: true,
  },
};

describe('674 Add students: Student information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.studentInformation;

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
    expect($$('va-memorable-date', container).length).to.equal(1);
  });

  it('should render Array view when there are multiple entries', () => {
    const studentInformation = [
      {
        fullName: {
          first: 'My',
          last: 'Child',
        },
        birthDate: '2000-01-01',
      },
      {
        fullName: {
          first: 'My',
          middle: 'Other',
          last: 'Child',
        },
        birthDate: '2000-01-01',
      },
    ];

    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{ ...formData, studentInformation }}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(3);
    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('button[aria-label="Edit student"]', container).length).to.equal(
      1,
    );
    expect(
      $$('button[aria-label="Remove student"]', container).length,
    ).to.equal(1);
  });
});
