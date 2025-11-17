import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { uiSchema, schema } from '../../pages/additionalPointsOfContact';

const mockStore = configureStore([]);

describe('additionalPointsOfContact page', () => {
  let store;

  const renderForm = data =>
    render(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          definitions={formConfig.defaultDefinitions}
        />
      </Provider>,
    );

  beforeEach(() => {
    store = mockStore({
      form: {
        data: {},
      },
    });
  });

  it('shows Yellow Ribbon Program point of contact title when base contact lacks YR roles', () => {
    const formData = {
      pointsOfContact: {
        roles: {
          isSchoolCertifyingOfficial: true,
        },
      },
      additionalPointsOfContact: {},
    };

    const { getByText, unmount } = renderForm(formData);

    expect(() =>
      getByText('Add Yellow Ribbon Program point of contact'),
    ).to.not.throw();
    unmount();
  });

  it('shows school certifying official title when base contact is a Yellow Ribbon representative', () => {
    const formData = {
      pointsOfContact: {
        roles: {
          isYellowRibbonProgramPointOfContact: true,
        },
      },
      additionalPointsOfContact: {},
    };

    const { getByText, unmount } = renderForm(formData);

    expect(() => getByText('Add school certifying official')).to.not.throw();
    unmount();
  });
});
