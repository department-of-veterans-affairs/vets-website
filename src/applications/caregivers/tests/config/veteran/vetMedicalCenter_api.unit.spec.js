import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';

describe('CG VeteranMedicalCenterFacilities config', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  const veteran = {
    form: {
      data: {
        veteranPreferredFacility: { veteranFacilityState: '' },
      },
    },
  };
  const store = mockStore(veteran);
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranChapter.pages.veteranInfoThreeFacilities;
  const { defaultDefinitions: definitions } = formConfig;

  it('should render', () => {
    const props = {
      schema,
      definitions,
      uiSchema,
      data: {
        veteranLastTreatmentFacility: {},
      },
    };
    const view = render(
      <Provider store={store}>
        <DefinitionTester {...props} />
      </Provider>,
    );
    const formDOM = view.container;
    expect(formDOM.querySelectorAll('va-search-input').length).to.equal(1);
  });
});
