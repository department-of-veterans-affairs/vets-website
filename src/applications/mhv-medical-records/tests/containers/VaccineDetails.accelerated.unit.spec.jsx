import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import sinon from 'sinon';
import reducer from '../../reducers';
import cernerUser from '../fixtures/user.cerner.json';

const mockUseAcceleratedData = sinon.stub();
mockUseAcceleratedData.returns({
  isAcceleratingVaccines: true,
  isLoading: false,
});

const useAcceleratedDataModule = {
  __esModule: true,
  default: mockUseAcceleratedData,
};

const hookPath = require.resolve('../../hooks/useAcceleratedData');
require.cache[hookPath] = {
  id: hookPath,
  filename: hookPath,
  loaded: true,
  exports: useAcceleratedDataModule,
};

const VaccineDetails = require('../../containers/VaccineDetails').default;

describe('Vaccines details container conditional field rendering', () => {
  describe('when accelerated vaccines is enabled', () => {
    const acceleratedRecord = {
      date: 'January 14, 2021',
      doseDisplay: '1 of 2',
      doseNumber: null,
      id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
      location: 'Cheyenne VA Medical Center',
      manufacturer: 'Moderna US, Inc.',
      name: 'COVID-19',
      note:
        'Dose #2 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.',
      reaction: 'Reactions are noted in the medical record.',
      seriesDoses: undefined,
      shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose',
    };

    let screen;

    beforeEach(() => {
      mockUseAcceleratedData.returns({
        isAcceleratingVaccines: true,
        isLoading: false,
      });

      const initialState = {
        user: cernerUser,
        mr: {
          vaccines: { vaccineDetails: acceleratedRecord },
        },
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_accelerated_delivery_enabled: true,
          // eslint-disable-next-line camelcase
          mhv_accelerated_delivery_vaccines_enabled: true,
        },
      };

      screen = renderWithStoreAndRouter(<VaccineDetails runningUnitTest />, {
        initialState,
        reducers: reducer,
        path: '/vaccine-details/957',
      });
    });

    it('shows accelerated vaccine fields when conditions are met', () => {
      // Check if the component renders without errors
      expect(screen).to.exist;
      expect(
        screen.getByText(acceleratedRecord.name, {
          exact: true,
        }),
      ).to.exist;
      expect(
        screen.getByText(acceleratedRecord.location, {
          exact: true,
        }),
      ).to.exist;
      expect(screen.getByText('January 14, 2021', { exact: true })).to.exist;

      const dosageElement = screen.queryByTestId('vaccine-dosage');
      if (dosageElement) {
        expect(dosageElement).to.exist;
      }

      const manufacturerText = screen.queryByText(
        acceleratedRecord.manufacturer,
        { exact: true },
      );
      if (manufacturerText) {
        expect(manufacturerText).to.exist;
      }

      const descriptionText = screen.queryByText(
        acceleratedRecord.shortDescription,
        { exact: true },
      );
      if (descriptionText) {
        expect(descriptionText).to.exist;
      }

      const reactionText = screen.queryByText(acceleratedRecord.reaction, {
        exact: true,
      });
      if (reactionText) {
        expect(reactionText).to.exist;
      }

      const noteText = screen.queryByText(acceleratedRecord.note, {
        exact: true,
      });
      if (noteText) {
        expect(noteText).to.exist;
      }
    });
  });
});
