import React from 'react';

export const TITLE = 'Request priority processing for an existing claim';
export const SUBTITLE = 'Priority processing request (VA form 20-10207)';

export const PREPARER_TYPES = Object.freeze({
  VETERAN: 'veteran',
  NON_VETERAN: 'non-veteran',
  THIRD_PARTY_VETERAN: 'third-party-veteran',
  THIRD_PARTY_NON_VETERAN: 'third-party-non-veteran',
});
export const PREPARER_TYPE_LABELS = Object.freeze({
  [PREPARER_TYPES.VETERAN]:
    'I’m a Veteran. I’m requesting priority processing for my claim.',
  [PREPARER_TYPES.NON_VETERAN]:
    'I’m not a Veteran, but I have an existing VA claim. I’m requesting priority processing for my claim.',
  [PREPARER_TYPES.THIRD_PARTY_VETERAN]:
    'I’m requesting priority processing on behalf of a Veteran with a VA claim.',
  [PREPARER_TYPES.THIRD_PARTY_NON_VETERAN]:
    'I’m requesting priority processing on behalf of a non-Veteran with a VA claim (also called the claimant).',
});

export const THIRD_PARTY_TYPES = Object.freeze({
  REP: 'representative',
  POA: 'power-of-attorney',
});
export const THIRD_PARTY_TYPE_VETERAN_LABELS = Object.freeze({
  [THIRD_PARTY_TYPES.REP]:
    'I’m a third-party representative filling this out for the Veteran.',
  [THIRD_PARTY_TYPES.POA]:
    'I’m an authorized power of attorney for the Veteran.',
});
export const THIRD_PARTY_TYPE_NON_VETERAN_LABELS = Object.freeze({
  [THIRD_PARTY_TYPES.REP]:
    'I’m a third-party representative filling this out for the person with a claim.',
  [THIRD_PARTY_TYPES.POA]:
    'I’m an authorized power of attorney for the person with a claim.',
});

export const LIVING_SITUATIONS = Object.freeze({
  OVERNIGHT:
    'I live or sleep overnight in a place that isn’t meant for regular sleeping. This includes a car, park, abandoned building, bus station, train station, airport, or camping ground.',
  SHELTER:
    'I live in a shelter (including a hotel or motel) that’s meant for temporary stays.',
  FRIEND_OR_FAMILY:
    'I’m staying with a friend or family member, because I can’t get my own home right now.',
  LEAVING_SHELTER:
    'In the next 30 days, I will have to leave a facility, like a homeless shelter.',
  LOSING_HOME:
    'In the next 30 days, I will lose my home. (Note: This could include a house, apartment, trailer, or other living space that you own, rent, or live in without paying rent. Or it could include a living space that you share with others. It could also include rooms in hotels or motels.)',
  OTHER_RISK: 'I have another housing risk not listed here.',
  NONE: 'None of these situations apply to me.',
});
export const LIVING_SITUATIONS_3RD_PTY_VET = Object.freeze({
  OVERNIGHT:
    'The Veteran lives or sleeps overnight in a place that isn’t meant for regular sleeping. This includes a car, park, abandoned building, bus station, train station, airport, or camping ground.',
  SHELTER:
    'The Veteran lives in a shelter (including a hotel or motel) that’s meant for temporary stays.',
  FRIEND_OR_FAMILY:
    'The Veteran is staying with a friend or family member, because the Veteran can’t get my own home right now.',
  LEAVING_SHELTER:
    'In the next 30 days, the Veteran will have to leave a facility, like a homeless shelter.',
  LOSING_HOME:
    'In the next 30 days, the Veteran will lose their home. (Note: This could include a house, apartment, trailer, or other living space that you own, rent, or live in without paying rent. Or it could include a living space that they share with others. It could also include rooms in hotels or motels.)',
  OTHER_RISK: 'The Veteran has another housing risk not listed here.',
  NONE: 'None of these situations apply to the Veteran.',
});
export const LIVING_SITUATIONS_3RD_PTY_NON_VET = Object.freeze({
  OVERNIGHT:
    'The claimant lives or sleeps overnight in a place that isn’t meant for regular sleeping. This includes a car, park, abandoned building, bus station, train station, airport, or camping ground.',
  SHELTER:
    'The claimant lives in a shelter (including a hotel or motel) that’s meant for temporary stays.',
  FRIEND_OR_FAMILY:
    'The claimant is staying with a friend or family member, because the claimant can’t get their own home right now.',
  LEAVING_SHELTER:
    'In the next 30 days, the claimant will have to leave a facility, like a homeless shelter.',
  LOSING_HOME:
    'In the next 30 days, the claimant will lose their home. (Note: This could include a house, apartment, trailer, or other living space that you own, rent, or live in without paying rent. Or it could include a living space that they share with others. It could also include rooms in hotels or motels.)',
  OTHER_RISK: 'The claimant has another housing risk not listed here.',
  NONE: 'None of these situations apply to the claimant.',
});

