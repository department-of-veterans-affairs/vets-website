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
    'I’m a third-party representative or power of attorney. I’m requesting priority processing on behalf of a Veteran.',
  [PREPARER_TYPES.THIRD_PARTY_NON_VETERAN]:
    'I’m a third-party representative or power of attorney. I’m requesting priority processing on behalf of a non-Veteran with a VA claim (also called the claimant).',
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
    'The Claimant lives or sleeps overnight in a place that isn’t meant for regular sleeping. This includes a car, park, abandoned building, bus station, train station, airport, or camping ground.',
  SHELTER:
    'The Claimant lives in a shelter (including a hotel or motel) that’s meant for temporary stays.',
  FRIEND_OR_FAMILY:
    'The Claimant is staying with a friend or family member, because the Claimant can’t get my own home right now.',
  LEAVING_SHELTER:
    'In the next 30 days, the Claimant will have to leave a facility, like a homeless shelter.',
  LOSING_HOME:
    'In the next 30 days, the Claimant will lose their home. (Note: This could include a house, apartment, trailer, or other living space that you own, rent, or live in without paying rent. Or it could include a living space that they share with others. It could also include rooms in hotels or motels.)',
  OTHER_RISK: 'The Claimant has another housing risk not listed here.',
  NONE: 'None of these situations apply to the Claimant.',
});

export const ADDITIONAL_INFO_THIRD_PARTY = Object.freeze(
  <va-additional-info
    trigger="Who can sign on behalf of someone else?"
    data-testid="thirdPartyAdditionalInfo"
  >
    <div>
      <p>
        <b>If you’re a third-party representative</b> (a family member or other
        assigned person who is not a power of attorney, agent, or fiduciary)
        requesting VA records for someone else, we must have an authorization
        form on record (VA Form 21-0845) for us to release their information.
      </p>
      <p>
        <a
          href="/find-forms/about-form-21-0845/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to VA Form 21-0845 Authorization to Disclose Personal Information
          to a Third-Party (opens in new tab)
        </a>
      </p>
      <p>
        <b>If you’re a power of attorney</b> requesting VA records for someone
        else, we must have an official record that you were appointed as their
        representative (VA Form 21-22 or VA Form 21-22a).
      </p>
      <p>
        <a
          href="/find-forms/about-form-21-22/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to VA Form 21-22 Appointment of Veterans Service Organization as
          Claimant’s Representative (opens in new tab)
        </a>
      </p>
      <p>
        <a
          href="/find-forms/about-form-21-22a/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to VA Form 21-22a Appointment of Individual as Claimant’s
          Representative (opens in new tab)
        </a>
      </p>
    </div>
  </va-additional-info>,
);

export const ADDITIONAL_INFO_THIRD_PARTY_TYPE = Object.freeze(
  <va-additional-info
    trigger="Who can be a third-party representative or a power of attorney?"
    data-testid="thirdPartyTypeAdditionalInfo"
  >
    <div>
      <p>
        <b>A third-party representative</b> can be a family member or designated
        person filling out this form for a Veteran or someone with a claim. We
        consider you to be a third-party representative if you’re not already a
        power of attorney, agent, or fiduciary.
      </p>
      <p>
        If you’re a third-party representative, we must have an authorization
        (VA Form 21-0845) on record.
      </p>
      <p>
        <a
          href="/find-forms/about-form-21-0845/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to VA Form 21-0845 Authorization to Disclose Personal Information
          to a Third-Party (opens in new tab)
        </a>
      </p>
      <p>
        <b>An authorized power of attorney</b> can fill out this request for the
        person with the claim. If you’re a power of attorney, we must have one
        of these records on file:
      </p>
      <p>
        <a
          href="/find-forms/about-form-21-22/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to VA Form 21-22 Appointment of Veterans Service Organization as
          Claimant’s Representative (opens in new tab)
        </a>
      </p>
      <p>
        <a
          href="/find-forms/about-form-21-22a/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to VA Form 21-22a Appointment of Individual as Claimant’s
          Representative (opens in new tab)
        </a>
      </p>
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
        We understand that you may have other housing risks not listed here. If
        you feel comfortable sharing more about your situation, you can do that
        here. Or you can simply check this option and not include any details.
        We’ll use this information only to prioritize your request.
      </p>
      <p>
        Note: If you need help because of domestic violence, call the National
        Domestic Violence hotline 800-799-7233 (TTY: 800-787-3224) or text
        "START" to 88788. Staff are there to help 24 hours a day, 7 days a week.
        All conversations are private and confidential.
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
        here. If you feel comfortable sharing more about their situation, you
        can do that here. Or you can simply check this option and not include
        any details. We’ll use this information only to prioritize the request.
      </p>
      <p>
        Note: If the Veteran needs help because of domestic violence, call the
        National Domestic Violence hotline 800-799-7233 (TTY: 800-787-3224) or
        text "START" to 88788. Staff are there to help 24 hours a day, 7 days a
        week. All conversations are private and confidential.
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
        here. If you feel comfortable sharing more about their situation, you
        can do that here. Or you can simply check this option and not include
        any details. We’ll use this information only to prioritize the request.
      </p>
      <p>
        Note: If the claimant needs help because of domestic violence, call the
        National Domestic Violence hotline 800-799-7233 (TTY: 800-787-3224) or
        text "START" to 88788. Staff are there to help 24 hours a day, 7 days a
        week. All conversations are private and confidential.
      </p>
    </div>
  </va-additional-info>,
);

export const MAILING_ADDRESS_YES_NO_LABELS = Object.freeze({
  Y: 'Yes, I have a current mailing address.',
  N: 'No, I don’t have a current mailing address.',
});
