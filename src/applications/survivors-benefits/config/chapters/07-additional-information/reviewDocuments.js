import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import '@department-of-veterans-affairs/component-library/dist/components/va-table';
import '@department-of-veterans-affairs/component-library/dist/components/va-table-row';
import '@department-of-veterans-affairs/component-library/dist/components/va-text-input';

// Temporary mocked document data so the review UI matches the design while
// document parsing is under development.
const MOCK_DOC_DATA = {
  DD214: [
    {
      heading: 'Veteran information',
      rows: [
        { label: 'First name', value: 'John' },
        { label: 'Middle name', value: 'Dylan' },
        { label: 'Last name', value: 'Smith' },
        { label: 'Suffix', value: 'Sr.' },
        { label: 'Social Security number', value: '***-**-1234' },
        { label: 'Date of birth', value: 'July 1, 1955' },
      ],
    },
    {
      heading: 'Service information',
      rows: [
        { label: 'Branch of service', value: 'Air Force' },
        { label: 'Grade, rate, or rank', value: 'Captain' },
        { label: 'Pay grade', value: 'O3' },
        { label: 'Date inducted', value: 'January 31, 2002' },
        { label: 'Date entered active service', value: 'February 28, 2002' },
        { label: 'Date separated active service', value: 'May 31, 2007' },
        {
          label: 'Cause of separation',
          value: 'Completion of required active service',
        },
        { label: 'Character of service', value: 'Honorable' },
        { label: 'Separation type', value: 'Release from active duty' },
        { label: 'Separation code', value: '203' },
      ],
    },
  ],
  'Death certificate': [
    {
      heading: 'Decedent information',
      rows: [
        { label: 'First name', value: 'John' },
        { label: 'Middle name', value: 'Dylan' },
        { label: 'Last name', value: 'Smith' },
        { label: 'Suffix', value: 'Sr.' },
        { label: 'Social Security number', value: '***-**-1234' },
        { label: 'Marital status at time of death', value: 'Married' },
      ],
    },
    {
      heading: 'Death certificate information',
      rows: [
        { label: 'Disposition date', value: 'March 10, 2025' },
        { label: 'Date of death', value: 'March 5, 2025' },
        { label: 'Cause of death A', value: 'Cardiopulmonary arrest' },
        { label: 'Cause of death B', value: 'Dementia' },
        { label: 'Cause of death C', value: '—' },
        { label: 'Cause of death D', value: '—' },
        { label: 'Cause of death (Other)', value: '—' },
        { label: 'Manner of death', value: 'Natural' },
      ],
    },
  ],
};

const cloneDocumentData = data =>
  Object.entries(data || {}).reduce((acc, [docType, sections]) => {
    acc[docType] = sections.map(section => ({
      heading: section.heading,
      rows: section.rows.map(row => ({ ...row })),
    }));
    return acc;
  }, {});

const hasEntries = data => !!data && Object.keys(data).length > 0;

const buildDocDataFromFiles = files =>
  (files || []).reduce((acc, file) => {
    const sectionsByType = file?.idpSections;
    if (!sectionsByType) {
      return acc;
    }

    Object.entries(sectionsByType).forEach(([docType, sections]) => {
      if (Array.isArray(sections) && sections.length) {
        acc[docType] = sections;
      }
    });

    return acc;
  }, {});

const createSectionKey = (docType, heading) => `${docType}::${heading}`;

const docDataEqual = (left, right) =>
  JSON.stringify(left || {}) === JSON.stringify(right || {});

const mapFileNameToHeader = name => {
  if (!name) return 'Uploaded document';
  const n = name.toLowerCase();
  if (n.includes('dd214') || n.includes('dd-214') || n.includes('dd 214'))
    return 'DD214';
  if (n.includes('death')) return 'Death certificate';
  if (n.includes('marri')) return 'Marriage license';
  if (n.includes('birth')) return 'Birth certificate';
  if (n.includes('divorc')) return 'Divorce decree';
  if (n.includes('adopt')) return 'Adoption decree';
  return name;
};

const Description = () => (
  <p>
    The information below was automatically extracted from a few of the
    documents that you uploaded. Review each form and make any necessary
    corrections.
  </p>
);

