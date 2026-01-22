import React, { useState, useRef } from 'react';
import { withRouter } from 'react-router';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import constants from 'vets-json-schema/dist/constants.json';
import { focusElement } from 'platform/utilities/ui';

export const isChapterFieldRequired = (formData, option) =>
  formData[`view:selectable686Options`]?.[option];

export const VerifiedAlert = (
  <div className="vads-u-margin-bottom--2">
    <va-alert status="info" visible>
      <h3 id="track-your-status-on-mobile" slot="headline">
        We’ve prefilled some of your information
      </h3>
      <p className="vads-u-margin-y--0">
        Since you’re signed in, we can prefill part of your application based on
        your profile details. You can also save your application in progress and
        come back later to finish filling it out.{' '}
      </p>
    </va-alert>
  </div>
);

export const VaFileNumberMissingAlert = (
  <>
    <h2
      slot="headline"
      className="vads-u-font-size--h3 vads-u-margin-y--0 vads-u-font-size--lg"
    >
      Your profile is missing some required information
    </h2>
    <p className="vads-u-font-size--base">
      The personal information we have on file for your is missing your VA file
      number.
    </p>
    <p className="vads-u-font-size--base">
      You’ll need to update your personal information. Call Veterans Benefits
      Assistance at <va-telephone contact={CONTACTS.VA_BENEFITS} /> between 8:00
      a.m. and 9:00 p.m. ET Monday through Friday.
    </p>
  </>
);

export const ServerErrorAlert = (
  <>
    <h2
      slot="headline"
      className="vads-u-font-size--h3 vads-u-margin-y--0 vads-u-font-size--lg"
    >
      We’re sorry. Something went wrong on our end
    </h2>
    <p className="vads-u-font-size--base">
      Refresh this page or check back later. You can also sign out of VA.gov and
      try signing back into this page.
    </p>
    <p className="vads-u-font-size--base">
      If you get this error again, call the VA.gov help desk at{' '}
      <va-telephone contact={CONTACTS.VA_311} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </>
);

export const certificateNotice = () => (
  <p className="vads-u-font-size--base">
    You’ll need to submit a copy of your marriage certificate or a church record
    of your marriage. We’ll ask you to submit this document at the end of the
    form
  </p>
);

export const CancelButton = withRouter(
  ({
    isAddChapter = false,
    dependentType = 'dependents',
    dependentButtonType,
    removePath = '/options-selection/remove-dependents',
    router,
  }) => {
    const buttonRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const closeModal = () => {
      setIsVisible(false);
      focusElement('button', {}, buttonRef.current.shadowRoot);
    };

    const cancelButtonText =
      dependentType && typeof dependentType === 'string'
        ? `Cancel ${isAddChapter ? 'adding' : 'removing'} ${dependentType}`
        : 'Cancel';

    const modalTitle = `Cancel ${
      isAddChapter ? 'adding' : 'removing'
    } ${dependentType}?`;

    const secondaryButtonText = `No, continue ${
      isAddChapter ? 'adding' : 'removing'
    } ${dependentButtonType || dependentType}`;

    return (
      <>
        <va-button
          ref={buttonRef}
          data-testid="cancel-btn"
          aria-label={cancelButtonText}
          onClick={() => setIsVisible(true)}
          secondary
          text={cancelButtonText}
        />

        <VaModal
          data-testid="cancel-modal"
          modalTitle={modalTitle}
          primaryButtonText="Yes, cancel"
          secondaryButtonText={secondaryButtonText}
          visible={isVisible}
          status="warning"
          onPrimaryButtonClick={() => {
            const route = isAddChapter
              ? '/options-selection/add-dependents'
              : removePath;
            router?.push(route);
          }}
          onSecondaryButtonClick={closeModal}
          onCloseEvent={closeModal}
          clickToClose
        >
          <p>
            If you cancel, we’ll take you back to Step 2 to update your
            selection.
          </p>
        </VaModal>
      </>
    );
  },
);

const MILITARY_STATE_VALUES = constants.militaryStates.map(
  state => state.value,
);
const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);

const STATE_VALUES = filteredStates.map(state => state.value);
const STATE_NAMES = filteredStates.map(state => state.label);
const COUNTRY_VALUES = constants.countries
  .filter(country => country.value !== 'USA')
  .map(country => country.value);

const COUNTRY_NAMES = constants.countries
  .filter(country => country.label !== 'United States')
  .map(country => country.label);

export const customLocationSchema = {
  type: 'object',
  properties: {
    outsideUsa: {
      type: 'boolean',
    },
    location: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
        },
        state: {
          type: 'string',
          enum: STATE_VALUES,
          enumNames: STATE_NAMES,
        },
        country: {
          type: 'string',
          enum: COUNTRY_VALUES,
          enumNames: COUNTRY_NAMES,
        },
      },
    },
  },
};

export const customLocationSchemaStatePostal = {
  type: 'object',
  properties: {
    outsideUsa: {
      type: 'boolean',
    },
    location: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
        },
        state: {
          type: 'string',
          enum: STATE_VALUES,
          enumNames: STATE_NAMES,
        },
        country: {
          type: 'string',
          enum: COUNTRY_VALUES,
          enumNames: COUNTRY_NAMES,
        },
        postalCode: {
          type: 'string',
          pattern: '^\\d{5}$',
        },
      },
    },
  },
};

export const generateHelpText = (text, className = 'vads-u-color--gray') => {
  return <span className={className}>{text}</span>;
};

export const generateTransition = (text, className = 'vads-u-margin-y--6') => {
  return <p className={className}>{text}</p>;
};

export const generateTitle = text => {
  return <h3 className="vads-u-margin-top--0 vads-u-color--base">{text}</h3>;
};

export const marriageEnums = ['Death', 'Divorce', 'Annulment', 'Other'];

export const spouseFormerMarriageLabels = {
  Death: 'The former spouse died',
  Divorce: 'They divorced',
  Annulment: 'They got an annulment',
  Other: 'Some other way',
};

export const veteranFormerMarriageLabels = {
  Death: 'My former spouse died',
  Divorce: 'We divorced',
  Annulment: 'We got an annulment',
  Other: 'Some other way',
};

/**
 * Returns the updateUiSchema function for income questions based on feature flag
 * When vaDependentsNetWorthAndPension is ON, hides the hint text (new pension flow)
 * When OFF, shows the hint text (current production)
 * @param {object} formData - The form data
 * @returns {object} - UI schema updates
 */
export const incomeQuestionUpdateUiSchema = formData => {
  // Only hide hint when feature flag is ON (new pension flow)
  if (formData?.vaDependentsNetWorthAndPension) {
    return {
      'ui:options': {
        hint: '',
      },
    };
  }
  // Keep original hint when flag is OFF (current production)
  return {};
};
