import React from 'react';

export const evidenceDictionary = {
  '21-4142/21-4142a': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we need your permission to request your
          personal information from a non-VA source, like a private doctor or
          hospital.
        </p>
        <p>Personal information may include:</p>
        <ul className="bullet-disc">
          <li>Medical treatments</li>
          <li>Hospitalizations</li>
          <li>Psychotherapy</li>
          <li>Outpatient care</li>
        </ul>
      </>
    ),
    nextSteps: (
      <>
        <p>
          Use VA Form 21-4142 to give us permission to request your personal
          information.
        </p>
        <p>
          You can complete and sign this form online, or use a PDF version and
          upload or mail it.
          <br />
          <va-link
            active
            data-testid="VA Form 21-4142"
            text="VA Form 21-4142"
            href="/find-forms/about-form-21-4142/"
          />
        </p>
      </>
    ),
  },
  'Employment info needed': {
    longDescription: (
      <p>
        For your benefits claim, we need employment information from your most
        recent employer.
      </p>
    ),
    nextSteps: (
      <>
        <p>
          Give VA Form 21-4192 to your most recent employer and ask them to mail
          us your employment information.
          <br />
          <va-link
            active
            text="VA Form 21-4192"
            data-testid="VA Form 21-4192"
            href="/find-forms/about-form-21-4192/"
          />
        </p>
      </>
    ),
    isProperNoun: false,
  },
  'EFT - Treasury Mandate Notification': {
    longDescription: (
      <p>
        For your benefits claim, we need your direct deposit information in
        order to pay benefits, if awarded.
      </p>
    ),
    nextSteps: (
      <>
        <p>
          You can update your direct deposit information in your VA.gov profile,
          by phone, or by mail.
          <br />
          <va-link
            active
            text="Add or change direct deposit information"
            data-testid="Add or change direct deposit information"
            href="/profile/direct-deposit"
          />
        </p>

        <p>
          If you don’t already have a bank account, the Veterans Benefits
          Banking Program (VBBP) can connect you with a bank that will help you
          set up an account.
          <a
            className="external-active-link vads-u-margin-top--0"
            rel="noopener noreferrer"
            target="_blank"
            data-testid="Set up a bank account through VBBP (opens in new tab)"
            href="https://veteransbenefitsbanking.org/"
          >
            Set up a bank account through VBBP (opens in new tab)
            <va-icon
              icon="chevron_right"
              class="active-link-icon"
              size={2}
              aria-hidden="true"
            />
          </a>
        </p>
      </>
    ),
    isProperNoun: false,
  },
  'RV1 - Reserve Records Request': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested your service records or
          treatment records from your reserve unit.
        </p>
        <p>Your records may be used to verify:</p>
        <ul className="bullet-disc">
          <li>Your service</li>
          <li>An event in your service</li>
          <li>Treatment received during your service</li>
        </ul>
      </>
    ),
  },
  'DBQ AUDIO Hearing Loss and Tinnitus': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested a disability exam for your
          hearing. The examiner’s office will contact you to schedule this
          appointment.
        </p>
      </>
    ),
    noActionNeeded: true,
    isDBQ: true,
  },
  'DBQ PSYCH Mental Disorders': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested a mental health exam. The
          examiner’s office will contact you to schedule this appointment.
        </p>
      </>
    ),
    noActionNeeded: true,
    isDBQ: true,
  },
  'Proof of service (DD214, etc.)': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested all your DD Form 214's or
          other separation papers for all your periods of military service.
        </p>
        <p>
          You can also{' '}
          <va-link
            text="request your military service records"
            href="/records/get-military-service-records/"
          />{' '}
          yourself from the National Archives.
        </p>
      </>
    ),
  },
  'PMR Pending': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested your non-VA medical records
          from your medical provider.
        </p>
        <p>Your health records may include:</p>
        <ul className="bullet-disc">
          <li>Treatment records</li>
          <li>Hospital summaries</li>
          <li>Findings or diagnoses</li>
        </ul>
        <p>
          We limited our request based on any restrictions you listed on your
          Authorization to Disclose Information (VA Form 21-4142).
        </p>
      </>
    ),
  },
  'Employer (21-4192)': {
    longDescription: (
      <p>
        For your benefits claim, we sent a letter to your last employer to ask
        about your job and why you left. This information will help us
        understand if you left your job because of a service-connected
        disability.
      </p>
    ),
    noActionNeeded: true,
  },
  'General Records Request (Medical)': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested your non-VA medical records
          from your medical provider.
        </p>
        <p>Your health records may include:</p>
        <ul className="bullet-disc">
          <li>Treatment records</li>
          <li>Hospital summaries</li>
          <li>Findings or diagnoses</li>
        </ul>
      </>
    ),
  },
  'Unemployability - 21-8940 needed and 4192(s) requested': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we need more information about how your
          service-connected disabilities prevent you from working.
        </p>
        <p>
          We also need information from your most recent employer to tell us
          what your role was and the reasons why your employment ended.
        </p>
      </>
    ),
    nextSteps: (
      <>
        <p>
          Use <strong>VA Form 21-8940</strong> to let us know what
          service-connected disabilities prevent you from working. You can
          complete and sign this form online, or use a PDF version and upload or
          mail it.
          <br />
          <va-link
            active
            data-testid="VA Form 21-8940"
            text="VA Form 21-8940"
            href="/find-forms/about-form-21-8940/"
          />
        </p>
        <p>
          Give <strong>VA Form 21-4192</strong> to your most recent employer and
          ask them to mail us your employment information.
          <br />
          <va-link
            active
            data-testid="VA Form 21-4192"
            text="VA Form 21-4192"
            href="/find-forms/about-form-21-4192/"
          />
        </p>
      </>
    ),
    isProperNoun: false,
  },
  'Request Service Treatment Records from Veteran': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we need certified copies of your service
          treatment records if you have them. Uploading your copies may speed up
          the claim review process.
        </p>
        <p>
          In case you don’t have them, we also requested your service treatment
          records from the Department of Defense, reserve unit, or national
          guard unit. You don’t need to request your service treatment records
          yourself.
        </p>
        <p>
          Once we have your service treatment records we can schedule an exam.
        </p>
      </>
    ),
    nextSteps: (
      <>
        <p>
          Upload certified copies of your service treatment records, if you have
          them. This can help speed up the claim review process.
        </p>
        <p>
          If you don’t have certified copies of your service treatment records,
          no action is needed. We are requesting them for you.
        </p>
      </>
    ),
    isProperNoun: false,
  },
  '21-4142 incomplete - need provider address': {
    longDescription: (
      <>
        <p>
          We need your non-VA medical provider’s address to request information
          for your claim. Your Authorization and Consent to Release Information
          to the VA did not include an address or it included a wrong address.
        </p>
        <p>Your claim letter includes the provider address that we need.</p>
      </>
    ),
    nextSteps: (
      <>
        <p>
          Use VA Form 21-4142a to provide the address of your non-VA medical
          provider.
        </p>
        <p>
          You can complete this form online, or use a PDF version and upload or
          mail it.
          <br />
          <va-link
            active
            data-testid="VA Form 21-4142a"
            text="VA Form 21-4142a"
            href="/find-forms/about-form-21-4142a/"
          />
        </p>
      </>
    ),
    isProperNoun: false,
  },
  'Submit buddy statement(s)': {
    longDescription: (
      <>
        <p>
          For your disability benefits claim, we need statements from people who
          know about your condition. These are often called “buddy statements.”
        </p>
        <p>These people should:</p>
        <ul className="bullet-disc">
          <li>Describe what they saw or know about your condition</li>
          <li>
            Include when and where they observed it, and what was happening at
            the time
          </li>
          <li>
            Say clearly if they witnessed the event that caused your condition
          </li>
          <li>
            If they served with you, include their name, rank, and unit at the
            time
          </li>
        </ul>
        <p>
          Each person must include the following sentence at the end of their
          statement:
        </p>
        <p>
          “I hereby certify that this information is true and correct to the
          best of my knowledge and belief.”
        </p>
      </>
    ),
    nextSteps: (
      <>
        <p>
          Use VA Form 21-10210 to submit a Lay/Witness Statement (also known as
          “buddy statements”) from someone who knows about your condition and
          can support your claim.
        </p>
        <p>
          You can submit the completed form online, or you can upload or mail
          it.
          <br />
          <va-link
            active
            data-testid="VA Form 21-10210"
            text="VA Form 21-10210"
            href="/find-forms/about-form-21-10210/"
          />
        </p>
      </>
    ),
    isProperNoun: false,
  },
  'ASB - tell us where, when, how exposed': {
    longDescription: (
      <>
        <p>
          To process your disability claim for asbestos exposure, we need a bit
          more information from you.
        </p>
        <p>Please answer the following questions:</p>
        <ol>
          <li>
            Where were you exposed to asbestos? (Include your unit, rank, and
            location if you remember.)
          </li>
          <li>When did the exposure happen?</li>
          <li>How did the exposure happen?</li>
          <li>
            Were any other service members with you? (Please share their names
            if you can.)
          </li>
          <li>
            Were you exposed to anything else that may cause cancer (like
            cigarettes or chemicals) during or after your service?
          </li>
          <li>
            What jobs did you have before and after your military service? How
            long did you work at each one?
          </li>
        </ol>
      </>
    ),
    nextSteps: (
      <>
        <p>
          Use Statement in Support of Claim (VA Form 21-4138) to answer the
          questions listed under <strong>What we need from you</strong>.
        </p>
        <p>
          After completing and signing the form, you can upload or mail it.
          <br />
          <va-link
            active
            data-testid="VA Form 21-4138"
            text="VA Form 21-4138"
            href="/find-forms/about-form-21-4138/"
          />
        </p>
      </>
    ),
    isSensitive: true,
  },
  'ASB-tell us specific disability fm asbestos exposure': {
    longDescription: (
      <>
        <p>
          To process your disability claim for asbestos exposure, we need
          information about your asbestos-related disease or disability:
        </p>
        <ol>
          <li>
            The specific disease or disability caused by asbestos exposure
          </li>
          <li>Why you believe asbestos caused your disease or disability</li>
          <li>
            Evidence of this connection, like a medical opinion from your doctor
          </li>
        </ol>
      </>
    ),
    nextSteps: (
      <>
        <p>
          Use Statement in Support of Claim (VA Form 21-4138) to answer the
          questions listed under <strong>What we need from you</strong>.
        </p>
        <p>
          After completing and signing the form, you can upload or mail it.
          <br />
          <va-link
            active
            data-testid="VA Form 21-4138"
            text="VA Form 21-4138"
            href="/find-forms/about-form-21-4138/"
          />
        </p>
      </>
    ),
    isSensitive: true,
  },
  'HAIMS STR Request': {
    longDescription: (
      <p>
        For your benefits claim, we’ve requested your service treatment records
        from the Department of Defense.
      </p>
    ),
    isProperNoun: false,
    noActionNeeded: true,
  },
  'Name of disability needed': {
    longDescription: (
      <>
        <p>
          To review your claim, we need to know what your disability is and how
          it’s connected to your military service.
        </p>
        <p>Examples include:</p>
        <ul className="bullet-disc">
          <li>Hearing loss from operating heavy equipment</li>
          <li>Knee injury from a service-related accident</li>
          <li>
            Post-traumatic stress disorder (PTSD) from exposure to traumatic
            events during service
          </li>
        </ul>
        <p>
          If you have more than one disability, list each one in your claim.
        </p>
      </>
    ),
    nextSteps: (
      <>
        <p>
          Use VA Form 21-526EZ to provide the name of your disability and how
          it’s connected to your military service.
        </p>

        <p>
          You can complete and sign this form online, or use a PDF version and
          upload or mail it.
          <br />
          <va-link
            active
            text="VA Form 21-526EZ"
            data-testid="VA Form 21-526EZ"
            href="/find-forms/about-form-21-526ez/"
          />
        </p>
        <p>
          Or, you can call the VA benefits hotline at{' '}
          <va-telephone contact="8008271000" /> (
          <va-telephone contact="711" tty="true" />) to give us the name of your
          disability.
        </p>
      </>
    ),
    isProperNoun: false,
  },
  'DBQ RESP Sleep Apnea': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested an exam to learn more about
          your sleep apnea. The examiner’s office will contact you to schedule
          this appointment.
        </p>
      </>
    ),
    noActionNeeded: true,
    isProperNoun: false,
    isDBQ: true,
  },
  'DBQ MUSC Back (thoracolumbar spine)': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested an exam to understand your
          back condition. The examiner’s office will contact you to schedule
          this appointment.
        </p>
      </>
    ),
    noActionNeeded: true,
    isProperNoun: false,
    isDBQ: true,
  },
  'DBQ MUSC Knee and Lower Leg': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested an exam for your knee and
          lower leg. The examiner’s office will contact you to schedule this
          appointment.
        </p>
      </>
    ),
    noActionNeeded: true,
    isProperNoun: false,
    isDBQ: true,
  },
  'DBQ NEURO Headaches (including migraines)': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested an exam for your headaches
          (including migraines). The examiner’s office will contact you to
          schedule this appointment.
        </p>
      </>
    ),
    noActionNeeded: true,
    isProperNoun: false,
    isDBQ: true,
  },
  '21-4142': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we need your permission to request your
          personal information from a non-VA source, like a private doctor or
          hospital.
        </p>
        <p>Personal information may include:</p>
        <ul className="bullet-disc">
          <li>Medical treatments</li>
          <li>Hospitalizations</li>
          <li>Psychotherapy</li>
          <li>Outpatient care</li>
        </ul>
        <p>
          Even if you already submitted VA Form 21-4142a, we may still need the
          separate VA Form 21-4142 in order to request your personal
          information.
        </p>
      </>
    ),
    nextSteps: (
      <>
        <p>
          Use VA Form 21-4142 to give us permission to request your personal
          information.
        </p>
        <p>
          You can complete and sign this form online, or use a PDF version and
          upload or mail it.
          <br />
          <va-link
            active
            data-testid="VA Form 21-4142"
            text="VA Form 21-4142"
            href="/find-forms/about-form-21-4142/"
          />
        </p>
      </>
    ),
  },
  '21-4142a': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we need information about where you received
          treatment so we can request your medical records from non-VA medical
          providers.
        </p>
        <p>This helps us collect:</p>
        <ul className="bullet-disc">
          <li>Facility names and addresses</li>
          <li>Dates of medical treatments</li>
        </ul>
      </>
    ),
    nextSteps: (
      <>
        <p>
          Use VA Form 21-4142a to give us permission to request your medical
          treatment records from non-VA medical providers.
        </p>
        <p>
          You can complete and sign this form online, or use a PDF version and
          upload or mail it.
          <br />
          <va-link
            active
            data-testid="VA Form 21-4142a"
            text="VA Form 21-4142a"
            href="/find-forms/about-form-21-4142a/"
          />
        </p>
      </>
    ),
  },
  'DBQ PSYCH PTSD initial': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested an exam related to your PTSD.
          The examiner’s office will contact you to schedule this appointment.
        </p>
      </>
    ),
    noActionNeeded: true,
    isProperNoun: true,
    isDBQ: true,
  },
  'SSA medical evidence requested': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve asked the Social Security
          Administration (SSA) for your medical records. This helps us
          understand your condition and how it might relate to your claim.
        </p>
        <p>It may take several months to receive a response from the SSA.</p>
      </>
    ),
    noActionNeeded: true,
    isProperNoun: false,
  },
  'DBQ PSYCH PTSD Review': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested a follow-up exam related to
          your PTSD. The examiner’s office will contact you to schedule this
          appointment.
        </p>
      </>
    ),
    noActionNeeded: true,
    isProperNoun: true,
    isDBQ: true,
  },
  'Clarification of Claimed Issue': {
    longDescription: (
      <>
        <p>
          We need more information or a medical diagnosis for the condition in
          your benefits claim.
        </p>
        <p>
          For example, if you listed a leg condition, we’d need to know if it
          affects your hip, knee, ankle, or foot—or if it’s related to nerves or
          your skin.
        </p>
      </>
    ),
    nextSteps: (
      <>
        <p>
          You can upload a document that gives more detail about your condition,
          or use VA Form 21-4138, Statement in Support of Claim.
          <br />
          <va-link
            active
            data-testid="VA Form 21-4138"
            text="VA Form 21-4138"
            href="/find-forms/about-form-21-4138/"
          />
        </p>
        <p>
          Make sure your name and Social Security number are included on every
          page of any document you upload.
        </p>
      </>
    ),
    isProperNoun: false,
    noProvidePrefix: true,
  },
  'DBQ GU Male Reproductive Organ': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested an exam to understand the
          condition affecting your reproductive health. The examiner’s office
          will contact you to schedule this appointment.
        </p>
      </>
    ),
    noActionNeeded: true,
    isProperNoun: false,
    isDBQ: true,
  },
  'ASB-medical evid of disease (biopsy) needed': {
    longDescription: (
      <>
        <p>
          To review your claim for asbestos exposure, we need medical
          documentation that supports your claim.
        </p>
        <p>This could include:</p>
        <ul className="bullet-disc">
          <li>Diagnosis</li>
          <li>Biopsy</li>
          <li>Other related medical records</li>
        </ul>
      </>
    ),
    nextSteps: (
      <>
        <p>
          If the biopsy or other exam was done at a VA facility, upload a
          document that includes the location and the month and year of the
          exam. We’ll request your medical records for you.
        </p>
        <p>
          If that exam was done by a non-VA provider, use VA Form 21-4142 to
          authorize VA to request your medical records.
          <br />
          <va-link
            active
            data-testid="VA Form 21-4142"
            text="VA Form 21-4142"
            href="/find-forms/about-form-21-4142/"
          />
        </p>
      </>
    ),
    isSensitive: true,
  },
  'NG1 - National Guard Records Request': {
    longDescription: (
      <p>
        For your benefits claim, we’ve asked your National Guard unit for your
        service treatment records. These records help us understand when your
        medical condition may have started during your military service.
      </p>
    ),
    noActionNeeded: true,
    isProperNoun: true,
  },
};
