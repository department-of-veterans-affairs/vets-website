import React from 'react';

export default function FacilityCodeAdditionalInfo() {
  return (
    <va-additional-info trigger="What to do if this name or address looks incorrect">
      <p>
        After you have verified the facility code is correctly entered, if
        either the facility name or address is incorrect, please contact your
        State Approving Agency (SAA) to have your approval updated.&nbsp;
        <va-link
          text="Go here to find your SAA’s email address"
          href="https://nasaa-vetseducation.com/nasaa-contacts/"
          external
        />
      </p>
    </va-additional-info>
  );
}
