import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import formConfig from '../../config/form';

const mockStore = configureStore([]);

describe('22-10275 - Institution Details Facility', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.newCommitmentChapter.pages.institutionDetailsFacilityNew;

  it('renders facility code input, institutionName placeholder, and institutionAddress placeholder', () => {
    const store = mockStore({
      form: {
        data: {
          institutionDetails: { hasVaFacilityCode: true },
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{ institutionDetails: { hasVaFacilityCode: true } }}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(1);
    expect($$('h3#institutionHeading', container).length).to.equal(1);
    expect($$('span[aria-hidden="true"]', container).length).to.equal(1);
  });
});
