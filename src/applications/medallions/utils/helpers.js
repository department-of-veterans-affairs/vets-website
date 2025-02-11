import React from 'react';

export const applicantSaveAppText = (
  <div>We’ll save your application on every change.</div>
);
export const personalInfoSubHeader = (
  <div>
    <h4>We’ll save your application on every change.</h4>
  </div>
);

export const cardForSignedIn = (
  <va-card background>
    <p>
      <b>Personal information</b>
    </p>
    <p>
      <b>Name:</b> Bruce Wayne
    </p>
  </va-card>
);

export const applicantInfoNoteDescription = (
  <div>
    <p>
      <b>Note: </b>
      To protect your personal information, we don’t allow online changes to
      your name, date of birth, or Social Security number. If you need to change
      this information, call us at
      <va-telephone contact="8008271000" />. We’re here Monday through Friday,
      between 8:00 a.m. and 9:00 p.m. ET.
    </p>

    <div>
      <a
        href="https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/"
        target="_blank"
        rel="noreferrer"
      >
        Find more detailed instructions for how to change your legal name (opens
        in new tab)
      </a>
    </div>
  </div>
);

export const finishAppLaterLink = (
  <div>
    <a href="update-later">Finish this application later</a>
  </div>
);

export const medallionsVaRadio = (
  <div>
    <va-radio
      error={null}
      header-aria-describedby="Optional description text for screen readers"
      hint=""
      label="Your Relationship to the Veteran"
      label-header-level="3"
    >
      <p>What’s your relationship to the Veteran?</p>

      <va-radio-option label="Family Member" name="header-example" value="1" />
      <va-radio-option
        label="Personal representative"
        name="header-example"
        value="2"
      />
      <va-radio-option
        label="Representative of Veterans Service Organization (VSO)"
        name="header-example"
        value="3"
      />
      <va-radio-option
        label="Representative of a cemetery"
        name="header-example"
        value="4"
      />
      <va-radio-option
        label="I’m a representative of a funeral home"
        name="header-example"
        value="5"
      />
      <va-radio-option label="Other" name="header-example" value="6" />
    </va-radio>
  </div>
);
