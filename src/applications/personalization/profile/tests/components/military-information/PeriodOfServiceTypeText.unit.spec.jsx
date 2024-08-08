import React from 'react';
import { expect } from 'chai';
import { renderWithProfileReducers } from '../../unit-test-helpers';

import MilitaryInformation from '../../../components/military-information/MilitaryInformation';

function createBasicInitialState(toggles = {}) {
  return {
    featureToggles: {
      loading: false,
      ...toggles,
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: {
        get() {},
      },
      dismissedDowntimeWarnings: [],
    },
    user: {
      profile: {
        veteranStatus: {
          status: 'OK',
        },
      },
    },
    vaProfile: {
      militaryInformation: {
        serviceHistory: {
          serviceHistory: [
            {
              branchOfService: 'Air Force',
              beginDate: '2009-04-12',
              endDate: '2013-04-11',
              periodOfServiceTypeCode: 'A',
              periodOfServiceTypeText: 'Active duty member',
              characterOfDischargeCode: 'A',
            },
            {
              branchOfService: 'Air Force',
              beginDate: '2005-04-12',
              endDate: '2009-04-11',
              periodOfServiceTypeCode: 'V',
              periodOfServiceTypeText: 'Reserve member',
              characterOfDischargeCode: 'A',
            },
          ],
        },
      },
    },
  };
}

describe('MilitaryInformation - Period of Service Type Text', () => {
  describe('when military history exists', () => {
    it('should render periodOfServiceTypeText when present and when periodOfServiceTypeCode is A or V', () => {
      const initialState = createBasicInitialState();

      const view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });

      expect(view.queryByText('Active duty member')).to.exist;

      expect(view.queryByText('Reserve member')).to.exist;
    });
  });

  describe('when military history does not exist', () => {
    it('should not render periodOfServiceTypeText', () => {
      const initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory = [];

      const view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });

      expect(view.queryByText('Active duty member')).to.not.exist;

      expect(view.queryByText('Reserve member')).to.not.exist;
    });
  });

  describe('when military history includes periodOfServiceCodes that are not supported', () => {
    it('should not render periodOfServiceTypeText of unsupported code', () => {
      const initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory.push(
        {
          branchOfService: 'Army',
          beginDate: '2008-04-12',
          endDate: '2010-06-27',
          periodOfServiceTypeCode: 'X',
          periodOfServiceTypeText: 'Unsupported member',
        },
      );

      const view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });

      expect(view.queryByText('Active duty member')).to.exist;

      expect(view.queryByText('Reserve member')).to.exist;

      expect(view.queryByText('Unsupported member')).to.not.exist;
    });
  });

  describe('when military history episode does not include a periodOfServiceCode', () => {
    it('should not render periodOfServiceTypeText, but still render history entry info', () => {
      const initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory.push(
        {
          branchOfService: 'Space Force',
          beginDate: '2008-04-12',
          endDate: '2010-06-27',
        },
      );

      const view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });

      expect(view.queryByText('Active duty member')).to.exist;

      expect(view.queryByText('Reserve member')).to.exist;

      expect(view.queryByText('Space Force')).to.not.exist;
    });
  });
});
