import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RefillNotification from '../../../components/RefillPrescriptions/RefillNotification';
import reducer from '../../../reducers';
import prescriptions from '../../fixtures/refillablePrescriptionsList.json';

describe('Refill Notification Component', () => {
  const initialState = {
    rx: {
      prescriptions,
    },
  };
  const initRefillResult = {
    successfulIds: [],
    failedIds: ['23449884'],
    status: 'finished',
  };

  const setup = (
    state = initialState,
    list = prescriptions,
    refillResult = initRefillResult,
  ) => {
    return renderWithStoreAndRouter(
      <RefillNotification refillList={list} refillResult={refillResult} />,
      {
        initialState: state,
        reducers: reducer,
        path: '/refill',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('All refill requests are failed', async () => {
    const screen = setup();
    expect(screen.getByText('Request not submitted')).to.exist;
  });

  it('Part of the refill requests are successful', () => {
    const screen = renderWithStoreAndRouter(
      <RefillNotification
        refillList={prescriptions}
        refillResult={{
          successfulIds: ['23449884'],
          failedIds: ['23449985'],
          status: 'finished',
        }}
      />,
      {
        initialState: {
          rx: {
            prescriptions,
          },
        },
        reducers: reducer,
        path: '/',
      },
    );
    expect(screen.getByText('Only part of your request was submitted')).to
      .exist;
    expect(screen.getByText('Refill prescriptions')).to.exist;
  });
  it('should render items', () => {
    const wrapper = shallow(
      <RefillNotification
        refillList={prescriptions}
        refillResult={{
          successfulIds: ['22377956'],
          failedIds: ['22377955'],
          status: 'finished',
        }}
      />,
    );
    const list = wrapper.find('li');
    expect(list.length).to.eq(2);
    wrapper.unmount();
  });
  it('All refill requests are successful', () => {
    const screen = renderWithStoreAndRouter(
      <RefillNotification
        refillList={prescriptions}
        refillResult={{
          successfulIds: ['23449884'],
          failedIds: [],
          status: 'finished',
        }}
      />,
      {
        initialState: {
          rx: {
            prescriptions,
          },
        },
        reducers: reducer,
        path: '/',
      },
    );
    expect(
      screen.getByText(
        'For updates on your refill requests, go to your medications list.',
      ),
    ).to.exist;
    expect(screen.getByText('Go to your medications list')).to.exist;
  });
});
