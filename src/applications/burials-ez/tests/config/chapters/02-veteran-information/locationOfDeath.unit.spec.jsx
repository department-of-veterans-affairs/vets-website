import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

describe('Location Of Death', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.locationOfDeath;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect($$('va-radio-option', container).length).to.equal(6);
  });
});
