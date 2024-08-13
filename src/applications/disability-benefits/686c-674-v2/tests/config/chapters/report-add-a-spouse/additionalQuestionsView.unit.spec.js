import { render /* screen */ } from '@testing-library/react';
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

describe.skip('686 current spouse information: Current spouse former marriage detail message', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistory;

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

    // screen.debug();

    expect($$('p', container)).to.exist;
  });
});
