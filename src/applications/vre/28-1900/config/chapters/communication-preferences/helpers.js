import React from 'react';

export const VreCommunicationInformation = (
  <section>
    <h3>How would you like us to contact you?</h3>
    <h4 className="vads-u-font-size--h5">
      VR&E has two communication options to make counseling easier:
    </h4>
    <ul>
      <li>
        Electronic-Virtual Assistant (e-VA) This option lets you schedule
        appointments, contact your counselor, and send documentation online.
        Everything is private and secure. To use e-VA, you’ll need a smartphone,
        tablet, or computer.{' '}
      </li>
      <li>
        Tele-counseling sessions through a virtual communication tool. This
        option will work on any device with a camera and microphone.
        Tele-counseling can save time and travel, and can get you better access
        to services.
      </li>
    </ul>
    <p>
      Please let us know which options work best for you and we'll call your
      email you with more details.
    </p>
  </section>
);

export const AppointmentPreferencesInformation = (
  <section>
    <p>
      Please tell us the time you prefer to meet with your counselor. We’ll make
      every effort to assign a counselor who is available to meet during your
      preferred hours.
    </p>
  </section>
);

export const validateAtLeastOneSelected = (errors, fieldData) => {
  if (!Object.values(fieldData).some(val => val === true)) {
    errors.addError('Please select at least one option');
  }
};
