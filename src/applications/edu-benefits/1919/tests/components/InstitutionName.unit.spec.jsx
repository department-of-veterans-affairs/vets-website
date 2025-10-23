import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import InstitutionName from '../../components/InstitutionName';

const mockStore = data => ({
  getState: () => ({
    form: { data },
  }),
  subscribe: () => {},
  dispatch: sinon.spy(),
});
describe('InstitutionName component', () => {
  beforeEach(() => {
    sinon.stub(api, 'focusElement');
  });
  it('should show loader initially', () => {
    const store = mockStore({ institutionDetails: { loader: true } });
    const { getByTestId } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );
    expect(getByTestId('loader')).to.exist;
  });
  it('should show institution name when available', () => {
    const store = mockStore({
      institutionDetails: {
        institutionName: 'Test Institution',
        loader: false,
      },
    });
    const { getByText } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );
    expect(getByText('Test Institution')).to.exist;
  });
  it('should show placeholder when institution name is not found', () => {
    const store = mockStore({
      institutionDetails: {
        institutionName: 'not found',
        loader: false,
      },
    });
    const { getByText } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );
    expect(getByText('--')).to.exist;
  });
});
