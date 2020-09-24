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
    user: {
      profile: {
        veteranStatus: 'OK',
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
  describe('when military branch is not set', () => {
    it('should show "Unknown" for the service branch if it is missing', () => {
      initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory[0].branchOfService = null;
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory[1].branchOfService = undefined;
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });
      const entries = view.queryAllByRole('listitem');

      expect(entries.length).to.equal(2);
      expect(entries[0]).to.contain.text('Unknown branch of service');
      expect(entries[0]).to.contain.text('Dates of service: April 12, 2009');
      expect(entries[0]).to.contain.text('April 11, 2013');

      expect(entries[1]).to.contain.text('Unknown branch of service');
      expect(entries[1]).to.contain.text('Dates of service: April 12, 2005');
      expect(entries[1]).to.contain.text('April 11, 2009');
    });
  });
  describe('when a service history date cannot be parsed', () => {
    it('should report that the date is invalid', () => {
      initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory[0].endDate =
        'not a valid date';
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });
      const entries = view.queryAllByRole('listitem');

      expect(entries.length).to.equal(2);
      expect(entries[0]).to.contain.text(
        'Service branch: United States Air Force',
      );
      expect(entries[0]).to.contain.text(
        'Dates of service: April 12, 2009 – Invalid date',
      );

      expect(entries[1]).to.contain.text(
        'Service branch: United States Air Force',
      );
      expect(entries[1]).to.contain.text('Dates of service: April 12, 2005');
      expect(entries[1]).to.contain.text('April 11, 2009');
    });
  });
  describe('when military history is missing a date', () => {
    it('should not parse a date that is an empty string', () => {
      initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory[0].endDate =
        '';
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });
      const entries = view.queryAllByRole('listitem');

      expect(entries.length).to.equal(2);
      expect(entries[0]).to.contain.text(
        'Service branch: United States Air Force',
      );
      expect(entries[0]).to.contain.text('Dates of service: April 12, 2009 – ');

      expect(entries[1]).to.contain.text(
        'Service branch: United States Air Force',
      );
      expect(entries[1]).to.contain.text('Dates of service: April 12, 2005');
      expect(entries[1]).to.contain.text('April 11, 2009');
    });
    it('should not parse a null date', () => {
      initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory[0].endDate = null;
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });
      const entries = view.queryAllByRole('listitem');

      expect(entries.length).to.equal(2);
      expect(entries[0]).to.contain.text(
        'Service branch: United States Air Force',
      );
      expect(entries[0]).to.contain.text('Dates of service: April 12, 2009 – ');

      expect(entries[1]).to.contain.text(
        'Service branch: United States Air Force',
      );
      expect(entries[1]).to.contain.text('Dates of service: April 12, 2005');
      expect(entries[1]).to.contain.text('April 11, 2009');
    });
    it('should not parse an undefined date', () => {
      initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory[0].beginDate = undefined;
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });
      const entries = view.queryAllByRole('listitem');

      expect(entries.length).to.equal(2);
      expect(entries[0]).to.contain.text(
        'Service branch: United States Air Force',
      );
      expect(entries[0]).to.contain.text('Dates of service:  – April 11, 2013');

      expect(entries[1]).to.contain.text(
        'Service branch: United States Air Force',
      );
      expect(entries[1]).to.contain.text('Dates of service: April 12, 2005');
      expect(entries[1]).to.contain.text('April 11, 2009');
    });
    it('should not parse a date if it does not exist on the service history entry', () => {
      initialState = createBasicInitialState();
      delete initialState.vaProfile.militaryInformation.serviceHistory
        .serviceHistory[0].beginDate;
      delete initialState.vaProfile.militaryInformation.serviceHistory
        .serviceHistory[0].endDate;
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });
      const entries = view.queryAllByRole('listitem');

      expect(entries.length).to.equal(2);
      expect(entries[0]).to.contain.text(
        'Service branch: United States Air Force',
      );
      expect(entries[0]).to.contain.text('Dates of service:');
      expect(entries[0]).to.not.contain.text('Invalid date');

      expect(entries[1]).to.contain.text(
        'Service branch: United States Air Force',
      );
      expect(entries[1]).to.contain.text('Dates of service: April 12, 2005');
      expect(entries[1]).to.contain.text('April 11, 2009');
    });
  });
  describe('when the veteranStatus is null and militaryInformation is empty', () => {
    it('should show the correct error', () => {
      initialState = createBasicInitialState();
      initialState.user.profile.veteranStatus = null;
      initialState.vaProfile.militaryInformation = null;
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });

      expect(view.getByText(/We don't seem to have your military records/i)).to
        .exist;
      expect(
        view.getByText(
          /We're sorry. We can't match your information to our records./i,
        ),
      ).to.exist;
    });
  });
  describe('when the military service history is empty', () => {
    it('should show the correct error', () => {
      initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory = [];
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });

      expect(view.getByText(/We can’t access your military information/i)).to
        .exist;
      expect(
        view.getByText(
          /We’re sorry. We can’t access your military service records. If you think you should be able to view your service information here, please file a request to change or correct your DD214 or other military records./i,
        ),
      ).to.exist;
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

      expect(view.getByText(/We can’t access your military information/i)).to
        .exist;
      expect(
        view.getByText(
          /We’re sorry. We can’t find your Department of Defense \(DoD\) ID. We need this to access your military service records. Please call us at/i,
        ),
      ).to.exist;
      expect(view.getByText(/Find your nearest VA regional office/i)).to.exist;
      expect(view.getByText(/Get instructions from our help center/i)).to.exist;
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

      expect(
        view.getByText(
          'We’re sorry. Something went wrong on our end. Please refresh this page or try again later.',
        ),
      ).to.exist;
    });
  });
});
