import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';
import { waitFor, fireEvent } from '@testing-library/dom';
import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import environment from 'platform/utilities/environment';
import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import ExpressCareInfoPage from '../../containers/ExpressCareInfoPage';
import NewExpressCareRequestLayout from '../../containers/NewExpressCareRequestLayout';
import { createTestStore } from '../mocks/setup';
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

const location = {
  pathname: '/new-express-care-request',
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
    const router = {
      push: sinon.spy(),
      replace: sinon.spy(),
    };
    const store = createTestStore(initialState);
    const screen = renderInReduxProvider(
      <NewExpressCareRequestLayout router={router} location={location}>
        <ExpressCareInfoPage router={router} />
      </NewExpressCareRequestLayout>,
      {
        store,
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
    expect(router.push.calledWith('/')).to.be.true;

    fireEvent.click(screen.getByText(/^Continue/));
    await waitFor(() => expect(router.push.called).to.be.true);
    expect(router.push.secondCall.args[0]).to.equal(
      '/new-express-care-request/select-reason',
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
    const router = {
      push: sinon.spy(),
      replace: sinon.spy(),
    };
    const store = createTestStore(initialState);
    const screen = renderInReduxProvider(
      <NewExpressCareRequestLayout router={router} location={location}>
        <ExpressCareInfoPage router={router} />
      </NewExpressCareRequestLayout>,
      {
        store,
      },
    );

    expect(await screen.findByText(/How Express Care Works/i)).to.exist;
    fireEvent.click(await screen.getByText(/^Continue/));
    await waitFor(() => expect(router.push.called).to.be.false);
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
    const router = {
      push: sinon.spy(),
      replace: sinon.spy(),
    };
    const store = createTestStore(initialState);
    const screen = renderInReduxProvider(
      <NewExpressCareRequestLayout router={router} location={location}>
        <ExpressCareInfoPage router={router} />
      </NewExpressCareRequestLayout>,
      {
        store,
      },
    );

    expect(await screen.findByText(/How Express Care Works/i)).to.exist;
    fireEvent.click(await screen.getByText(/^Continue/));
    await waitFor(() => expect(router.push.called).to.be.false);
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
    const router = {
      push: sinon.spy(),
    };
    const store = createTestStore(initialState);
    const screen = renderInReduxProvider(
      <NewExpressCareRequestLayout router={router} location={location}>
        <ExpressCareInfoPage router={router} />
      </NewExpressCareRequestLayout>,
      {
        store,
      },
    );

    await waitFor(() => expect(router.push.called).to.be.true);
    expect(router.push.firstCall.args[0]).to.equal('/');
    expect(screen.queryByText(/How Express Care Works/i)).to.not.exist;
  });
});
