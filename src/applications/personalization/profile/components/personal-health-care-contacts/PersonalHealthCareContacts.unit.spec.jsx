import React from 'react';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import * as redux from 'react-redux';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import scheduledDowntime from '~/platform/monitoring/DowntimeNotification/reducer';
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
  vaPatient = true,
} = {}) => ({
  profileContacts: {
    data,
    loading,
    error,
  },
  user: {
    profile: {
      vaPatient,
    },
  },
  scheduledDowntime: {
    globalDowntime: null,
    isReady: true,
    isPending: false,
    serviceMap: { get() {} },
    dismissedDowntimeWarnings: [],
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderInReduxProvider(<PersonalHealthCareContacts {...props} />, {
    initialState,
    reducers: { ...reducers, scheduledDowntime },
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
      getByRole('heading', { name: 'Health care contacts', level: 1 });
      getByRole('heading', { name: 'Emergency contacts', level: 2 });
      getByRole('heading', { name: 'Next of kin contacts', level: 2 });
    });
  });

  it('renders non-VA patient message when user is not a VA patient', async () => {
    const initialState = stateFn({ vaPatient: false });
    const { getByTestId } = setup({ initialState });
    await waitFor(() => {
      getByTestId('non-va-patient-message');
    });
  });

  it('calls dispatch(fetchProfileContacts()) once on render', async () => {
    setup();
    await waitFor(() => {
      expect(dispatchSpy.calledWithExactly(fetchProfileContactsSpy())).to.be
        .true;
      expect(dispatchSpy.calledOnce).to.be.true;
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
