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
import { setupExpressCareMocks } from '../mocks/helpers';
import ExpressCareInfoPage from '../../containers/ExpressCareInfoPage';
import NewExpressCareRequestLayout from '../../containers/NewExpressCareRequestLayout';
import { createTestStore, renderWithStoreAndRouter } from '../mocks/setup';

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
    const store = createTestStore({
      ...initialState,
    });
    const today = moment();
    const startTime = today
      .clone()
      .subtract(5, 'minutes')
      .tz('America/Denver');
    const endTime = today
      .clone()
      .add(3, 'minutes')
      .tz('America/Denver');

    setupExpressCareMocks({
      startTime,
      endTime,
      isUnderRequestLimit: true,
      isWindowOpen: true,
    });

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
    await waitFor(
      () =>
        expect(
          screen.history.push.calledWith(
            '/new-express-care-request/select-reason',
          ),
        ).to.be.true,
    );
  });

  it('should redirect to error page if request limits reached', async () => {
    setupExpressCareMocks({ isWindowOpen: true, isUnderRequestLimit: false });

    const store = createTestStore({
      ...initialState,
    });
    const screen = renderWithStoreAndRouter(<ExpressCareInfoPage />, {
      store,
    });

    expect(await screen.findByText(/How Express Care Works/i)).to.exist;
    fireEvent.click(await screen.findByText(/^Continue/));
    await waitFor(() => expect(screen.history.push.called).to.be.true);
    expect(
      screen.history.push.calledWith('/new-express-care-request/request-limit'),
    ).to.be.true;
  });

  it('should redirect to error page if request limit fetch fails', async () => {
    setupExpressCareMocks({ isWindowOpen: true, isUnderRequestLimit: true });
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v0/facilities/983/limits?type_of_care_id=CR1`,
      ),
      { errors: [] },
    );
    const store = createTestStore({
      ...initialState,
    });
    const screen = renderWithStoreAndRouter(<ExpressCareInfoPage />, {
      store,
    });

    expect(await screen.findByText(/How Express Care Works/i)).to.exist;
    fireEvent.click(await screen.findByText(/^Continue/));
    await waitFor(() => expect(screen.history.push.called).to.be.true);
    expect(
      screen.history.push.calledWith('/new-express-care-request/request-limit'),
    ).to.be.true;
  });

  it('should redirect home when there is not an active window', async () => {
    setupExpressCareMocks({ isWindowOpen: false, isUnderRequestLimit: true });
    const store = createTestStore({
      ...initialState,
    });
    const screen = renderWithStoreAndRouter(<NewExpressCareRequestLayout />, {
      store,
    });

    await waitFor(() => expect(screen.history.push.called).to.be.true);
    expect(screen.history.push.firstCall.args[0]).to.equal('/');
  });
});
