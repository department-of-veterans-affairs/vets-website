import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as recordEventModule from 'platform/monitoring/record-event';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import MileagePage from '../../../../components/submit-flow/pages/MileagePage';
import reducer from '../../../../redux/reducer';

const mockAppt = {
  practitioners: [
    {
      name: {
        family: 'BERNARDO',
        given: ['KENNETH J'],
      },
    },
  ],
  start: '2024-12-30T14:00:00Z',
  localStartTime: '2024-12-30T08:00:00.000-06:00',
  location: {
    id: '983',
    type: 'appointments',
    attributes: {
      name: 'Cheyenne VA Medical Center',
    },
  },
};

describe('Mileage page', () => {
  const setPageIndexSpy = sinon.spy();
  // TODO: figure out a way to test this set state call
  const setYesNoSpy = sinon.spy();
  const setCantFileSpy = sinon.spy();

  const props = {
    pageIndex: 1,
    setPageIndex: setPageIndexSpy,
    yesNo: {
      mileage: 'yes',
      vehicle: '',
      address: '',
    },
    setYesNo: setYesNoSpy,
    setIsUnsupportedClaimType: setCantFileSpy,
  };

  let recordEventStub;

  beforeEach(() => {
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    recordEventStub.restore();
  });

  it('should render correctly and record pageview', () => {
    const screen = renderWithStoreAndRouter(<MileagePage {...props} />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: false,
            error: null,
            data: mockAppt,
          },
        },
      },
      reducers: reducer,
    });

    expect(screen.getByTestId('mileage-test-id')).to.exist;
    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.exist;
    expect($('va-radio')).to.have.attribute(
      'label',
      'Are you only claiming mileage?',
    );
    expect(
      recordEventStub.calledWith({
        event: 'smoc-pageview',
        action: 'view',
        /* eslint-disable camelcase */
        heading_1: 'mileage',
        /* eslint-enable camelcase */
      }),
    ).to.be.true;
    expect($('va-radio')).to.not.have.attribute('error');

    expect($('va-button-pair')).to.exist;

    fireEvent.click(
      $(`va-additional-info[trigger="How do we calculate mileage"]`),
    );
    expect(screen.getByText(/We pay round-trip mileage/i)).to.exist;

    fireEvent.click(
      $(`va-additional-info[trigger="If you have other expenses to claim"]`),
    );
    expect(screen.getByText(/submit receipts for other expenses/i)).to.exist;

    $('va-button-pair').__events.primaryClick(); // continue

    expect(
      recordEventStub.calledWith({
        event: 'smoc-button',
        action: 'click',
        /* eslint-disable camelcase */
        heading_1: 'mileage',
        link_text: 'continue',
        /* eslint-enable camelcase */
      }),
    ).to.be.true;
    expect(setPageIndexSpy.calledWith(2)).to.be.true;
  });

  it('should render an error if no selection made', () => {
    const screen = renderWithStoreAndRouter(
      <MileagePage
        {...props}
        yesNo={{
          ...props.yesNo,
          mileage: '',
        }}
      />,
      {
        initialState: {
          travelPay: {
            appointment: {
              isLoading: false,
              error: null,
              data: mockAppt,
            },
          },
        },
        reducers: reducer,
      },
    );

    expect(screen.getByTestId('mileage-test-id')).to.exist;
    $('va-button-pair').__events.primaryClick(); // continue
    expect($('va-radio')).to.have.attribute(
      'error',
      'You must make a selection to continue.',
    );
  });

  it('should set isUnsupportedClaimType if answering No', () => {
    renderWithStoreAndRouter(
      <MileagePage {...props} yesNo={{ ...props.yesNo, mileage: 'no' }} />,
      {
        initialState: {
          travelPay: {
            appointment: {
              isLoading: false,
              error: null,
              data: mockAppt,
            },
          },
        },
        reducers: reducer,
      },
    );

    $('va-button-pair').__events.primaryClick(); // continue

    expect(
      recordEventStub.calledWith({
        event: 'smoc-button',
        action: 'click',
        /* eslint-disable camelcase */
        heading_1: 'mileage',
        link_text: 'continue',
        /* eslint-enable camelcase */
      }),
    ).to.be.true;
    expect(setCantFileSpy.calledWith(true)).to.be.true;
  });

  it('should move back a step', () => {
    renderWithStoreAndRouter(<MileagePage {...props} />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: false,
            error: null,
            data: mockAppt,
          },
        },
      },
      reducers: reducer,
    });

    $('va-button-pair').__events.secondaryClick(); // back

    expect(
      recordEventStub.calledWith({
        event: 'smoc-button',
        action: 'click',
        /* eslint-disable camelcase */
        heading_1: 'mileage',
        link_text: 'back',
        /* eslint-enable camelcase */
      }),
    ).to.be.true;
    expect(setCantFileSpy.calledWith(false)).to.be.true;
    expect(setPageIndexSpy.calledWith(0)).to.be.true;
  });
});
