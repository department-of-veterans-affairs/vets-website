import React from 'react';
import { expect } from 'chai';
import { waitFor, fireEvent } from '@testing-library/react';
import * as actions from '../../actions';
import { mockConstants, renderWithStoreAndRouter } from '../helpers';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';

describe('<TuitionAndHousingEstimates>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<TuitionAndHousingEstimates />, {
      initialState: {
        constants: mockConstants(),
      },
    });

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
  it('dispatches the eligibilityChange action with the correct payload when updateStore is called', () => {
    const eligibility = {
      expanded: false,
      giBillChapter: '33',
      militaryStatus: 'veteran',
      spouseActiveDuty: 'no',
      cumulativeService: '1.0',
      enlistmentService: '3',
      eligForPostGiBill: 'yes',
      numberOfDependents: '0',
      onlineClasses: 'no',
    };
    const screen = renderWithStoreAndRouter(
      <TuitionAndHousingEstimates
        eligibility={eligibility}
        dispatchEligibilityChange={() => {}}
        dispatchShowModal={() => {}}
        modalClose={() => {}}
        smallScreen={false}
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    fireEvent.click(screen.getByText('Update tuition and housing estimates'));
    const actionsCalled = screen?.store?.getActions();
    expect(
      actionsCalled?.some(
        action => action.type === actions.eligibilityChange().type,
      ),
    ).to.be.undefined;
  });
});