export const ADDITIONAL_INFO_THIRD_PARTY = Object.freeze(
  <va-additional-info
    trigger="What to know if you’re signing for someone else"
    data-testid="thirdPartyAdditionalInfo"
  >
    <div>
      <p>
        We’ll need one of these forms to show that you have permission to
        receive information about the person’s claim or to sign for the person.
      </p>
      <ul className="vads-u-padding-top--2">
        <li>
          <va-link
            href="/find-forms/about-form-21-22/"
            text="VA Form 21-22 (for an accredited VSO representative)"
          />
        </li>
        <li>
          <va-link
            href="/find-forms/about-form-21-22a/"
            text="VA Form 21-22a (for an accredited attorney or claims agent)"
          />
        </li>
      </ul>
      <p className="vads-u-padding-top--2">
        If you’ve submitted 21-22 or 21-22a, we’ll refer to you as an
        “accredited representative with power of attorney.”
      </p>
    </div>
  </va-additional-info>,
);

export const ADDITIONAL_INFO_THIRD_PARTY_TYPE = Object.freeze(
  <va-additional-info
    trigger="What is an accredited representative?"
    data-testid="thirdPartyTypeAdditionalInfo"
  >
    <div>
      <p>
        An accredited representative with VA power of attorney can fill out this
        request for the person with the claim. If you’re an accredited
        representative, we must have one of these forms on record:
      </p>
      <ul className="vads-u-padding-top--2">
        <li>
          <va-link
            href="/find-forms/about-form-21-22/"
            text="VA Form 21-22 (for an accredited VSO representative)"
            external="true"
          />
        </li>
        <li>
          <va-link
            href="/find-forms/about-form-21-22a/"
            text="VA Form 21-22a (for an accredited attorney or claims agent)"
            external="true"
          />
        </li>
      </ul>
    </div>
  </va-additional-info>,
);

export const ADDITIONAL_INFO_OTHER_HOUSING_RISKS = Object.freeze(
  <va-additional-info
    trigger="What to know before sharing details about other housing risks"
    data-testid="otherHousingRisksAdditionalInfo"
  >
    <div>
      <p>
        We understand that you may have other housing risks not listed on this
        form. If you feel comfortable sharing more about the situation, you can
        do that here. But it’s not required. We’ll use this information only to
        help prioritize the request.
      </p>
      <p>
        <b>Note:</b> If you need help because of domestic violence, call the
        National Domestic Violence hotline <va-telephone contact="8007997233" />{' '}
        (TTY: <va-telephone contact="8007873224" />) or text "START" to 88788.
        Staff are there to help 24 hours a day, 7 days a week. All conversations
        are private and confidential.
      </p>
    </div>
  </va-additional-info>,
);

