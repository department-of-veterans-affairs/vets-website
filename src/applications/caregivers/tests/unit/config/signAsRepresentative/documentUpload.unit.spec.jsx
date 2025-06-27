import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';
import { fireClickEvent } from '../../../test-helpers';

const {
  chapters: {
    signAsRepresentative: {
      pages: { documentUpload },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = documentUpload;
const { defaultDefinitions } = formConfig;

// run test to ensure the document upload alert does not render by default
describe(`${pageTitle} page`, () => {
  const mockStore = {
    getState: () => ({ featureToggles: {} }),
    subscribe: () => {},
    dispatch: () => {},
  };
  const subject = () => {
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          definitions={defaultDefinitions}
          uiSchema={uiSchema}
          schema={schema}
          formData={{}}
          data={{}}
        />
      </Provider>,
    );
    const selectors = () => ({
      submitBtn: container.querySelector('button[type="submit"]'),
      errors: container.querySelectorAll('[role="alert"]'),
      inputs: container.querySelectorAll('input, select, textarea'),
      vaAlert: container.querySelector('va-alert[status="warning"]'),
    });
    return { selectors };
  };

  it('should render the correct elements before upload', () => {
    const { selectors } = subject();
    const { inputs, vaAlert } = selectors();
    expect(inputs).to.have.lengthOf(1);
    expect(vaAlert).to.not.exist;
  });

  it('should render the correct number of errors on submit', async () => {
    const { selectors } = subject();
    const { submitBtn } = selectors();
    fireClickEvent(submitBtn);
    await waitFor(() => {
      const { errors } = selectors();
      expect(errors).to.have.lengthOf(1);
    });
  });
});
