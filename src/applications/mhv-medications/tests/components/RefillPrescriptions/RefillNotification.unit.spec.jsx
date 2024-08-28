import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import RefillNotification from '../../../components/RefillPrescriptions/RefillNotification';
import reducer from '../../../reducers';
import refillableList from '../../fixtures/refillablePrescriptionsList.json';

describe('Refill Notification Component', () => {
  const initialState = {
    rx: {
      prescriptions: {
        refillableList,
        refillNotification: {
          successfulIds: [
            refillableList[0].prescriptionId.toString(),
            refillableList[1].prescriptionId.toString(),
            refillableList[2].prescriptionId.toString(),
          ],
          failedIds: [
            refillableList[3].prescriptionId.toString(),
            refillableList[4].prescriptionId.toString(),
            refillableList[5].prescriptionId.toString(),
          ],
        },
      },
    },
  };
  const initRefillStatus = 'finished';

  const setup = (state = initialState, refillStatus = initRefillStatus) => {
    return renderWithStoreAndRouter(
      <RefillNotification refillStatus={refillStatus} />,
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
    const screen = setup({
      rx: {
        prescriptions: {
          refillableList,
          refillNotification: {
            successfulIds: [],
            failedIds: [
              refillableList[3].prescriptionId.toString(),
              refillableList[4].prescriptionId.toString(),
              refillableList[5].prescriptionId.toString(),
            ],
          },
        },
      },
    });
    const failedList = screen.getAllByTestId('medication-requested-failed');
    expect(failedList.length).to.eq(3);
    expect(screen.getByText('Request not submitted')).to.exist;
  });

  it('Part of the refill requests are successful', () => {
    const screen = setup();
    expect(screen.getByText('Only part of your request was submitted')).to
      .exist;
    expect(screen.getByText('Refills requested')).to.exist;
  });

  it('should render items', () => {
    const screen = setup();
    const successfulList = screen.getAllByTestId(
      'medication-requested-successful',
    );
    const failedList = screen.getAllByTestId('medication-requested-failed');
    expect(successfulList.length + failedList.length).to.eq(6);
  });

  it('All refill requests are successful', () => {
    const screen = setup({
      rx: {
        prescriptions: {
          refillableList,
          refillNotification: {
            successfulIds: [
              refillableList[0].prescriptionId.toString(),
              refillableList[1].prescriptionId.toString(),
              refillableList[2].prescriptionId.toString(),
            ],
            failedIds: [],
          },
        },
      },
    });
    expect(
      screen.getByText(
        'For updates on your refill requests, go to your medications list.',
      ),
    ).to.exist;
    expect(screen.getByText('Go to your medications list')).to.exist;
    const successfulList = screen.getAllByTestId(
      'medication-requested-successful',
    );
    expect(successfulList.length).to.eq(3);
  });
});
