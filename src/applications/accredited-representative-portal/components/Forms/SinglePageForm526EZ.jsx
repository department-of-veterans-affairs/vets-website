import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  VaAccordion,
  VaAccordionItem,
  VaLoadingIndicator,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { focusElement } from 'platform/utilities/ui';
import NewDisability from '../NewDisability';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import {
  buildVeteranInformationSection,
  buildContactInformationSection,
} from 'platform/forms/disability-benefits/526ez/sharedSections';

const { condition } = fullSchema.definitions.newDisabilities.items.anyOf[0].properties;

/*
 * NOTE: This is an INITIAL SLICE of the full 21-526EZ form for the
 * accredited representative single-page (power user) flow. To meet the
 * cross-application import restriction we do NOT pull in the entire
 * all-claims app config. Instead we selectively construct the minimal
 * schema/uiSchema segments here (or in future via a local adapter module).
 *
 * Expansion TODOs are documented at the bottom of this file.
 */

// Veteran & contact details flow through a shared platform adapter so the
// representative experience mirrors the flagship all-claims implementation.
const veteranInformationSection = buildVeteranInformationSection();
const contactInformationSection = buildContactInformationSection();

const disableSectionSubmit = uiSchema => {
  if (!uiSchema) {
    return uiSchema;
  }
  const next = { ...uiSchema };
  next['ui:submitButtonOptions'] = {
    ...(uiSchema['ui:submitButtonOptions'] || {}),
    norender: true,
  };
  return next;
};

// For growable arrays the platform ArrayField currently assumes `schema.items` is
// an array (tuple style) or falls back to `additionalItems`. A single schema
// object (RJSF shorthand) results in getItemSchema returning `undefined`, which
// leads to `toIdSchema` throwing (Cannot use 'in' operator on undefined).
// Define both an array `items` and matching `additionalItems` so each added row
// resolves to a concrete item schema.
const disabilityItemSchema = {
  type: 'object',
  properties: {
    condition,
  },
  required: ['condition'],
};

const disabilitiesSchema = {
  type: 'object',
  properties: {
    newDisabilities: {
      type: 'array',
      minItems: 1,
      // Provide first item schema in an array (tuple form) so ArrayField.getItemSchema(index)
      // returns a defined schema for index 0. Use additionalItems for subsequent entries.
      items: [disabilityItemSchema],
      additionalItems: disabilityItemSchema,
    },
  },
};

const autocompleteUiSchema = { //changed
  'ui:validations': [],
  'ui:required': () => true,
  'ui:errorMessages': {
    required: "Enter a condition, diagnosis, or short description of your symptoms",
  },
  'ui:options': {
    hideLabelText: true,
  },
};

const disabilitiesUi = {
  newDisabilities: {
    'ui:description': 'List the conditions you are claiming', // changed
    'ui:options': {
      itemName: 'Condition',
      itemAriaLabel: data => data.condition,
      viewField: NewDisability,
      customTitle: ' ',
      confirmRemove: true,
      useDlWrap: true,
      useVaCards: true,
      showSave: true,
      reviewMode: true,
      keepInPageOnReview: false,
    },
    'ui:validations': [], // changed
    items: {
      condition: autocompleteUiSchema,
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
    schema: veteranInformationSection.schema,
    uiSchema: disableSectionSubmit(veteranInformationSection.uiSchema),
  },
  {
    key: 'contactInformationSection',
    chapterKey: 'veteranDetails',
    chapterTitle: 'Veteran details',
    title: 'Contact information',
    schema: contactInformationSection.schema,
    uiSchema: disableSectionSubmit(contactInformationSection.uiSchema),
  },
  {
    key: 'disabilitiesSection',
    chapterKey: 'disabilities',
    chapterTitle: 'Conditions',
    title: 'Claimed conditions',
    schema: disabilitiesSchema,
    uiSchema: disableSectionSubmit(disabilitiesUi),
  },
  {
    key: 'evidenceSection',
    chapterKey: 'supportingEvidence',
    chapterTitle: 'Supporting evidence',
    title: 'Supporting evidence',
    schema: evidenceSchema,
    uiSchema: disableSectionSubmit(evidenceUi),
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
  onSubmit,
  veteranInfo,
  initialData = {},
}) => {
  const [formData, setFormData] = useState(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const sections = useMemo(() => buildSections(), []);
  const chapters = useMemo(() => groupSectionsByChapter(sections), [sections]);
  const chapterEntries = useMemo(() => Object.entries(chapters), [chapters]);
  
  // Initialize all chapters as expanded
  const [expanded, setExpanded] = useState(() => 
    chapterEntries.map(([key]) => key)
  );

  useEffect(() => {
    focusElement('h1');
  }, []);

  const handleChapterToggle = chapterKey => {
    setExpanded(prev =>
      prev.includes(chapterKey)
        ? prev.filter(k => k !== chapterKey)
        : [...prev, chapterKey],
    );
  };

  const handleSectionChange = useCallback(
    (sectionKey, newSectionData) => {
      setFormData(prevData => ({
        ...prevData,
        [sectionKey]: newSectionData,
      }));
    },
    [],
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
              {chapter.sections.map(section => {
                const sectionData = formData[section.key] || {};
                return (
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
                      data={sectionData}
                      onChange={newData => handleSectionChange(section.key, newData)}
                      onSubmit={() => {}}
                    >
                      <></>
                    </SchemaForm>
                  </div>
                );
              })}
            </div>
          </VaAccordionItem>
        ))}
      </VaAccordion>

      <div className="vads-u-margin-top--4">
        {submitting ? (
          <VaLoadingIndicator message="Submitting form..." />
        ) : (
          <va-button
            text="Submit Form 21-526EZ"
            onClick={handleSubmit}
            continue
          />
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
  initialData: PropTypes.object,
  onSubmit: PropTypes.func,
  veteranInfo: PropTypes.object,
};

export default SinglePageForm526EZUnconnected;

/*
 * TODO (future iterations):
 * 1. Replace inline schemas with shared schema fragments allowed within portal context.
 * 2. Add full validation parity with multi-step 526EZ.
 * 3. Add file upload & evidence detail subsections.
 * 4. Accessibility: revisit heading levels after full content expansion.
 */