const ReviewDocumentsField = props => {
  const { formData: documentData, onChange } = props;
  const formState = useSelector(state => state?.form?.data || {});
  const files = useMemo(() => formState.files || [], [formState.files]);

  const extractedDocData = useMemo(() => buildDocDataFromFiles(files), [files]);

  const initialDocData = useMemo(
    () => {
      if (hasEntries(documentData)) {
        return cloneDocumentData(documentData);
      }
      if (hasEntries(extractedDocData)) {
        return cloneDocumentData(extractedDocData);
      }
      return cloneDocumentData(MOCK_DOC_DATA);
    },
    [documentData, extractedDocData],
  );

  const [docState, setDocState] = useState(initialDocData);
  const [editingSections, setEditingSections] = useState({});
  const [pendingEdits, setPendingEdits] = useState({});
  const [hasUserEdits, setHasUserEdits] = useState(false);

  useEffect(
    () => {
      setDocState(initialDocData);
    },
    [initialDocData],
  );

  useEffect(
    () => {
      if (!hasEntries(documentData)) {
        setHasUserEdits(false);
        return;
      }

      if (docDataEqual(documentData, extractedDocData)) {
        setHasUserEdits(false);
      }
    },
    [documentData, extractedDocData],
  );

  useEffect(
    () => {
      if (!hasEntries(extractedDocData) || hasUserEdits) {
        return;
      }

      if (!docDataEqual(documentData, extractedDocData)) {
        onChange(cloneDocumentData(extractedDocData));
      }
    },
    [documentData, extractedDocData, hasUserEdits, onChange],
  );

  const startEditingSection = (docType, sectionIndex) => {
    const section = docState?.[docType]?.[sectionIndex];
    if (!section) {
      return;
    }

    const sectionKey = createSectionKey(docType, section.heading);

    setEditingSections(prev => ({ ...prev, [sectionKey]: true }));
    setPendingEdits(prev => ({
      ...prev,
      [sectionKey]: {
        docType,
        sectionIndex,
        heading: section.heading,
        rows: section.rows.map(row => ({ ...row })),
      },
    }));
  };

  const updateRowValue = (sectionKey, rowIndex, value) => {
    setPendingEdits(prev => {
      const pendingSection = prev[sectionKey];
      if (!pendingSection) {
        return prev;
      }

      const rows = pendingSection.rows.map(
        (row, idx) => (idx === rowIndex ? { ...row, value } : row),
      );

      return {
        ...prev,
        [sectionKey]: {
          ...pendingSection,
          rows,
        },
      };
    });
  };

  const stopEditingSection = sectionKey => {
    setPendingEdits(prev => {
      const next = { ...prev };
      delete next[sectionKey];
      return next;
    });
    setEditingSections(prev => ({ ...prev, [sectionKey]: false }));
  };

  const saveSection = sectionKey => {
    const pendingSection = pendingEdits[sectionKey];
    if (!pendingSection) {
      return;
    }

    const { docType, sectionIndex, rows } = pendingSection;

    const updatedDocState = {
      ...docState,
      [docType]: docState[docType].map(
        (section, idx) =>
          idx === sectionIndex
            ? {
                ...section,
                rows: rows.map(row => ({ ...row })),
              }
            : section,
      ),
    };

    setDocState(updatedDocState);
    onChange(updatedDocState);
    setHasUserEdits(true);
    stopEditingSection(sectionKey);
  };

  const renderSection = (docType, section, sectionIndex) => {
    const sectionKey = createSectionKey(docType, section.heading);
    const isEditing = editingSections[sectionKey];
    const rows =
      isEditing && pendingEdits[sectionKey]
        ? pendingEdits[sectionKey].rows
        : section.rows;

    return (
      <div key={sectionKey} className="vads-u-margin-bottom--3">
        <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center vads-u-margin-bottom--1">
          <h4 className="vads-u-font-size--md vads-u-margin--0">
            {section.heading}
          </h4>
          {!isEditing ? (
            <va-button
              text="Edit"
              secondary
              onClick={() => startEditingSection(docType, sectionIndex)}
            />
          ) : null}
        </div>
        {!isEditing ? (
          <va-table
            table-type="borderless"
            full-width="true"
            right-align-cols="1"
            uswds
          >
            <va-table-row slot="headers">
              <span className="vads-u-visibility--screen-reader">Field</span>
              <span
                right-align-cols
                className="vads-u-visibility--screen-reader"
              >
                Value
              </span>
            </va-table-row>
            {rows.map(row => (
              <va-table-row key={`${sectionKey}-${row.label}`}>
                <span>{row.label}</span>
                <span right-align-cols className="vads-u-font-weight--bold">
                  {row.value}
                </span>
              </va-table-row>
            ))}
          </va-table>
        ) : (
          <div>
            {rows.map((row, rowIndex) => (
              <va-text-input
                key={`${sectionKey}-${row.label}`}
                label={row.label}
                value={row.value || ''}
                onInput={event =>
                  updateRowValue(sectionKey, rowIndex, event.target.value)
                }
              />
            ))}
            <div className="vads-u-display--flex vads-u-margin-top--2">
              <va-button
                text="Update section"
                onClick={() => saveSection(sectionKey)}
              />
              <va-button
                text="Cancel"
                secondary
                class="vads-u-margin-left--2"
                onClick={() => stopEditingSection(sectionKey)}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!files.length) {
    return <p>You haven’t uploaded any supporting documents yet.</p>;
  }

  const seen = {};

  return (
    <va-accordion>
      {files.map((file, idx) => {
        const baseTitle = mapFileNameToHeader(file.name);
        seen[baseTitle] = (seen[baseTitle] || 0) + 1;
        const title =
          seen[baseTitle] > 1 ? `${baseTitle} (${seen[baseTitle]})` : baseTitle;
        const sections = docState[baseTitle];

        return (
          <va-accordion-item
            bordered
            header={title}
            key={`${file.name}-${idx}`}
          >
            {sections ? (
              sections.map((section, sectionIndex) =>
                renderSection(baseTitle, section, sectionIndex),
              )
            ) : (
              <>
                <p>
                  <strong>Filename:</strong> {file.name}
                </p>
                {file.size ? (
                  <p>
                    <strong>Size:</strong> {file.size} bytes
                  </p>
                ) : null}
                {file.confirmationCode ? (
                  <p>
                    <strong>Confirmation code:</strong> {file.confirmationCode}
                  </p>
                ) : null}
              </>
            )}
          </va-accordion-item>
        );
      })}
    </va-accordion>
  );
};

ReviewDocumentsField.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
};

export default {
  title: 'Review supporting documents',
  path: 'additional-information/review-documents',
  uiSchema: {
    ...titleUI('Review supporting documents', Description),
    reviewDocumentsData: {
      'ui:field': ReviewDocumentsField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      reviewDocumentsData: {
        type: 'object',
        properties: {},
      },
    },
  },
};
