import React from 'react';
import { expect } from 'chai';

import { renderInReduxProvider as render } from '~/platform/testing/unit/react-testing-library-helpers';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';

import ReceiveAppointmentReminders, {
  ReceiveAppointmentReminders as UnconnectedReceiveAppointmentReminders,
} from '@@profile/components/personal-information/ReceiveAppointmentReminders';

describe('ReceiveAppointmentReminders', () => {
  let view;
  const initialState = {
    user: {
      profile: {
        vaPatient: true,
      },
    },
  };
  context('when its isReceivingReminders prop is true', () => {
    it('renders the correct content', () => {
      view = render(
        <UnconnectedReceiveAppointmentReminders isReceivingReminders />,
        { initialState },
      );
      expect(
        view.getByText(
          /We text VA health appointment reminders to this number. To stop getting these reminders, edit your mobile number settings/i,
        ),
      ).to.exist;
    });
  });

  context('when its isReceivingReminders prop is false', () => {
    it('renders the correct content', () => {
      view = render(<UnconnectedReceiveAppointmentReminders />, {
        initialState,
      });
      expect(
        view.getByText(
          /If you’d like to get text reminders for your VA health appointments, edit your mobile number settings/i,
        ),
      ).to.exist;
    });
  });

  context('when user does not have VA health care', () => {
    it('renders nothing at all', () => {
      initialState.user.profile.vaPatient = false;
      view = render(<ReceiveAppointmentReminders />, {
        initialState,
      });
      expect(view.container.firstChild).to.be.null;
    });
  });

  context(
    'when user has VA health care but the profileNotificationSettings feature flag is turned on',
    () => {
      it('renders nothing at all', () => {
        initialState.user.profile.vaPatient = true;
        initialState.featureToggles = {
          loading: false,
          [featureFlagNames.profileNotificationSettings]: true,
        };
        view = render(<ReceiveAppointmentReminders />, {
          initialState,
        });
        expect(view.container.firstChild).to.be.null;
      });
    },
  );
});
