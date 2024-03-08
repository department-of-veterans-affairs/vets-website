/* eslint-disable camelcase */
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import * as redux from 'react-redux';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import contacts from '@@profile/tests/fixtures/contacts.json';
import reducers from '@@profile/reducers';
import PersonalHealthCareContacts from './PersonalHealthCareContacts';

let dispatchSpy;
let props;
let fetchProfileContactsSpy;
let useDispatchStub;

const stateFn = ({
  loading = false,
  error = false,
  data = contacts.data,
} = {}) => ({
  profileContacts: {
    data,
    loading,
    error,
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderInReduxProvider(<PersonalHealthCareContacts {...props} />, {
    initialState,
    reducers,
  });

describe('PersonalHealthCareContacts component', () => {
  beforeEach(() => {
    useDispatchStub = sinon.stub(redux, 'useDispatch');
    dispatchSpy = sinon.spy();
    useDispatchStub.returns(dispatchSpy);

    fetchProfileContactsSpy = sinon.spy();
    props = {
      fetchProfileContacts: fetchProfileContactsSpy,
    };
  });

  afterEach(() => {
    useDispatchStub.restore();
  });

  it('renders', async () => {
    const { getByRole } = setup();
    await waitFor(() => {
      getByRole('heading', { name: 'Personal health care contacts', level: 1 });
      getByRole('heading', { name: 'Emergency contacts', level: 2 });
      getByRole('heading', { name: 'Next of kin contacts', level: 2 });
    });
  });

  it('calls dispatch(fetchProfileContacts()) once', async () => {
    const { getByRole } = setup();
    await waitFor(() => {
      getByRole('heading', { name: 'Personal health care contacts', level: 1 });
    });
    expect(dispatchSpy.calledOnce, 'dispatch called').to.be.true;
    expect(dispatchSpy.calledWithExactly(fetchProfileContactsSpy())).to.be.true;
  });

  it('displays help desk contact information', async () => {
    const { getByTestId } = setup();
    await waitFor(() => {
      const infoComponent = getByTestId('phcc-how-to-update');
      fireEvent.click(infoComponent);
      getByTestId('help-desk-va-800-number');
      getByTestId('help-desk-va-711-number');
    });
  });

  it('renders a loading indicator when contacts are loading', async () => {
    const initialState = stateFn({ loading: true });
    const { getByTestId } = setup({ initialState });
    await waitFor(() => {
      getByTestId('phcc-loading');
    });
  });

  it('renders an alert when loading fails', async () => {
    const initialState = stateFn({ error: 'err' });
    const { getByTestId } = setup({ initialState });
    await waitFor(() => {
      getByTestId('service-is-down-banner');
    });
  });

  it('handles an empty array of contacts', async () => {
    const initialState = stateFn({ data: [] });
    const { getByTestId } = setup({ initialState });
    await waitFor(() => {
      getByTestId('phcc-no-ecs');
      getByTestId('phcc-no-nok');
    });
  });
});
