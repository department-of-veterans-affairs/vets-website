import React from 'react';
import PropTypes from 'prop-types';

import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

/**
 * Housing risk page
 */
export const housingRiskTitle =
  'Are you experiencing homelessness or at risk of becoming homeless?';

/**
 * Living situation page
 */
export const livingSituationTitle =
  'Which of these statements best describes your living situation?';

export const livingSituationChoices = {
  notRegular:
    'I live or sleep overnight in a place that isn’t meant for regular sleeping. This includes a car, park, abandoned building, bus station, train station, airport, or camping ground.',
  shelter:
    'I live in a shelter (including a hotel or motel) that’s meant for temporary stays.',
  friendOrFamily:
    'I’m staying with a friend or family member, because I can’t get my own home right now.',
  facility30Days:
    'In the next 30 days, I will have to leave a facility, like a homeless shelter.',
  home30Days:
    'In the next 30 days, I will lose my home. (Note: This could include a house, apartment, trailer, or other living space that you own, rent, or live in without paying rent. Or it could include a living space that you share with others. It could also include rooms in hotels or motels.)',
  other: 'I have another housing risk not listed here.',
  none: 'None of these situations apply to me.',
};

// Shortened to show on review & submit page within a list
export const livingSituationChoicesShortened = {
  notRegular:
    'I live or sleep overnight in a place that isn’t meant for regular sleeping',
  shelter: 'I live in a shelter',
  friendOrFamily: 'I’m staying with a friend or family member',
  facility30Days: 'I will have to leave a facility in the next 30 days',
  home30Days: 'I will lose my home in the next 30 days',
  other: 'I have another housing risk not listed here',
  none: 'None of these situations apply to me',
};

export const livingSituationError =
  'If none of these situations apply to you, unselect the other options you selected';

export const livingSituationReviewField = ({ formData }) => {
  const selected = Object.entries(formData).filter(([_key, value]) => value);
  // Show full living situation choice label if only one is selected
  const choices =
    selected.length === 1
      ? livingSituationChoices
      : livingSituationChoicesShortened;
  const list = readableList(selected.map(([key]) => choices[key]));

  return (
    <div className="review-row">
      <dt>{livingSituationTitle}</dt>
      <dd
        className="dd-privacy-hidden"
        data-dd-action-name="Areas of disagreement"
      >
        {list}
      </dd>
    </div>
  );
};

livingSituationReviewField.propTypes = {
  defaultEditButton: PropTypes.any,
  formData: PropTypes.shape({}),
};

/**
 * Domestic violence shared info
 */
export const domesticViolenceInfo = (
  <va-additional-info
    trigger="Are you experiencing domestic violence?"
    class="vads-u-margin-bottom--4"
  >
    If you need help because of domestic violence, call the National Domestic
    Violence hotline <va-telephone contact="8007997233" /> (
    <va-telephone contact="8007873224" tty />) or text "START" to 88788. Staff
    are there to help 24 hours a day, 7 days a week. All conversations are
    private and confidential.
  </va-additional-info>
);

/**
 * Other housing risks page
 */
export const OtherHousingRisksTitle = (
  <>
    <h3>Other housing risks</h3>
    <p>
      We understand that you may have other housing risks. If you feel
      comfortable sharing more about your situation, you can do that here. Or
      you can simply not include any details. We’ll use this information only to
      prioritize your request.
    </p>
  </>
);

export const otherHousingRisksLabel =
  'Tell us about other housing risks you’re experiencing.';

/**
 * Point of contact page
 */
export const pointOfContactTitle = (
  <>
    <h3>Your point of contact</h3>
    <p>
      To help us process your request, it helps us to be able to get in touch
      with you. Please provide the name and telephone number of someone who can
      help us locate you.
    </p>
  </>
);

export const pointOfContactNameLabel = 'Name of your point of contact';
export const pointOfContactPhoneLabel =
  'Telephone number of your point of contact';
