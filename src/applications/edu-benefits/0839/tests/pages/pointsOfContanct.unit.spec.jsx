import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { uiSchema, schema } from '../../pages/pointsOfContanct';

const mockStore = configureStore([]);

describe('pointsOfContanct page', () => {
  let store;

  const renderForm = (data, onSubmit = () => {}) =>
    render(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          onSubmit={onSubmit}
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

  const baseContact = {
    fullName: {
      first: 'Jane',
      last: 'Doe',
    },
    phoneNumber: {
      callingCode: 1,
      countryCode: 'US',
      contact: '5555555555',
    },
    email: 'jane.doe@example.com',
  };

  it('requires selecting at least one role', async () => {
    const onSubmit = sinon.spy();
    const data = {
      pointsOfContact: {
        ...baseContact,
        roles: {
          isYellowRibbonProgramPointOfContact: false,
          isSchoolFinancialRepresentative: false,
          isSchoolCertifyingOfficial: false,
        },
      },
    };

    const { container, unmount } = renderForm(data, onSubmit);

    fireEvent.submit(container.querySelector('form'));
    await waitFor(() => {
      const checkboxGroup = container.querySelector('va-checkbox-group');
      expect(checkboxGroup?.getAttribute('error')).to.equal(
        'Please make a selection',
      );
      expect(onSubmit.called).to.be.false;
    });
    unmount();
  });

  it('submits when at least one role is selected', async () => {
    const onSubmit = sinon.spy();
    const data = {
      pointsOfContact: {
        ...baseContact,
        roles: {
          isYellowRibbonProgramPointOfContact: true,
        },
      },
    };

    const { container, unmount } = renderForm(data, onSubmit);

    fireEvent.submit(container.querySelector('form'));
    await waitFor(() => {
      expect(onSubmit.called).to.be.true;
    });
    unmount();
  });
});
