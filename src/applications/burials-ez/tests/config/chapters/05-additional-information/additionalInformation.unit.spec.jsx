import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

describe('Additional evidence', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.additionalInformation.pages.additionalEvidence;

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

    const fileInput = formDOM.querySelector('va-file-input-multiple');
    expect(fileInput).to.exist;

    expect(fileInput.getAttribute('label')).to.equal(
      'Upload additional supporting documents',
    );

    expect(fileInput.getAttribute('required')).to.equal('false');
  });
});
