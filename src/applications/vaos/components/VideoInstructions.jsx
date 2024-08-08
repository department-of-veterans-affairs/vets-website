import React from 'react';
import NewTabAnchor from './NewTabAnchor';

export default function VideoInstructions() {
  return (
    <va-additional-info
      trigger="How to setup your device"
      disableBorder="true"
      uswds
    >
      <div>
        <h4 className="vads-u-font-size--h5 vads-u-margin-top--0">
          Before your appointment:
        </h4>
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
          <li>
            To connect to your Virtual Meeting Room at the appointment time,
            click the "Join session" button on this page or the link that's in
            your confirmation email.
          </li>
        </ul>
        <h4 className="vads-u-font-size--h5">
          To have the best possible video experience, we recommend you:
        </h4>
        <ul className="vads-u-margin-bottom--0">
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
    </va-additional-info>
  );
}
