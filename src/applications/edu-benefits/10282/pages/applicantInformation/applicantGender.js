import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { gender } = fullSchema10282.properties;

const gaGenderInfoHelpText = () => {
  window.dataLayer.push({
    event: 'edu-10282--form-IBM-SkillsBuild-program-gender-help-text-clicked',
    'help-text-label':
      'What to know before you decide to share your gender identity',
  });
};

export const genderInfoHelpText = (
  <va-additional-info
    trigger="What to know before you decide to share your gender identity"
    class="vads-u-margin-top--2 vads-u-margin-bottom--2"
    onClick={gaGenderInfoHelpText}
  >
    <ul className="form-22-10282-container-gender-ul-description vads-u-padding-left--0">
      <li>
        Sharing your gender identity in your VA.gov profile is optional. If you
        get healthcare at VA, this information can help your care team better
        better assess your health needs and risks.
      </li>
      <li>
        But you should know that any information you share in your VA.gov
        profile goes into your VA-wide records. VA staff outside of the health
        care system may be able to read this information.
      </li>
      <li>
        We follow strict security and privacy practices to keep your personal
        information secure. But if you want to share your gender identity in
        your health records only, talk with your health care team.
      </li>
    </ul>
  </va-additional-info>
);

const uiSchema = {
  'ui:title': (
    <h3 className="vads-u-margin--0 vads-u-color--base" data-testid="gender">
      How would you describe your gender?
    </h3>
  ),
  gender: {
    'ui:title': (
      <p className="vads-u-color--gray-medium vads-u-margin-top--0 vads-u-margin-bottom--0">
        You can change your selection at any time. If you decide you no longer
        want to share your gender identity, select{' '}
        <strong>Prefer not to answer.</strong>
      </p>
    ),
    'ui:description': genderInfoHelpText,
    'ui:widget': 'radio',
  },
};

const schema = {
  type: 'object',
  properties: {
    gender,
  },
};

export { uiSchema, schema };
