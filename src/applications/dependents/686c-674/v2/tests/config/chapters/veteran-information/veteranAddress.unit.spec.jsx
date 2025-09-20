import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

describe('Veteran Information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.veteranAddress;

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

    expect($$('va-text-input', formDOM).length).to.equal(6);
  });

  it('should render custom city error', async () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            veteranContactInformation: {
              veteranAddress: { city: 'APO', isMilitary: false },
            },
          }}
        />
      </Provider>,
    );

    const form = container?.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      const cityInput = container.querySelector(
        'va-text-input[name="root_veteranContactInformation_veteranAddress_city"]',
      );
      expect(cityInput).to.exist;
      expect(cityInput.getAttribute('error')).to.equal(
        'Enter a valid city name',
      );
    });
  });
});
