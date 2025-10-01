import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaAccordion,
  VaAccordionItem,
  VaLoadingIndicator,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
// Alias setData to setFormData for clarity and to avoid undefined reference in tests
import { setData as setFormData } from 'platform/forms-system/src/js/actions';
import { focusElement } from 'platform/utilities/ui';

/*
 * NOTE: This is an INITIAL SLICE of the full 21-526EZ form for the
 * accredited representative single-page (power user) flow. To meet the
 * cross-application import restriction we do NOT pull in the entire
 * all-claims app config. Instead we selectively construct the minimal
 * schema/uiSchema segments here (or in future via a local adapter module).
 *
 * Expansion TODOs are documented at the bottom of this file.
 */

// Minimal field patterns (prefer platform web-component-patterns where possible)
// We inline simple text/date patterns for now to avoid premature abstraction.
const veteranInfoSchema = {
  type: 'object',
  properties: {
    veteranFullName: {
      type: 'object',
      properties: {
        first: { type: 'string' },
        middle: { type: 'string' },
        last: { type: 'string' },
        suffix: { type: 'string' },
      },
      required: ['first', 'last'],
    },
    veteranSocialSecurityNumber: { type: 'string', pattern: '^[0-9]{9}$' },
    veteranDateOfBirth: { type: 'string', format: 'date' },
  },
};

const veteranInfoUi = {
  'ui:title': 'Veteran information',
  veteranFullName: {
    first: { 'ui:title': 'First name', 'ui:required': () => true },
    middle: { 'ui:title': 'Middle name' },
    last: { 'ui:title': 'Last name', 'ui:required': () => true },
    suffix: { 'ui:title': 'Suffix' },
  },
  veteranSocialSecurityNumber: {
    'ui:title': 'Social Security number',
    'ui:options': { widgetClassNames: 'usa-input-medium' },
    'ui:errorMessages': {
      pattern: 'Enter a 9-digit SSN (numbers only)',
    },
  },
  veteranDateOfBirth: { 'ui:title': 'Date of birth' },
};

const contactInfoSchema = {
  type: 'object',
  properties: {
    emailAddress: { type: 'string', format: 'email' },
    primaryPhone: { type: 'string' },
    mailingAddress: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        street2: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        postalCode: { type: 'string' },
      },
    },
  },
};

const contactInfoUi = {
  'ui:title': 'Contact information',
  emailAddress: { 'ui:title': 'Email address' },
  primaryPhone: { 'ui:title': 'Primary phone number' },
  mailingAddress: {
    'ui:title': 'Mailing address',
    street: { 'ui:title': 'Street address' },
    street2: { 'ui:title': 'Street address line 2' },
    city: { 'ui:title': 'City' },
    state: { 'ui:title': 'State' },
    postalCode: { 'ui:title': 'ZIP code' },
  },
};

const disabilitiesSchema = {
  type: 'object',
  properties: {
    newDisabilities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          condition: { type: 'string' },
          cause: { type: 'string', enum: ['NEW', 'WORSENED', 'VA'] },
        },
        required: ['condition'],
      },
      minItems: 1,
    },
  },
};

const disabilitiesUi = {
  'ui:title': 'Claimed conditions',
  newDisabilities: {
    'ui:title': 'List the conditions you are claiming',
    items: {
      condition: { 'ui:title': 'Condition name' },
      cause: {
        'ui:title': 'Cause',
        'ui:widget': 'select',
        'ui:options': {
          labels: {
            NEW: 'New condition',
            WORSENED: 'Condition worsened',
            VA: 'Caused by VA care',
          },
        },
      },
    },
  },
};

const evidenceSchema = {
  type: 'object',
  properties: {
    hasVaMedicalRecords: { type: 'boolean' },
    hasPrivateMedicalRecords: { type: 'boolean' },
    hasLayStatements: { type: 'boolean' },
  },
};

