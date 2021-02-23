import { expect } from 'chai';
import MockDate from 'mockdate';
import moment from 'moment';
import { waitFor, fireEvent } from '@testing-library/dom';
import React from 'react';
import environment from 'platform/utilities/environment';
import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import { setupExpressCareMocks } from '../../mocks/helpers';
import { NewExpressCareRequest } from '../../../express-care';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

const initialState = {
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
  featureToggles: {
    vaOnlineSchedulingExpressCareNew: true,
  },
};

describe('VAOS integration: Express Care info page', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(moment('2020-01-26T14:00:00'));
  });
  afterEach(() => {
    resetFetch();
    MockDate.reset();
  });

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

    const screen = renderWithStoreAndRouter(<NewExpressCareRequest />, {
      store,
    });

    expect(await screen.findByText(/How Express Care Works/i)).to.exist;
    expect(
      await screen.findByText(/Express Care can’t provide emergency help/i),
    ).to.exist;
    expect(screen.getByTestId('p_vaos-ecip-call-911')).to.have.id(
      'vaos-ecip-call-911',
    );
    expect(screen.getByTestId('ul_vaos-ecip-call-911')).to.have.attr(
      'aria-labelledby',
      'vaos-ecip-call-911',
    );
    expect(screen.getByTestId('p_vaos-ecip-talk')).to.have.id('vaos-ecip-talk');
    expect(screen.getByTestId('ul_vaos-ecip-talk')).to.have.attr(
      'aria-labelledby',
      'vaos-ecip-talk',
    );
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
    const screen = renderWithStoreAndRouter(<NewExpressCareRequest />, {
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
    const screen = renderWithStoreAndRouter(<NewExpressCareRequest />, {
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
    const screen = renderWithStoreAndRouter(<NewExpressCareRequest />, {
      store,
    });

    await waitFor(() => expect(screen.history.push.called).to.be.true);
    expect(screen.history.push.firstCall.args[0]).to.equal('/');
  });

  it('should render warning message', async () => {
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
    setFetchJSONResponse(
      global.fetch.withArgs(`${environment.API_URL}/v0/maintenance_windows/`),
      {
        data: [
          {
            id: '139',
            type: 'maintenance_windows',
            attributes: {
              externalService: 'vaosWarning',
              description: 'My description',
              startTime: moment.utc().subtract('1', 'days'),
              endTime: moment.utc().add('1', 'days'),
            },
          },
        ],
      },
    );
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<NewExpressCareRequest />, {
      store,
    });

    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: /You may have trouble using the VA appointments tool right now/,
      }),
    ).to.exist;
  });
});
