import React from 'react';
import PropTypes from 'prop-types';

import NewTabAnchor from '../../../components/NewTabAnchor';

export function VideoVisitInstructions({ instructionsType }) {
  const VIDEO_VISIT_PREPARATION = 'Video Visit Preparation';
  const MEDICATION_REVIEW = 'Medication Review';

  if (instructionsType === MEDICATION_REVIEW) {
    return (
      <div>
        <h4>Medication review</h4>
        <p>
          During your video appointment, your provider will want to review all
          the medications, vitamins, herbs, and supplements you’re taking
          &mdash; no matter if you got them from another provider, VA clinic, or
          local store.
        </p>
        <p>
          Please be ready to talk about your medications during your video visit
          to ensure you're getting the best and safest care possible.
        </p>
      </div>
    );
  }
  if (instructionsType === VIDEO_VISIT_PREPARATION) {
    return (
      <div>
        <h4>Before your appointment:</h4>
        <ul>
          <li>
            If you’re using an iPad or iPhone for your appointment, you’ll need
            to download the{' '}
            <NewTabAnchor href="https://itunes.apple.com/us/app/va-video-connect/id1224250949?mt=8">
              VA Video Connect iOS app
            </NewTabAnchor>{' '}
            beforehand. If you’re using any other device, you don’t need to
            download any software or app before your appointment.
          </li>
          <li>
            You’ll need to have access to a web camera and microphone. You can
            use an external camera and microphone if your device doesn’t have
            one.
          </li>
        </ul>

        <p>
          To connect to your Virtual Meeting Room at the appointment time, click
          the "Join session" button on this page or the link that's in your
          confirmation email.
        </p>
        <h4>To have the best possible video experience, we recommend you:</h4>
        <ul>
          <li>
            Connect to your video appointment from a quiet, private, and
            well-lighted location
          </li>
          <li>
            Check to ensure you have a strong Internet connection before your
            appointment
          </li>
          <li>
            Connect to your appointment using a Wi-Fi network if using your
            mobile phone, rather than your cellular data network
          </li>
        </ul>
      </div>
    );
  }

  return null;
}

VideoVisitInstructions.propTypes = {
  instructionsType: PropTypes.string,
};
VideoVisitInstructions.defaultProps = {
  instructionsType: '',
};