const evidenceUi = {
  'ui:title': 'Supporting evidence',
  hasVaMedicalRecords: { 'ui:title': 'VA medical records' },
  hasPrivateMedicalRecords: { 'ui:title': 'Private medical records' },
  hasLayStatements: { 'ui:title': 'Lay statements or other evidence' },
};

// Section aggregation for accordion rendering
const buildSections = () => [
  {
    key: 'veteranInformationSection',
    chapterKey: 'veteranDetails',
    chapterTitle: 'Veteran details',
    title: 'Veteran information',
    schema: veteranInfoSchema,
    uiSchema: veteranInfoUi,
  },
  {
    key: 'contactInformationSection',
    chapterKey: 'veteranDetails',
    chapterTitle: 'Veteran details',
    title: 'Contact information',
    schema: contactInfoSchema,
    uiSchema: contactInfoUi,
  },
  {
    key: 'disabilitiesSection',
    chapterKey: 'disabilities',
    chapterTitle: 'Conditions',
    title: 'Claimed conditions',
    schema: disabilitiesSchema,
    uiSchema: disabilitiesUi,
  },
  {
    key: 'evidenceSection',
    chapterKey: 'supportingEvidence',
    chapterTitle: 'Supporting evidence',
    title: 'Supporting evidence',
    schema: evidenceSchema,
    uiSchema: evidenceUi,
  },
];

const groupSectionsByChapter = sections => {
  return sections.reduce((acc, section) => {
    if (!acc[section.chapterKey]) {
      acc[section.chapterKey] = {
        title: section.chapterTitle,
        sections: [],
      };
    }
    acc[section.chapterKey].sections.push(section);
    return acc;
  }, {});
};

