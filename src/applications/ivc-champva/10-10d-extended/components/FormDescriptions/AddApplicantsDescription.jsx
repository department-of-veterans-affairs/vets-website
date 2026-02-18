import React from 'react';
import { APPLICANTS_MAX } from '../../utils/constants';

const AddApplicantsDescription = (
  <>
    <p>
      Next we’ll ask you for information about the applicant. The applicant is
      the person who needs the CHAMPVA benefit.
    </p>
    <p>
      We’ll ask for the applicant’s Social Security number, mailing address,
      contact information, and relationship to the Veteran.
    </p>
    <p>You can add up to {APPLICANTS_MAX} applicants.</p>
  </>
);

export default AddApplicantsDescription;
