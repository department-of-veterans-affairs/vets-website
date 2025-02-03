import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import MileagePage from '../../../../components/submit-flow/pages/MileagePage';
import reducer from '../../../../redux/reducer';

const appointment = require('../../../fixtures/appointment.json');

const setPageIndexSpy = sinon.spy();
// TODO: figure out a way to test this set state call
const setYesNoSpy = sinon.spy();
const setCantFileSpy = sinon.spy();

describe('Mileage page', () => {
  const props = {
    pageIndex: 1,
    setPageIndex: () => setPageIndexSpy(),
    yesNo: {
      mileage: 'yes',
      vehicle: '',
      address: '',
    },
    setYesNo: () => setYesNoSpy(),
    setIsUnsupportedClaimType: () => setCantFileSpy(),
  };

  it('should render correctly', async () => {
    const screen = renderWithStoreAndRouter(<MileagePage {...props} />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: false,
            error: null,
            data: appointment.data,
          },
        },
      },
      reducers: reducer,
    });

    expect(screen.getByTestId('mileage-test-id')).to.exist;
    expect(screen.findByText('Fort Collins VA Clinic')).to.exist;
    expect($('va-button-pair')).to.exist;

    fireEvent.click(
      $(`va-additional-info[trigger="How do we calculate mileage"]`),
    );
    await waitFor(() => {
      expect(screen.findByText(/We pay round-trip mileage/i)).to.exist;
    });

    fireEvent.click(
      $(`va-additional-info[trigger="If you have other expenses to claim"]`),
    );
    await waitFor(() => {
      expect(screen.findByText(/submit receipts for other expenses/i)).to.exist;
    });

    $('va-button-pair').__events.primaryClick(); // continue
    await waitFor(() => {
      expect(setPageIndexSpy.called).to.be.true;
    });
  });

  it('should render an error if no selection made', async () => {
    const screen = renderWithStoreAndRouter(<MileagePage {...props} />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: false,
            error: null,
            data: appointment.data,
          },
        },
      },
      reducers: reducer,
    });

    expect(screen.getByTestId('mileage-test-id')).to.exist;
    $('va-button-pair').__events.primaryClick(); // continue
    await waitFor(() => {
      expect(screen.findByText(/You must make a selection/i)).to.exist;
    });
  });

  it('should set isUnsupportedClaimType if answering No', async () => {
    renderWithStoreAndRouter(
      <MileagePage {...props} yesNo={{ ...props.yesNo, mileage: 'no' }} />,
      {
        initialState: {
          travelPay: {
            appointment: {
              isLoading: false,
              error: null,
              data: appointment.data,
            },
          },
        },
        reducers: reducer,
      },
    );

    $('va-button-pair').__events.primaryClick(); // continue
    await waitFor(() => {
      expect(setCantFileSpy.called).to.be.true;
    });
  });
});
