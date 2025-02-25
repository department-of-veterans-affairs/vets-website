import React from 'react';
import { useSelector } from 'react-redux';

const ApplicantInfoNoteDescription = () => {
  // Accessing the Redux state
  const firstName = useSelector(state => state.user.profile.userFullName.first);
  const lastName = useSelector(state => state.user.profile.userFullName.last);

  return (
    <div>
      <div>
        <va-card background>
          <h4>
            <b>Personal information</b>
          </h4>
          <p>
            <b>Name:</b> {firstName} {lastName}
          </p>
        </va-card>
      </div>

      <p>
        <b>Note: </b>
        To protect your personal information, we don’t allow online changes to
        your name, date of birth, or Social Security number. If you need to
        change this information, call us at{' '}
        <va-telephone contact="8008271000" />. We’re here Monday through Friday,
        between 8:00 a.m. and 9:00 p.m. ET.
      </p>

      <div>
        <a
          href="https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/"
          target="_blank"
          rel="noreferrer"
        >
          Find more detailed instructions for how to change your legal name
          (opens in new tab)
        </a>
      </div>
    </div>
  );
};

export default ApplicantInfoNoteDescription;
