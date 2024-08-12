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
    successfulMeds: [],
    failedMeds: prescriptions,
    status: 'finished',
  };

  const setup = (state = initialState, refillResult = initRefillResult) => {
    return renderWithStoreAndRouter(
      <RefillNotification refillResult={refillResult} />,
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
        refillResult={{
          successfulMeds: prescriptions,
          failedMeds: prescriptions,
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
    expect(screen.getByText('Refills requested')).to.exist;
  });
  it('should render items', () => {
    const wrapper = shallow(
      <RefillNotification
        refillResult={{
          successfulMeds: prescriptions,
          failedMeds: prescriptions,
          status: 'finished',
        }}
      />,
    );
    const list = wrapper.find('li');
    expect(list.length).to.eq(16);
    wrapper.unmount();
  });
  it('All refill requests are successful', () => {
    const screen = renderWithStoreAndRouter(
      <RefillNotification
        refillResult={{
          successfulMeds: prescriptions,
          failedMeds: [],
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
