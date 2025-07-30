import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import InstitutionAddress from '../../components/InstitutionAddress';

const mockStore = data => ({
  getState: () => ({
    form: { data },
  }),
  subscribe: () => {},
  dispatch: sinon.spy(),
});
describe('InstitutionAddress component', () => {
  beforeEach(() => {
    sinon.stub(api, 'focusElement');
  });
  it('should show institution address when available', () => {
    const store = mockStore({
      institutionDetails: {
        address: {
          address1: '123 Main St',
          address2: 'Suite 100',
          address3: '',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
          country: 'USA',
        },
        loader: false,
      },
    });
    const { getByText } = render(
      <Provider store={store}>
        <InstitutionAddress />
      </Provider>,
    );
    expect(getByText('123 Main St')).to.exist;
  });
  it('should show placeholder when institution address is not found', () => {
    const store = mockStore({
      institutionDetails: {
        address: {},
        loader: false,
      },
    });
    const { getByText } = render(
      <Provider store={store}>
        <InstitutionAddress />
      </Provider>,
    );
    expect(getByText('--')).to.exist;
  });
  it('should show institution address3 when available', () => {
    const store = mockStore({
      institutionDetails: {
        address: {
          address1: '123 Main St',
          address2: 'Suite 100',
          address3: 'north st',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
          country: 'USA',
        },
        loader: false,
      },
    });
    const { getByText } = render(
      <Provider store={store}>
        <InstitutionAddress />
      </Provider>,
    );
    expect(getByText('north st')).to.exist;
  });
});
