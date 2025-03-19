import React from 'react';
import { useSelector } from 'react-redux';

export const ViewPersonalInformation = () => {
  const firstName = useSelector(state => state.user.profile.userFullName.first);
  const lastName = useSelector(state => state.user.profile.userFullName.last);

  return (
    <div>
      <va-card background>
        <h3 className="vads-u-font-size--h4" style={{ marginTop: '1em' }}>
          Personal information
        </h3>
        <p>
          <strong>Name: </strong>
          {firstName} {lastName}
        </p>
      </va-card>
      <p>
        <strong>Note: </strong>
        To protect your personal information, we don’t allow online changes to
        your name, date of birth, or Social Security number. If you need to
        change this information, call us at 800-827-1000 (TTY:711). We’re here
        Monday through Friday, between 8:00 a.m. and 9:00 p.m. ET.
      </p>
      <a
        href="https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Find more detailed instructions for how to change your legal name (opens
        in new tab)
      </a>
    </div>
  );
};
