import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import Sinon from 'sinon';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import { TYPE_OF_CARE_IDS } from '../../utils/constants';
import ScheduleCernerPageV2 from './ScheduleCernerPageV2';
import { Facility } from '../../tests/mocks/unit-test-helpers';

describe('VAOS Page: ScheduleCernerPageV2', () => {
  const sandbox = Sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('when featureUseVpg is false', () => {
    it('should render ScheduleCernerPage (legacy)', async () => {
      // Arrange
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingUseVpg: false,
        },
        newAppointment: {
          data: {
            typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
            vaFacility: '983',
          },
          facilities: {
            '323': [new Facility('983')],
          },
        },
      };
      const store = createTestStore(initialState);

      // Act
      const screen = renderWithStoreAndRouter(<ScheduleCernerPageV2 />, {
        store,
      });

      // Assert - Should show legacy "How to schedule" page
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'How to schedule',
        }),
      ).to.be.ok;
      expect(
        screen.getByText(
          /To schedule an appointment online at this facility, go to/i,
        ),
      ).to.be.ok;
      expect(screen.getByRole('link', { name: /My VA Health/i })).to.be.ok;
    });
  });

  describe('when featureUseVpg is true', () => {
    it('should display "You can\'t schedule this appointment online" heading', async () => {
      // Arrange
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingUseVpg: true,
        },
        newAppointment: {
          data: {
            typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
            vaFacility: '983',
          },
          facilities: {
            '323': [new Facility('983')],
          },
        },
      };
      const store = createTestStore(initialState);

      // Act
      const screen = renderWithStoreAndRouter(<ScheduleCernerPageV2 />, {
        store,
      });

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /You can’t schedule this appointment online/i,
        }),
      ).to.be.ok;
    });

    it('should display type of care and facility name in the message', async () => {
      // Arrange
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingUseVpg: true,
        },
        newAppointment: {
          data: {
            typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
            vaFacility: '983',
          },
          facilities: {
            '323': [new Facility('983')],
          },
        },
      };
      const store = createTestStore(initialState);

      // Act
      const screen = renderWithStoreAndRouter(<ScheduleCernerPageV2 />, {
        store,
      });

      // Assert
      expect(screen.getByText(/To schedule an appointment for primary care/i))
        .to.be.ok;
      expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.be.ok;
    });

    it('should display facility phone number', async () => {
      // Arrange
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingUseVpg: true,
        },
        newAppointment: {
          data: {
            typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
            vaFacility: '983',
          },
          facilities: {
            '323': [new Facility('983')],
          },
        },
      };
      const store = createTestStore(initialState);

      // Act
      const screen = renderWithStoreAndRouter(<ScheduleCernerPageV2 />, {
        store,
      });

      // Assert - Check for phone component
      expect(screen.getByTestId('facility-telephone')).to.be.ok;
    });

    it('should navigate back when Back button is clicked', async () => {
      // Arrange
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingUseVpg: true,
        },
        newAppointment: {
          data: {
            typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
            vaFacility: '983',
          },
          facilities: {
            '323': [new Facility('983')],
          },
        },
      };
      const store = createTestStore(initialState);
      const dispatchStub = sandbox.stub(store, 'dispatch');

      // Act
      const screen = renderWithStoreAndRouter(<ScheduleCernerPageV2 />, {
        store,
      });

      const button = screen.getByRole('button', { name: /Back/i });
      userEvent.click(button);

      // Assert
      Sinon.assert.calledOnce(dispatchStub);
    });

    it('should display correct message for Pharmacy type of care', async () => {
      // Arrange
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingUseVpg: true,
        },
        newAppointment: {
          data: {
            typeOfCareId: TYPE_OF_CARE_IDS.PHARMACY_ID,
            vaFacility: '983',
          },
          facilities: {
            '160': [new Facility('983')],
          },
        },
      };
      const store = createTestStore(initialState);

      // Act
      const screen = renderWithStoreAndRouter(<ScheduleCernerPageV2 />, {
        store,
      });

      // Assert
      expect(screen.getByText(/To schedule an appointment for pharmacy/i)).to.be
        .ok;
    });

    it('should display correct message for Food and Nutrition type of care', async () => {
      // Arrange
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingUseVpg: true,
        },
        newAppointment: {
          data: {
            typeOfCareId: TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID,
            vaFacility: '983',
          },
          facilities: {
            '123': [new Facility('983')],
          },
        },
      };
      const store = createTestStore(initialState);

      // Act
      const screen = renderWithStoreAndRouter(<ScheduleCernerPageV2 />, {
        store,
      });

      // Assert
      expect(
        screen.getByText(/To schedule an appointment for nutrition and food/i),
      ).to.be.ok;
    });
  });
});
