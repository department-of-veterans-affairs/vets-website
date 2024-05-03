import React from 'react';
import { expect } from 'chai';

import { renderWithProfileReducers } from '../unit-test-helpers';

import { Toggler } from '~/platform/utilities/feature-toggles';
import MilitaryInformation from '../../components/military-information/MilitaryInformation';

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
              personnelCategoryTypeCode: 'V',
              characterOfDischargeCode: 'A',
            },
            {
              branchOfService: 'Air Force',
              beginDate: '2005-04-12',
              endDate: '2009-04-11',
              personnelCategoryTypeCode: 'A',
              characterOfDischargeCode: 'A',
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
  describe('when proof of veteran status exists', () => {
    it('should show proof of veteran status component if toggle is on', () => {
      initialState = createBasicInitialState({
        [Toggler.TOGGLE_NAMES.profileShowProofOfVeteranStatus]: true,
      });
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });
      expect(view.getByText(/Proof of Veteran status/)).to.exist;
    });
    it('should not show proof of veteran status component if toggle is off', () => {
      initialState = createBasicInitialState({
        [Toggler.TOGGLE_NAMES.profileShowProofOfVeteranStatus]: false,
      });
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });
      expect(view.queryByText(/Proof of Veteran status/)).not.to.exist;
    });
  });

  describe('when the veteranStatus is null and militaryInformation is empty', () => {
    it('should show the correct error', () => {
      initialState = createBasicInitialState();
      initialState.user.profile.veteranStatus.status = null;
      initialState.vaProfile.militaryInformation = null;
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });

      expect(view.getByTestId('not-a-veteran-alert')).to.exist;
      expect(view.getByText(/If you think this is an error, call us at/i)).to
        .exist;
    });
  });
  describe('when the military service history is empty', () => {
    it('should show the correct error', () => {
      initialState = createBasicInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory = [];
      view = renderWithProfileReducers(<MilitaryInformation />, {
        initialState,
      });

      expect(
        view.getByText(
          /We can’t match your information to any military service records/i,
        ),
      ).to.exist;
      expect(view.getByText(/We’re sorry for this issue./i)).to.exist;
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

      view.getByText(
        /We can’t match your information to any military service records/i,
      );
      view.getByText(/We’re sorry for this issue/i);
      view.getByText(
        /If you want to learn what military service records may be on file for you/i,
      );

      // should render contact telephone link for DMDC
      expect(
        view.container.querySelector('va-telephone').getAttribute('contact'),
      ).to.equal('8005389552');

      // should render link to National Archives website to correct service records
      expect(
        view.container.querySelector('va-link').getAttribute('text'),
      ).to.equal(
        'Learn how to correct your military service records on the National Archives website',
      );

      expect(
        view.container.querySelector('va-link').getAttribute('href'),
      ).to.equal(
        'https://www.archives.gov/veterans/military-service-records/correct-service-records.html',
      );
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

      expect(view.getByTestId('service-is-down-banner')).to.exist;
    });
  });
});
