import React from 'react';

const VIDEO_VISIT_PREPARATION = 'Video Visit Preparation';
const MEDICATION_REVIEW = 'Medication Review';
const videoVisitInstructionsText = `Before your appointment:

- If you’re using an iPad or iPhone for your appointment, you’ll need to download the VA Video Connect iOS app beforehand. If you’re using any other device, you don’t need to download any software or app before your appointment.
- You’ll need to have access to a web camera and microphone. You can use an external camera and microphone if your device doesn’t have one.

To connect to your Virtual Meeting Room at the appointment time, click the "Join session" button on this page or the link that's in your confirmation email.

To have the best possible video experience, we recommend you:

- Connect to your video appointment from a quiet, private, and well-lighted location
- Check to ensure you have a strong Internet connection before your appointment
- Connect to your appointment using a Wi-Fi network if using your mobile phone, rather than your cellular data network
`;

const medicationReviewText = `Medication review

During your video appointment, your provider will want to review all the medications, vitamins, herbs, and supplements you’re taking—no matter if you got them from another provider, VA clinic, or local store.

Please be ready to talk about your medications during your video visit to ensure you're getting the best and safest care possible.
`;

export function getVideoInstructionText(instructionsType) {
  if (instructionsType === MEDICATION_REVIEW) {
    return medicationReviewText;
  } else if (instructionsType === VIDEO_VISIT_PREPARATION) {
    return videoVisitInstructionsText;
  }

  return null;
}

export function VideoVisitInstructions({ instructionsType }) {
  if (instructionsType === MEDICATION_REVIEW) {
    return (
      <div>
        <strong>Medication review</strong>
        <p>
          During your video appointment, your provider will want to review all
          the medications, vitamins, herbs, and supplements you’re taking—no
          matter if you got them from another provider, VA clinic, or local
          store.
        </p>
        <p>
          Please be ready to talk about your medications during your video visit
          to ensure you're getting the best and safest care possible.
        </p>
      </div>
    );
  }

  return (
    <div>
      <strong>Before your appointment:</strong>
      <ul>
        <li>
          If you’re using an iPad or iPhone for your appointment, you’ll need to
          download the{' '}
          <a
            target="_blank"
            rel="noreferrer nofollow"
            href="https://itunes.apple.com/us/app/va-video-connect/id1224250949?mt=8"
          >
            VA Video Connect iOS app
          </a>{' '}
          beforehand. If you’re using any other device, you don’t need to
          download any software or app before your appointment.
        </li>
        <li>
          You’ll need to have access to a web camera and microphone. You can use
          an external camera and microphone if your device doesn’t have one.
        </li>
      </ul>

      <p>
        To connect to your Virtual Meeting Room at the appointment time, click
        the "Join session" button on this page or the link that's in your
        confirmation email.
      </p>

      <strong>
        To have the best possible video experience, we recommend you:
      </strong>
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
          Connect to your appointment using a Wi-Fi network if using your mobile
          phone, rather than your cellular data network
        </li>
      </ul>
    </div>
  );
}
