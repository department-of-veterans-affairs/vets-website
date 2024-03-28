import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

describe('Death Certificate', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.additionalInformation.pages.deathCertificate;

  it('should render', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    expect($$('label.upload-button-label', formDOM).length).to.equal(1);
    expect($$('input', formDOM).length).to.equal(1);
  });
});
