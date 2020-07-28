import React from 'react';
import { expect } from 'chai';

import { renderWithProfileReducers } from '../unit-test-helpers';

import MilitaryInformation from '../../components/MilitaryInformation';

function createBasicInitialState() {
  return {
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: {
        get() {},
      },
      dismissedDowntimeWarnings: [],
    },
    vaProfile: {
      militaryInformation: {
        serviceHistory: {
          serviceHistory: [
            {
              branchOfService: 'Air Force',
              beginDate: '2009-04-12',
              endDate: '2013-04-11',
              personnelCategoryTypeCode: 'V',
            },
            {
              branchOfService: 'Air Force',
              beginDate: '2005-04-12',
              endDate: '2009-04-11',
              personnelCategoryTypeCode: 'A',
            },
          ],
        },
      },
    },
  };
}

describe('MilitaryInformation', () => {
  let initialState;
  let view;
  describe('when military history exists', () => {
    it('should render data for each entry of military history', () => {
      initialState = createBasicInitialState();
      // Using queries on RTL `screen` does not work for some reason. So I'm just
      // storing the entire response from `render` as `view` so I can treat `view`
      // like I would `screen`
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });
      const entries = view.queryAllByRole('listitem');

      expect(entries.length).to.equal(2);
      expect(entries[0]).to.contain.text(
        'Service branch: United States Air Force',
      );
      expect(entries[0]).to.contain.text('Dates of service: April 12, 2009');
      expect(entries[0]).to.contain.text('April 11, 2013');

      expect(entries[1]).to.contain.text(
        'Service branch: United States Air Force',
      );
      expect(entries[1]).to.contain.text('Dates of service: April 12, 2005');
      expect(entries[1]).to.contain.text('April 11, 2009');
    });
  });
  describe('when the military history is empty', () => {
    it('should show the correct error', () => {
      initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory = [];
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });

      const alert = view.getByRole('alert');

      expect(alert).to.have.class('usa-alert-warning');
      expect(alert).to.contain.text(
        'We can’t access your military information',
      );
      expect(alert).to.contain.text(
        'We’re sorry. We can’t access your military service records. If you think you should be able to view your service information here, please file a request to change or correct your DD214 or other military records.',
      );
    });
  });
  describe('when a 403 error occurs', () => {
    it('should show the correct error', () => {
      initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory = {
        error: {
          errors: [{ code: '403' }],
        },
      };

      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });

      const alert = view.getByRole('alert');

      expect(alert).to.have.class('usa-alert-warning');
      expect(alert).to.contain.text(
        'We can’t access your military information',
      );
      expect(alert).to.contain.text(
        'We’re sorry. We can’t find your Department of Defense (DoD) ID. We need this to access your military service records. Please call us',
      );
      expect(alert).to.contain.text('Find your nearest VA regional office');
      expect(alert).to.contain.text('Get instructions from our help center');
    });
  });
  describe('when another error occurs', () => {
    it('should show the correct error', () => {
      initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory = {
        error: {},
      };

      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });

      const alert = view.getByRole('alert');

      expect(alert).to.have.class('usa-alert-warning');
      expect(alert).to.contain.text(
        'We’re sorry. Something went wrong on our end. Please refresh this page or try again later.',
      );
    });
  });
});
