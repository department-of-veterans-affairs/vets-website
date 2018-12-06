import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const privateRecordsChoiceHelp = (
  <div className="private-records-choice-help">
    <AdditionalInfo triggerText="Which should I choose?">
      <h4>You upload your medical records</h4>
      <p>
        If you upload a digital copy of all your medical records, we can review
        your claim more quickly. Uploading a digital file works best if you have
        a computer with a fast Internet connection. The digital file can be
        uploaded as a .pdf or other photo file format, like a .jpeg or .png.
      </p>
      <h4>We get your medical records for you</h4>
      <p>
        If you tell us the name of the private doctor or hospital that treated
        you for your condition, we can get your medical records for you. Getting
        your records may take us some time, and this could mean that it’ll take
        us longer to make a decision on your claim.
      </p>
    </AdditionalInfo>
  </div>
);

export const patientAcknowledgmentText = (
  <AdditionalInfo triggerText="Read the full text.">
    <h4>PATIENT AUTHORIZATION:</h4>
    <p>
      I voluntarily authorize and request disclosure (including paper, oral, and
      electronic interchange) of: All my medical records; including information
      related to my ability to perform tasks of daily living. This includes
      specific permission to release:
    </p>
    <ol>
      <li>
        All records and other information regarding my treatment,
        hospitalization, and outpatient care for my impairment(s) including, but
        not limited to:
      </li>
      <ul>
        <li>
          Psychological, psychiatric, or other mental impairment(s) excluding
          "psychotherapy notes" as defined in 45 C.F.R. §164.501,
        </li>
        <li>Drug abuse, alcoholism, or other substance abuse,</li>
        <li>Sickle cell anemia,</li>
        <li>
          Records which may indicate the presence of a communicable or
          non-communicable disease; and tests for or records of HIV/AIDS,
        </li>
        <li>Gene-related impairments (including genetic test results)</li>
      </ul>
      <li>
        Information about how my impairment(s) affects my ability to complete
        tasks and activities of daily living, and affects my ability to work.
      </li>
      <li>
        Information created within 12 months after the date this authorization
        is signed in Item 11, as well as past information.
      </li>
    </ol>
    <p>
      YOU SHOULD NOT COMPLETE THIS FORM UNLESS YOU WANT THE VA TO OBTAIN PRIVATE
      TREATMENT RECORDS ON YOUR BEHALF. IF YOU HAVE ALREADY PROVIDED THESE
      RECORDS OR INTEND TO OBTAIN THEM YOURSELF, THERE IS NO NEED TO FILL OUT
      THIS FORM. DOING SO WILL LENGTHEN YOUR CLAIM PROCESSING TIME.
    </p>
    <h4>IMPORTANT:</h4>
    <p>
      In accordance with 38 C.F.R. §3.159(c), "VA will not pay any fees charged
      by a custodian to provide records requested."
    </p>
    <h4>PATIENT ACKNOWLEDGEMENT:</h4>
    <p>
      I HEREBY AUTHORIZE the sources listed in Section IV, to release any
      information that may have been obtained in connection with a physical,
      psychological or psychiatric examination or treatment, with the
      understanding that VA will use this information in determining my
      eligibility to veterans benefits I have claimed.
    </p>
    <p>
      I understand that the source being asked to provide the Veterans Benefits
      Administration with records under this authorization may not require me to
      execute this authorization before it provides me with treatment, payment
      for health care, enrollment in a health plan, or eligibility for benefits
      provided by it.
    </p>
    <p>
      I understand that once my source sends this information to VA under this
      authorization, the information will no longer be protected by the HIPAA
      Privacy Rule, but will be protected by the Federal Privacy Act, 5 USC
      552a, and VA may disclose this information as authorized by law.
    </p>
    <p>
      I also understand that I may revoke this authorization in writing, at any
      time except to the extent a source of information has already relied on it
      to take an action. To revoke, I must send a written statement to the VA
      Regional Office handling my claim or the Board of Veterans' Appeals (if my
      claim is related to an appeal) and also send a copy directly to any of my
      sources that I no longer wish to disclose information about me.
    </p>
    <p>
      I understand that VA may use information disclosed prior to revocation to
      decide my claim.
    </p>
    <p>
      NOTE: For additional information regarding VA Form 21-4142, refer to the
      following website:
      <a href="https://www.benefits.va.gov/privateproviders/" target="_blank">
        https://www.benefits.va.gov/privateproviders/
      </a>
      .
    </p>
  </AdditionalInfo>
);