export const ADDITIONAL_INFO_OTHER_HOUSING_RISKS_3RD_PTY_VET = Object.freeze(
  <va-additional-info
    trigger="What to know before sharing details about other housing risks"
    data-testid="otherHousingRisksAdditionalInfo3rdPtyVet"
  >
    <div>
      <p>
        We understand that the Veteran may have other housing risks not listed
        on this form. If you feel comfortable sharing more about the situation,
        you can do that here. But it’s not required. We’ll use this information
        only to help prioritize the request.
      </p>
      <p>
        <b>Note:</b> If the Veteran needs help because of domestic violence,
        call the National Domestic Violence hotline{' '}
        <va-telephone contact="8007997233" /> (TTY:{' '}
        <va-telephone contact="8007873224" />) or text "START" to 88788. Staff
        are there to help 24 hours a day, 7 days a week. All conversations are
        private and confidential.
      </p>
    </div>
  </va-additional-info>,
);

export const ADDITIONAL_INFO_OTHER_HOUSING_RISKS_3RD_PTY_NON_VET = Object.freeze(
  <va-additional-info
    trigger="What to know before sharing details about other housing risks"
    data-testid="otherHousingRisksAdditionalInfo3rdPtyNonVet"
  >
    <div>
      <p>
        We understand that the claimant may have other housing risks not listed
        on this form. If you feel comfortable sharing more about the situation,
        you can do that here. But it’s not required. We’ll use this information
        only to help prioritize this request.
      </p>
      <p>
        <b>Note:</b> If the claimant needs help because of domestic violence,
        call the National Domestic Violence hotline{' '}
        <va-telephone contact="8007997233" /> (TTY:{' '}
        <va-telephone contact="8007873224" />) or text "START" to 88788. Staff
        are there to help 24 hours a day, 7 days a week. All conversations are
        private and confidential.
      </p>
    </div>
  </va-additional-info>,
);

export const MAILING_ADDRESS_YES_NO_LABELS = Object.freeze({
  Y: 'Yes, I have a current mailing address.',
  N: 'No, I don’t have a current mailing address.',
});

export const MAILING_ADDRESS_YES_NO_LABELS_3RD_PTY_VET = Object.freeze({
  Y: 'Yes, the Veteran has a current mailing address.',
  N: 'No, the Veteran doesn’t have a current mailing address.',
});

export const MAILING_ADDRESS_YES_NO_LABELS_3RD_PTY_NON_VET = Object.freeze({
  Y: 'Yes, the claimant has a current mailing address.',
  N: 'No, the claimant doesn’t have a current mailing address.',
});

export const OTHER_REASONS = Object.freeze({
  FINANCIAL_HARDSHIP: 'I’m experiencing extreme financial hardship.',
  ALS:
    'I have ALS (amyotrophic lateral sclerosis), also known as Lou Gehrig’s disease.',
  TERMINAL_ILLNESS: 'I have a terminal illness.',
  VSI_SI:
    'I have a status from the Defense Department of Very Seriously Injured or Ill (VSI) or Seriously Injured or Ill (SI).',
  OVER_85: 'I’m age 85 or older.',
  FORMER_POW: 'I’m a former prisoner of war (POW).',
  MEDAL_AWARD: 'I’m a Medal of Honor or Purple Heart award recipient.',
});

export const OTHER_REASONS_3RD_PTY_VET = Object.freeze({
  FINANCIAL_HARDSHIP: 'The Veteran is experiencing extreme financial hardship.',
  ALS:
    'The Veteran has ALS (amyotrophic lateral sclerosis), also known as Lou Gehrig’s disease.',
  TERMINAL_ILLNESS: 'The Veteran has a terminal illness.',
  VSI_SI:
    'The Veteran has a status from the Defense Department of Very Seriously Injured or Ill (VSI) or Seriously Injured or Ill (SI).',
  OVER_85: 'The Veteran is age 85 or older.',
  FORMER_POW: 'The Veteran is a former prisoner of war (POW).',
  MEDAL_AWARD:
    'The Veteran is a Medal of Honor or Purple Heart award recipient.',
});

