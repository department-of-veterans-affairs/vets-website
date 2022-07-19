/* eslint-disable deprecate/import */
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import React from 'react';

import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

const { sigiIsAmericanIndian } = fullSchemaHca.properties;

const Description = props => {
  return (
    <>
      <PrefillMessage {...props} />

      <p>
        If you’re recognized as an American Indian or Alaska Native, you may not
        need to pay a copay for care or services.
      </p>

      <div className="vads-u-margin-top--3 vads-u-margin-bottom--7">
        <AdditionalInfo triggerText="What it means to be recognized as an American Indian or Alaska Native">
          <div>
            For the purposes of this application, we consider this to mean that
            one of these descriptions is true for you:
            <ul>
              <li>
                You’re a member of a Federally recognized Indian tribe,
                <strong className="vads-u-margin-left--0p25"> or</strong>
              </li>
              <li>
                The Secretary of the Interior considers you to be an Indian for
                any purpose,
                <strong className="vads-u-margin-left--0p25"> or</strong>
              </li>
              <li>
                You’re eligible for Indian Health Service (including as a
                California Indian, Eskimo, Aleut, or another Alaska Native)
              </li>
            </ul>
          </div>

          <strong className="vads-u-margin-bottom--2 vads-u-display--block">
            Or
          </strong>

          <div>
            You live in an urban area and you meet at least one of these
            requirements:
            <ul>
              <li>
                You’re a member or the first- or second-degree descendant of a
                tribe, band, or other organized group of Indians (including a
                tribe, band, or group terminated a"er 1940 or one that’s
                recognized by the state where you live),
                <strong className="vads-u-margin-left--0p25"> or</strong>
              </li>

              <li>
                You’re an Eskimo, Aleut, or another Alaska Native,
                <strong className="vads-u-margin-left--0p25"> or</strong>
              </li>
              <li>
                The Secretary of the Interior considers you to be an Indian for
                any purpose,
                <strong className="vads-u-margin-left--0p25"> or</strong>
              </li>
              <li>
                An official regulation from the Secretary of Health and Human
                Services considers you an Indian for any purpose
              </li>
            </ul>
          </div>

          <p>
            We’ve based these descriptions on the Indian Health Care Improvement
            Act (IHCIA), U.S.C. regulations 1603(13) and 1603(28).
          </p>

          <a
            href="https://www.ihs.gov/ihcia/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about the IHCIA on the Indian Health Service website
          </a>
        </AdditionalInfo>
      </div>
    </>
  );
};

export default {
  uiSchema: {
    'ui:description': Description,
    sigiIsAmericanIndian: {
      'ui:title':
        'Are you recognized as an American Indian or Alaska Native by any tribal, state, or federal law or regulation?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['sigiIsAmericanIndian'],
    properties: {
      sigiIsAmericanIndian,
    },
  },
};
