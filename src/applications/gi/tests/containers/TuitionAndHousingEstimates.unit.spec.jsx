import React from 'react';
import { expect } from 'chai';
import { waitFor, fireEvent } from '@testing-library/react';
import * as actions from '../../actions';
import {
  mockConstants,
  renderWithStoreAndRouter,
  mockEligibility,
} from '../helpers';
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
    const screen = renderWithStoreAndRouter(
      <TuitionAndHousingEstimates
        eligibility={mockEligibility}
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
    fireEvent.click(
      screen.getByText(
        'Update tuition, housing, and monthly benefit estimates',
      ),
    );
    const actionsCalled = screen?.store?.getActions();
    expect(
      actionsCalled?.some(
        action => action.type === actions.eligibilityChange().type,
      ),
    ).to.be.undefined;
  });

  it('should update tuition and housing estimates in desktop view', async () => {
    const screen = renderWithStoreAndRouter(
      <TuitionAndHousingEstimates
        eligibility={mockEligibility}
        dispatchEligibilityChange={() => {}}
        dispatchShowModal={() => {}}
        modalClose={() => {}}
        smallScreen={false} // true makes it mobile view | false will make it desktop view
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    fireEvent.click(
      screen.getByText(
        'Update tuition, housing, and monthly benefit estimates',
      ),
    );
    const UpdateEstimatesButton = screen.getByRole('button', {
      name: 'Update estimates',
    });
    fireEvent.click(UpdateEstimatesButton);
    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });

  it('should update tuition and housing estimates in mobile view', async () => {
    const { container } = renderWithStoreAndRouter(
      <TuitionAndHousingEstimates
        eligibility={mockEligibility}
        dispatchEligibilityChange={() => {}}
        dispatchShowModal={() => {}}
        modalClose={() => {}}
        smallScreen // true makes it mobile view | false will make it desktop view
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const UpdateEstimatesButton = container.querySelector(
      '#update-update-tuition\\,-housing\\,-and-monthly-benefit-estimates-button',
    );
    fireEvent.click(UpdateEstimatesButton);

    await waitFor(() => {
      expect(container).to.not.be.null;
    });
  });

  it('should open then close update tuition and housing estimates accordion in desktop view', async () => {
    const screen = renderWithStoreAndRouter(
      <TuitionAndHousingEstimates
        eligibility={mockEligibility}
        dispatchEligibilityChange={() => {}}
        dispatchShowModal={() => {}}
        modalClose={() => {}}
        smallScreen={false} // true makes it mobile view | false will make it desktop view
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const updateTuitionEstimatesButton = screen.getByRole('button', {
      name: 'Update tuition, housing, and monthly benefit estimates',
    });
    fireEvent.click(updateTuitionEstimatesButton); // first click opens accordion
    await waitFor(() => {
      expect(updateTuitionEstimatesButton).to.have.attribute(
        'aria-expanded',
        'true',
      );
    });

    fireEvent.click(updateTuitionEstimatesButton); // second click closes accordion
    await waitFor(() => {
      expect(updateTuitionEstimatesButton).to.have.attribute(
        'aria-expanded',
        'false',
      );
    });
  });
});