export const OTHER_REASONS_3RD_PTY_NON_VET = Object.freeze({
  FINANCIAL_HARDSHIP:
    'The claimant is experiencing extreme financial hardship.',
  ALS:
    'The claimant has ALS (amyotrophic lateral sclerosis), also known as Lou Gehrig’s disease.',
  TERMINAL_ILLNESS: 'The claimant has a terminal illness.',
  VSI_SI:
    'The claimant has a status from the Defense Department of Very Seriously Injured or Ill (VSI) or Seriously Injured or Ill (SI).',
  OVER_85: 'The claimant is age 85 or older.',
  FORMER_POW: 'The claimant is a former prisoner of war (POW).',
  MEDAL_AWARD:
    'The claimant is a Medal of Honor or Purple Heart award recipient.',
});

export const FINANCIAL_HARDSHIP_DESCRIPTION = Object.freeze(
  <div>
    <p>
      You’ll need to scan your document onto the device you’re using to submit
      this application, such as your computer, tablet, or mobile phone. You can
      upload your file from there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>You can upload a .pdf, .jpeg, .jpg, or .png file</li>
      <li>Your file should be no larger than 25MB</li>
    </ul>
    <va-additional-info
      trigger="What kind of evidence can I submit?"
      data-testid="financialHardshipAdditionalInfo"
      class="vads-u-padding-bottom--4"
      uswds
    >
      <p>Submit supporting documents like these:</p>
      <ul className="vads-u-padding-top--2">
        <li>Eviction or foreclosure notice</li>
        <li>Notices of past-due utility bills</li>
        <li>Collection notices from creditors</li>
      </ul>
      <p className="vads-u-padding-top--2">
        <strong>Note:</strong>
        This isn’t a complete list. If you have other supporting documents that
        aren’t listed here, you can submit them.
      </p>
    </va-additional-info>
  </div>,
);

export const TERMINAL_ILLNESS_DESCRIPTION = Object.freeze(
  <div>
    <p>
      You’ll need to scan your document onto the device you’re using to submit
      this application, such as your computer, tablet, or mobile phone. You can
      upload your file from there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>You can upload a .pdf, .jpeg, .jpg, or .png file</li>
      <li>Your file should be no larger than 25MB</li>
    </ul>
    <va-additional-info
      trigger="What kind of evidence can I submit?"
      data-testid="terminalIllnessAdditionalInfo"
      class="vads-u-padding-bottom--4"
      uswds
    >
      <ul>
        <li className="vads-u-margin-bottom--2">
          Medical evidence showing illness that is terminal in nature
        </li>
      </ul>
      <p className="vads-u-padding-top--2">
        <strong>Note</strong>: If you want us to access your private treatment
        records, you’ll need to submit an authorization to disclose non-VA
        medical information to us (VA Forms 21-4142 and 21-4142a).
      </p>
      <p className="vads-u-padding-top--2">
        <va-link
          href="/supporting-forms-for-claims/release-information-to-va-form-21-4142/introduction"
          text="Go to VA Forms 21-4142 and 21-4142a"
          external="true"
        />
      </p>
    </va-additional-info>
  </div>,
);

export const ALS_DESCRIPTION = Object.freeze(
  <div>
    <p>
      You’ll need to scan your document onto the device you’re using to submit
      this application, such as your computer, tablet, or mobile phone. You can
      upload your file from there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>You can upload a .pdf, .jpeg, .jpg, or .png file</li>
      <li>Your file should be no larger than 25MB</li>
    </ul>
    <va-additional-info
      trigger="What kind of evidence can I submit?"
      data-testid="alsAdditionalInfo"
      class="vads-u-padding-bottom--4"
      uswds
    >
      <ul>
        <li className="vads-u-margin-bottom--2">
          Medical evidence showing an ALS diagnosis
        </li>
      </ul>
      <p className="vads-u-padding-top--2 vads-u-padding-bottom--2">
        <strong>Note</strong>: If you want us to access your private treatment
        records, you’ll need to submit an authorization to disclose non-VA
        medical information to us (VA Forms 21-4142 and 21-4142a).
      </p>
      <p>
        <va-link
          href="/supporting-forms-for-claims/release-information-to-va-form-21-4142/introduction"
          text="Go to VA Forms 21-4142 and 21-4142a"
        />
      </p>
    </va-additional-info>
  </div>,
);