export const SinglePageForm526EZUnconnected = ({
  formData = {},
  setFormData,
  onSubmit,
  onSaveDraft,
  veteranInfo,
}) => {
  const [expanded, setExpanded] = useState([]); // track open chapters
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    focusElement('h1');
  }, []);

  const sections = buildSections();
  const chapters = groupSectionsByChapter(sections);
  const chapterEntries = Object.entries(chapters);

  const handleChapterToggle = chapterKey => {
    setExpanded(prev =>
      prev.includes(chapterKey)
        ? prev.filter(k => k !== chapterKey)
        : [...prev, chapterKey],
    );
  };

  const handleSectionChange = useCallback(
    (sectionKey, newSectionData) => {
      setFormData({
        ...formData,
        [sectionKey]: newSectionData,
      });
    },
    [formData, setFormData],
  );

  const validateAll = currentData => {
    const errors = {};
    // Minimal required field checks
    const name = currentData.veteranInformationSection?.veteranFullName;
    if (!name?.first || !name?.last) {
      errors.veteranInformationSection = 'Enter first and last name';
    }
    if (
      currentData.veteranInformationSection?.veteranSocialSecurityNumber &&
      !/^[0-9]{9}$/.test(
        currentData.veteranInformationSection?.veteranSocialSecurityNumber,
      )
    ) {
      errors.veteranInformationSection =
        (errors.veteranInformationSection || '') +
        ' SSN must be 9 digits.';
    }
    if (
      currentData.disabilitiesSection?.newDisabilities &&
      currentData.disabilitiesSection.newDisabilities.length === 0
    ) {
      errors.disabilitiesSection = 'Add at least one condition.';
    }
    return errors;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    const errors = validateAll(formData);
    if (Object.keys(errors).length) {
      setSubmitting(false);
      // Focus first error
      focusElement('va-alert[status="error"]');
      return;
    }
    try {
      await onSubmit?.(formData, { veteranInfo });
    } catch (e) {
      setSubmitError(e?.message || 'Something went wrong submitting the form');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await onSaveDraft?.(formData, { veteranInfo });
    } catch (e) {
      // Silently log; could surface toast/alert in future iteration
      // eslint-disable-next-line no-console
      console.error('Draft save failed', e);
    }
  };

  return (
    <div className="single-page-form-526ez vads-u-margin-y--4">
      <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--2">
        VA Form 21-526EZ – Application for Disability Compensation
      </h1>
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        Power user single-page entry (pilot). Provide claimant details and
        claimed conditions below. Required fields are marked with an asterisk
        (*).
      </p>
      {veteranInfo && (
        <va-alert status="info" uswds>
            <h2 slot="headline" className="vads-u-font-size--h4 vads-u-margin--0">Filing on behalf of a Veteran</h2>
            <p className="vads-u-margin-y--0">You are completing this form for: <strong>{veteranInfo.name || 'Veteran'}</strong></p>
        </va-alert>
      )}
      {submitError && (
        <va-alert status="error" uswds visible>
          <h2 slot="headline" className="vads-u-font-size--h4 vads-u-margin--0">We couldn’t submit the form</h2>
          <p className="vads-u-margin-y--0">{submitError}</p>
        </va-alert>
      )}

      <VaAccordion bordered uswds>
        {chapterEntries.map(([chapterKey, chapter]) => (
          <VaAccordionItem
            key={chapterKey}
            header={chapter.title}
            level={2}
            open={expanded.includes(chapterKey)}
            onAccordionItemToggled={() => handleChapterToggle(chapterKey)}
          >
            <div className="vads-u-padding-x--1 vads-u-padding-bottom--2">
              {chapter.sections.map(section => (
                <div
                  key={section.key}
                  className="vads-u-margin-bottom--4"
                  data-section={section.key}
                >
                  <h3 className="vads-u-font-size--h4">{section.title}</h3>
                  <SchemaForm
                    name={section.key}
                    schema={section.schema}
                    uiSchema={section.uiSchema}
                    data={formData[section.key] || {}}
                    onChange={newData => handleSectionChange(section.key, newData)}
                    onSubmit={() => {}}
                  />
                </div>
              ))}
            </div>
          </VaAccordionItem>
        ))}
      </VaAccordion>

      <div className="vads-u-margin-top--4">
        {submitting ? (
          <VaLoadingIndicator message="Submitting form..." />
        ) : (
          <>
            <va-button
              text="Submit Form 21-526EZ"
              onClick={handleSubmit}
              continue
            />
            <va-button
              text="Save draft"
              secondary
              class="vads-u-margin-left--2"
              onClick={handleSaveDraft}
            />
          </>
        )}
      </div>

      {/* Development & expansion notes */}
      <div className="vads-u-margin-top--5 vads-u-font-size--sm" data-testid="dev-notes">
        <strong>Developer notes:</strong> This prototype includes a minimal subset of fields. See file for TODO list.
      </div>
    </div>
  );
};

// Lightweight bare version for smoke tests without web components / SchemaForm
export const SinglePageForm526EZBare = ({ veteranInfo, onSubmit = () => {} }) => (
  <div data-testid="single-page-form-526ez-bare">
    <h1>VA Form 21-526EZ – Application for Disability Compensation</h1>
    {veteranInfo && (
      <p data-testid="bare-veteran-name">{veteranInfo.name}</p>
    )}
    <button type="button" onClick={() => onSubmit({})}>Submit Form 21-526EZ</button>
  </div>
);

SinglePageForm526EZUnconnected.propTypes = {
  formData: PropTypes.object,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  onSaveDraft: PropTypes.func,
  veteranInfo: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  veteranInfo: state.user?.profile?.veteranInfo || null,
});

const mapDispatchToProps = { setFormData };

const ConnectedSinglePageForm526EZ = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SinglePageForm526EZUnconnected);

export default ConnectedSinglePageForm526EZ;

/*
 * TODO (future iterations):
 * 1. Replace inline schemas with shared schema fragments allowed within portal context.
 * 2. Integrate autosave using portal draft save endpoint.
 * 3. Add full validation parity with multi-step 526EZ.
 * 4. Add file upload & evidence detail subsections.
 * 5. Implement condition add/remove UI parity (custom array field widgets).
 * 6. Add analytics events for open/close chapter & submission.
 * 7. Accessibility: revisit heading levels after full content expansion.
 */
