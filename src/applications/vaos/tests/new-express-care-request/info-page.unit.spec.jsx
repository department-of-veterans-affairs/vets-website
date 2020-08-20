import { expect } from 'chai';
import moment from 'moment';
import { waitFor, fireEvent } from '@testing-library/dom';
import React from 'react';
import environment from 'platform/utilities/environment';
import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import ExpressCareInfoPage from '../../containers/ExpressCareInfoPage';
import NewExpressCareRequestLayout from '../../containers/NewExpressCareRequestLayout';
import { createTestStore, renderWithStoreAndRouter } from '../mocks/setup';
import { getExpressCareRequestCriteriaMock } from '../mocks/v0';
import {
  mockRequestEligibilityCriteria,
  mockRequestLimit,
} from '../mocks/helpers';

const initialState = {
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS integration: Express Care info page', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should render info page when there are active windows', async () => {
    const today = moment();
    const startTime = today
      .clone()
      .subtract('2', 'minutes')
      .tz('America/Denver');
    const endTime = today
      .clone()
      .add('1', 'minutes')
      .tz('America/Denver');
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: startTime.format('HH:mm'),
        endTime: endTime.format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], requestCriteria);
    mockRequestLimit({ facilityId: '983' });
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <NewExpressCareRequestLayout>
        <ExpressCareInfoPage />
      </NewExpressCareRequestLayout>,
      {
        store,
        path: '/new-express-care-request',
      },
    );

    expect(await screen.findByText(/How Express Care Works/i)).to.exist;
    expect(
      screen.getByText(
        new RegExp(
          `You can request Express Care today between ${startTime.format(
            'h:mm a',
          )} and ${endTime.format('h:mm a')} MT`,
          'i',
        ),
      ),
    ).to.exist;

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.history.push.calledWith('/')).to.be.true;

    fireEvent.click(screen.getByText(/^Continue/));
    await waitFor(() =>
      expect(screen.history.push.secondCall.args[0]).to.equal(
        '/new-express-care-request/select-reason',
      ),
    );
  });

  it('should display error if request limits reached', async () => {
    const today = moment();
    const startTime = today
      .clone()
      .subtract('2', 'minutes')
      .tz('America/Denver');
    const endTime = today
      .clone()
      .add('1', 'minutes')
      .tz('America/Denver');
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: startTime.format('HH:mm'),
        endTime: endTime.format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], requestCriteria);
    mockRequestLimit({
      facilityId: '983',
      requestLimit: 1,
      numberOfRequests: 1,
    });
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <NewExpressCareRequestLayout>
        <ExpressCareInfoPage />
      </NewExpressCareRequestLayout>,
      {
        store,
      },
    );

    expect(await screen.findByText(/How Express Care Works/i)).to.exist;
    fireEvent.click(await screen.findByText(/^Continue/));
    await waitFor(() => expect(screen.history.push.called).to.be.false);
    expect(
      await screen.findByText(
        /You’ve reached the limit for Express Care requests/i,
      ),
    ).to.exist;
  });

  it('should display error if request limit fetch fails', async () => {
    const today = moment();
    const startTime = today
      .clone()
      .subtract('2', 'minutes')
      .tz('America/Denver');
    const endTime = today
      .clone()
      .add('1', 'minutes')
      .tz('America/Denver');
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: startTime.format('HH:mm'),
        endTime: endTime.format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], requestCriteria);
    mockRequestLimit({
      facilityId: '983',
      requestLimit: 1,
      numberOfRequests: 1,
    });
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v0/facilities/983/limits?type_of_care_id=CR1`,
      ),
      { errors: [] },
    );
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <NewExpressCareRequestLayout>
        <ExpressCareInfoPage />
      </NewExpressCareRequestLayout>,
      {
        store,
      },
    );

    expect(await screen.findByText(/How Express Care Works/i)).to.exist;
    fireEvent.click(await screen.findByText(/^Continue/));
    await waitFor(() => expect(screen.history.push.called).to.be.false);
    expect(
      await screen.findByText(
        /Something went wrong when we tried to check your request/i,
      ),
    ).to.exist;
  });

  it('should redirect home when there is not an active window', async () => {
    const today = moment();
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: today
          .clone()
          .subtract('2', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
        endTime: today
          .clone()
          .subtract('1', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], requestCriteria);
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <NewExpressCareRequestLayout>
        <ExpressCareInfoPage />
      </NewExpressCareRequestLayout>,
      {
        store,
      },
    );

    await waitFor(() => expect(screen.history.push.called).to.be.true);
    expect(screen.history.push.firstCall.args[0]).to.equal('/');
    expect(screen.queryByText(/How Express Care Works/i)).to.not.exist;
  });
});