export const VSI_DESCRIPTION = Object.freeze(
  <div>
    <p>
      You’ll need to scan your document onto the device you’re using to submit
      this application, such as your computer, tablet, or mobile phone. You can
      upload your file from there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>You can upload a .pdf, .jpeg, .jpg, or .png file</li>
      <li>Your file should be no larger than 25MB</li>
    </ul>
    <va-additional-info
      trigger="What kind of evidence can I submit?"
      data-testid="vsiAdditionalInfo"
      class="vads-u-padding-bottom--4"
      uswds
    >
      <ul>
        <li className="vads-u-margin-bottom--2">
          Military personnel records, such as a determination from the Defense
          Department (DOD), <strong>and</strong>
        </li>
        <li className="vads-u-margin-bottom--2">
          Medical evidence showing severe disability or injury
        </li>
      </ul>
      <p className="vads-u-padding-top--2 vads-u-padding-bottom--2">
        <strong>Note</strong>: If you want us to access your private treatment
        records, you’ll need to submit an authorization to disclose non-VA
        medical information to us (VA Forms 21-4142 and 21-4142a).
      </p>
      <p>
        <va-link
          href="/supporting-forms-for-claims/release-information-to-va-form-21-4142/introduction"
          text="Go to VA Forms 21-4142 and 21-4142a"
        />
      </p>
    </va-additional-info>
  </div>,
);

export const POW_MULTIPLE_CONFINEMENTS_LABELS = Object.freeze({
  Y: 'Yes, I was confined more than once.',
  N: 'No, I was not confined more than once.',
});

export const POW_MULTIPLE_CONFINEMENTS_LABELS_3RD_PTY_VET = Object.freeze({
  Y: 'Yes, I was confined more than once.',
  N: 'No, I was not confined more than once.',
});

export const POW_DESCRIPTION = Object.freeze(
  <div>
    <p>
      You’ll need to scan your document onto the device you’re using to submit
      this application, such as your computer, tablet, or mobile phone. You can
      upload your file from there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>You can upload a .pdf, .jpeg, .jpg, or .png file</li>
      <li>Your file should be no larger than 25MB</li>
    </ul>
    <va-additional-info
      trigger="What kind of evidence can I submit?"
      data-testid="powAdditionalInfo"
      class="vads-u-padding-bottom--4"
      uswds
    >
      <ul>
        <li className="vads-u-margin-bottom--2">
          Military personnel records such as DD214, Certificate of Release, or
          Discharge <strong>or</strong>
        </li>
        <li>
          Information such as service number, branch and dates of service, dates
          and location of internment, detaining power, or any other information
          relevant to the detainment
        </li>
      </ul>
    </va-additional-info>
  </div>,
);

export const MEDAL_AWARD_DESCRIPTION = Object.freeze(
  <div>
    <p>
      You’ll need to scan your document onto the device you’re using to submit
      this application, such as your computer, tablet, or mobile phone. You can
      upload your file from there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>You can upload a .pdf, .jpeg, .jpg, or .png file</li>
      <li>Your file should be no larger than 25MB</li>
    </ul>
    <va-additional-info
      trigger="What kind of evidence can I submit?"
      data-testid="medalAwardAdditionalInfo"
      class="vads-u-padding-bottom--4"
      uswds
    >
      <ul>
        <li className="vads-u-margin-bottom--2">
          Military personnel records such as DD214, <strong>or</strong>
        </li>
        <li>
          Information showing receipt of Medal of Honor or Purple Heart award
        </li>
      </ul>
    </va-additional-info>
  </div>,
);

export const workInProgressContent = {
  description:
    'We’re rolling out Request Priority Processing (VA Form 20-10207) in stages. It’s not quite ready yet. Please check back again soon.',
  redirectLink: '/',
  redirectText: 'Return to VA home page',
};
