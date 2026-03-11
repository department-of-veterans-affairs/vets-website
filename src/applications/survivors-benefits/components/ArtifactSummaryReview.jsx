import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import '@department-of-veterans-affairs/component-library/dist/components/va-accordion';
import '@department-of-veterans-affairs/component-library/dist/components/va-accordion-item';
import '@department-of-veterans-affairs/component-library/dist/components/va-text-input';

import {
  VaComboBox,
  VaMemorableDate,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatIsoDate, sanitize } from '../cave/transformers/helpers';
import {
  PAY_GRADE_OPTIONS,
  SEPARATION_TYPE_OPTIONS,
  CHARACTER_OF_SERVICE_OPTIONS,
  SEPARATION_CODES,
} from '../cave/constants';
import { validateIsoDate } from '../cave/validators';

// ---------------------------------------------------------------------------
// Section keys — only non-fieldMapping fields remain
// ---------------------------------------------------------------------------
const DD214_SERVICE = 'dd214-service';
const DEATH_DEATH_INFO = 'deathCert-deathInfo';

const sectionKey = (artifactType, fileIndex, entryIndex, section) =>
  `${artifactType}-${fileIndex}-${entryIndex}-${section}`;

// ---------------------------------------------------------------------------
// Required fields per artifact type
// (cause-of-death B/C/D are optional — IDP may not extract them)
// ---------------------------------------------------------------------------
const DD214_REQUIRED = [
  'GRADE_RATE_RANK',
  'PAY_GRADE',
  'DATE_INDUCTED',
  'CAUSE_OF_SEPARATION',
  'SEPARATION_TYPE',
  'SEPARATION_CODE',
  'CHARACTER_OF_SERVICE',
];

const DEATH_CERT_REQUIRED = [
  'DECENDENT_DATE_OF_DISPOSITION',
  'CAUSE_OF_DEATH',
  'MANNER_OF_DEATH',
  'DECENDENT_MARITAL_STATUS',
];

// Field-level required error messages — "Enter a …" for text inputs,
// "Select a …" for selects/combos, "Provide …" for date fields.
const REQUIRED_MESSAGES = {
  GRADE_RATE_RANK: 'Enter a grade, rate, or rank',
  PAY_GRADE: 'Select a pay grade',
  DATE_INDUCTED: 'Provide the date inducted',
  CAUSE_OF_SEPARATION: 'Enter a cause of separation',
  SEPARATION_TYPE: 'Select a separation type',
  SEPARATION_CODE: 'Select a separation code',
  CHARACTER_OF_SERVICE: 'Select a character of service',
  DECENDENT_DATE_OF_DISPOSITION: 'Provide a disposition date',
  CAUSE_OF_DEATH: 'Enter a cause of death',
  MANNER_OF_DEATH: 'Enter a manner of death',
  DECENDENT_MARITAL_STATUS: 'Enter a marital status',
};

const entryHasRequiredMissing = (entry, artifactType) => {
  const required =
    artifactType === 'dd214' ? DD214_REQUIRED : DEATH_CERT_REQUIRED;
  return required.some(f => !entry[f]);
};

const pageHasErrors = files =>
  files.some(file => {
    const artifacts = file?.idpArtifacts;
    if (!artifacts) return false;
    return (
      (artifacts.dd214 ?? []).some(e => entryHasRequiredMissing(e, 'dd214')) ||
      (artifacts.deathCertificates ?? []).some(e =>
        entryHasRequiredMissing(e, 'deathCertificates'),
      )
    );
  });

// ---------------------------------------------------------------------------
// Draft extraction helpers
// ---------------------------------------------------------------------------
const extractDraft = (entry, section) => {
  if (section === DD214_SERVICE) {
    return {
      GRADE_RATE_RANK: entry.GRADE_RATE_RANK ?? '',
      PAY_GRADE: entry.PAY_GRADE ?? '',
      DATE_INDUCTED: entry.DATE_INDUCTED ?? '',
      CAUSE_OF_SEPARATION: entry.CAUSE_OF_SEPARATION ?? '',
      SEPARATION_TYPE: entry.SEPARATION_TYPE ?? '',
      SEPARATION_CODE: entry.SEPARATION_CODE ?? '',
      CHARACTER_OF_SERVICE: entry.CHARACTER_OF_SERVICE ?? '',
    };
  }
  if (section === DEATH_DEATH_INFO) {
    return {
      DECENDENT_DATE_OF_DISPOSITION: entry.DECENDENT_DATE_OF_DISPOSITION ?? '',
      CAUSE_OF_DEATH: entry.CAUSE_OF_DEATH ?? '',
      UNDERLYING_CAUSE_OF_DEATH_B: entry.UNDERLYING_CAUSE_OF_DEATH_B ?? '',
      UNDERLYING_CAUSE_OF_DEATH_C: entry.UNDERLYING_CAUSE_OF_DEATH_C ?? '',
      UNDERLYING_CAUSE_OF_DEATH_D: entry.UNDERLYING_CAUSE_OF_DEATH_D ?? '',
      MANNER_OF_DEATH: entry.MANNER_OF_DEATH ?? '',
      DECENDENT_MARITAL_STATUS: entry.DECENDENT_MARITAL_STATUS ?? '',
    };
  }
  return {};
};

// ---------------------------------------------------------------------------
// Validation — required fields get specific messages; optional B/C/D fields
// are skipped if empty; text values are truncated at 1000 chars via maxlength
// on the input so no length error is needed here.
// ---------------------------------------------------------------------------
const validateDraft = (draft, section) => {
  const errs = {};

  if (section === DD214_SERVICE) {
    [
      'GRADE_RATE_RANK',
      'CAUSE_OF_SEPARATION',
      'PAY_GRADE',
      'SEPARATION_TYPE',
      'SEPARATION_CODE',
      'CHARACTER_OF_SERVICE',
    ].forEach(field => {
      if (!draft[field]) errs[field] = REQUIRED_MESSAGES[field];
    });

    if (!draft.DATE_INDUCTED) {
      errs.DATE_INDUCTED = REQUIRED_MESSAGES.DATE_INDUCTED;
    } else {
      const dateErr = validateIsoDate(draft.DATE_INDUCTED, 'date inducted');
      if (dateErr) errs.DATE_INDUCTED = dateErr;
    }
  }

  if (section === DEATH_DEATH_INFO) {
    if (!draft.DECENDENT_DATE_OF_DISPOSITION) {
      errs.DECENDENT_DATE_OF_DISPOSITION =
        REQUIRED_MESSAGES.DECENDENT_DATE_OF_DISPOSITION;
    } else {
      const dateErr = validateIsoDate(
        draft.DECENDENT_DATE_OF_DISPOSITION,
        'disposition date',
      );
      if (dateErr) errs.DECENDENT_DATE_OF_DISPOSITION = dateErr;
    }

    ['CAUSE_OF_DEATH', 'MANNER_OF_DEATH', 'DECENDENT_MARITAL_STATUS'].forEach(
      field => {
        if (!draft[field]) errs[field] = REQUIRED_MESSAGES[field];
      },
    );
    // B/C/D are optional — no validation when empty
  }

  return errs;
};

// Truncate text values to 1000 chars before storing
const truncateDraft = draft =>
  Object.fromEntries(
    Object.entries(draft).map(([k, v]) => [
      k,
      typeof v === 'string' && v.length > 1000 ? v.slice(0, 1000) : v,
    ]),
  );

// ---------------------------------------------------------------------------
// Read-only row — styled like the review/submit page with separator lines.
// Optional rows are hidden entirely when empty.
// Required rows show italic "Missing" when empty.
// ---------------------------------------------------------------------------
const ReadRow = ({ label, value, optional }) => {
  if (optional && !value) return null;
  return (
    <div className="vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-padding-y--1p5 vads-u-display--flex vads-u-justify-content--space-between">
      <dt className="vads-u-color--gray-dark vads-u-margin--0 vads-u-font-weight--normal">
        {label}
      </dt>
      <dd className="vads-u-margin--0 vads-u-text-align--right vads-u-font-weight--bold">
        {value ? (
          sanitize(value)
        ) : (
          <em className="vads-u-font-weight--normal">Missing</em>
        )}
      </dd>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Edit form inputs
// ---------------------------------------------------------------------------
const TextField = ({ field, label, value, error, onInput, hint }) => (
  <div className="vads-u-margin-bottom--3">
    <va-text-input
      label={label}
      name={field}
      value={value || ''}
      error={error || null}
      hint={hint || null}
      maxlength="1000"
      onInput={e => onInput(field, e.target.value)}
      uswds
    />
  </div>
);

const SelectField = ({ field, label, value, error, options, onChange }) => (
  <div className="vads-u-margin-bottom--3">
    <VaSelect
      label={label}
      name={field}
      value={value || ''}
      error={error || null}
      onVaSelect={e => onChange(field, e.detail.value)}
      uswds
    >
      {options.map(
        opt =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ),
      )}
    </VaSelect>
  </div>
);

const DateField = ({ field, label, value, error, onDateChange }) => (
  <div className="vads-u-margin-bottom--3">
    <VaMemorableDate
      label={label}
      name={field}
      value={value || ''}
      error={error || null}
      onDateChange={e => {
        const [year, month, day] = (e.target?.value ?? '').split('-');
        if (year && month && day) {
          const iso = `${year}-${String(month).padStart(2, '0')}-${String(
            day,
          ).padStart(2, '0')}`;
          onDateChange(field, iso);
        }
      }}
      uswds
    />
  </div>
);

const ComboField = ({ field, label, value, error, options, onChange }) => (
  <div className="vads-u-margin-bottom--3">
    <VaComboBox
      label={label}
      name={field}
      value={value || ''}
      error={error || null}
      onVaSelect={e => onChange(field, e.detail.value)}
      uswds
    >
      {options.map(opt => {
        const v = typeof opt === 'string' ? opt : opt.value;
        const l = typeof opt === 'string' ? opt : opt.label;
        return (
          <option key={v} value={v}>
            {l}
          </option>
        );
      })}
    </VaComboBox>
  </div>
);

// ---------------------------------------------------------------------------
// Section component
// ---------------------------------------------------------------------------
const Section = ({
  heading,
  isEditing,
  children,
  readRows,
  onEdit,
  onSave,
  onCancel,
}) => (
  <div className="vads-u-margin-bottom--3">
    <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center vads-u-margin-bottom--1">
      <h4 className="vads-u-font-size--md vads-u-margin--0">{heading}</h4>
      {!isEditing && (
        <va-button
          secondary
          label={`Edit ${heading}`}
          onClick={onEdit}
          text="Edit"
          uswds
        />
      )}
    </div>

    {isEditing ? (
      <div>
        {children}
        <div className="vads-u-margin-top--2 vads-u-display--flex vads-u-flex-direction--row">
          <va-button onClick={onSave} text="Save" uswds />
          <va-button
            secondary
            onClick={onCancel}
            text="Cancel"
            uswds
            class="vads-u-margin-left--1"
          />
        </div>
      </div>
    ) : (
      <dl className="vads-u-border-top--1px vads-u-border-color--gray-light vads-u-margin--0 vads-u-padding--0">
        {readRows.map(row => (
          <ReadRow
            key={row.label}
            label={row.label}
            value={row.value}
            optional={row.optional}
          />
        ))}
      </dl>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// DD-214 accordion item
// Fields in fieldMapping (name, SSN, DOB, branch, service entry/separation
// dates) are omitted — they're shown in the conflict-resolution sections.
// ---------------------------------------------------------------------------
const Dd214Item = ({
  headline,
  entry,
  fileIndex,
  entryIndex,
  editingSection,
  draftValues,
  errors,
  onEdit,
  onSave,
  onCancel,
  onField,
  onDate,
}) => {
  const serviceKey = sectionKey('dd214', fileIndex, entryIndex, DD214_SERVICE);
  const hasErrors = entryHasRequiredMissing(entry, 'dd214');

  return (
    <va-accordion-item
      header={headline}
      subheader={
        hasErrors ? 'Some information is missing. Please review.' : undefined
      }
      data-has-errors={hasErrors ? 'true' : undefined}
      bordered
      uswds
    >
      {hasErrors && (
        <va-icon slot="icon" icon="error" class="vads-u-color--secondary" />
      )}
      <Section
        heading="Veteran's service information"
        isEditing={editingSection === serviceKey}
        onEdit={() => onEdit(serviceKey, entry, DD214_SERVICE)}
        onSave={() => onSave(serviceKey, fileIndex, entryIndex, 'dd214')}
        onCancel={onCancel}
        readRows={[
          { label: 'Grade, rate, or rank', value: entry.GRADE_RATE_RANK },
          { label: 'Pay grade', value: entry.PAY_GRADE },
          {
            label: 'Date inducted',
            value: entry.DATE_INDUCTED
              ? formatIsoDate(entry.DATE_INDUCTED)
              : null,
          },
          { label: 'Cause of separation', value: entry.CAUSE_OF_SEPARATION },
          { label: 'Separation type', value: entry.SEPARATION_TYPE },
          { label: 'Separation code', value: entry.SEPARATION_CODE },
          { label: 'Character of service', value: entry.CHARACTER_OF_SERVICE },
        ]}
      >
        <TextField
          field="GRADE_RATE_RANK"
          label="Grade, rate, or rank"
          value={draftValues.GRADE_RATE_RANK}
          error={errors.GRADE_RATE_RANK}
          onInput={onField}
        />
        <SelectField
          field="PAY_GRADE"
          label="Pay grade"
          value={draftValues.PAY_GRADE}
          error={errors.PAY_GRADE}
          options={PAY_GRADE_OPTIONS}
          onChange={onField}
        />
        <DateField
          field="DATE_INDUCTED"
          label="Date inducted"
          value={draftValues.DATE_INDUCTED}
          error={errors.DATE_INDUCTED}
          onDateChange={onDate}
        />
        <TextField
          field="CAUSE_OF_SEPARATION"
          label="Cause of separation"
          value={draftValues.CAUSE_OF_SEPARATION}
          error={errors.CAUSE_OF_SEPARATION}
          onInput={onField}
        />
        <SelectField
          field="SEPARATION_TYPE"
          label="Separation type"
          value={draftValues.SEPARATION_TYPE}
          error={errors.SEPARATION_TYPE}
          options={SEPARATION_TYPE_OPTIONS}
          onChange={onField}
        />
        <ComboField
          field="SEPARATION_CODE"
          label="Separation code"
          value={draftValues.SEPARATION_CODE}
          error={errors.SEPARATION_CODE}
          options={SEPARATION_CODES}
          onChange={onField}
        />
        <ComboField
          field="CHARACTER_OF_SERVICE"
          label="Character of service"
          value={draftValues.CHARACTER_OF_SERVICE}
          error={errors.CHARACTER_OF_SERVICE}
          options={CHARACTER_OF_SERVICE_OPTIONS}
          onChange={onField}
        />
      </Section>
    </va-accordion-item>
  );
};

// ---------------------------------------------------------------------------
// Death certificate accordion item
// Fields in fieldMapping (name, SSN, date of death) are omitted.
// Cause of death B/C/D are optional per the death certificate standard.
// ---------------------------------------------------------------------------
const DeathCertItem = ({
  headline,
  entry,
  fileIndex,
  entryIndex,
  editingSection,
  draftValues,
  errors,
  onEdit,
  onSave,
  onCancel,
  onField,
  onDate,
}) => {
  const deathInfoKey = sectionKey(
    'deathCert',
    fileIndex,
    entryIndex,
    DEATH_DEATH_INFO,
  );
  const hasErrors = entryHasRequiredMissing(entry, 'deathCertificates');

  return (
    <va-accordion-item
      header={headline}
      subheader={
        hasErrors ? 'Some information is missing. Please review.' : undefined
      }
      data-has-errors={hasErrors ? 'true' : undefined}
      bordered
      uswds
    >
      {hasErrors && (
        <va-icon slot="icon" icon="error" class="vads-u-color--secondary" />
      )}
      <Section
        heading="Death information"
        isEditing={editingSection === deathInfoKey}
        onEdit={() => onEdit(deathInfoKey, entry, DEATH_DEATH_INFO)}
        onSave={() =>
          onSave(deathInfoKey, fileIndex, entryIndex, 'deathCertificates')
        }
        onCancel={onCancel}
        readRows={[
          {
            label: 'Disposition date',
            value: entry.DECENDENT_DATE_OF_DISPOSITION
              ? formatIsoDate(entry.DECENDENT_DATE_OF_DISPOSITION)
              : null,
            required: true,
          },
          { label: 'Cause of death A', value: entry.CAUSE_OF_DEATH },
          {
            label: 'Cause of death B',
            value: entry.UNDERLYING_CAUSE_OF_DEATH_B,
            optional: true,
          },
          {
            label: 'Cause of death C',
            value: entry.UNDERLYING_CAUSE_OF_DEATH_C,
            optional: true,
          },
          {
            label: 'Cause of death D',
            value: entry.UNDERLYING_CAUSE_OF_DEATH_D,
            optional: true,
          },
          { label: 'Manner of death', value: entry.MANNER_OF_DEATH },
          {
            label: 'Marital status at time of death',
            value: entry.DECENDENT_MARITAL_STATUS,
            required: true,
          },
        ]}
      >
        <DateField
          field="DECENDENT_DATE_OF_DISPOSITION"
          label="Disposition date"
          value={draftValues.DECENDENT_DATE_OF_DISPOSITION}
          error={errors.DECENDENT_DATE_OF_DISPOSITION}
          onDateChange={onDate}
        />
        <TextField
          field="CAUSE_OF_DEATH"
          label="Cause of death A"
          value={draftValues.CAUSE_OF_DEATH}
          error={errors.CAUSE_OF_DEATH}
          onInput={onField}
        />
        <TextField
          field="UNDERLYING_CAUSE_OF_DEATH_B"
          label="Cause of death B (if applicable)"
          value={draftValues.UNDERLYING_CAUSE_OF_DEATH_B}
          error={errors.UNDERLYING_CAUSE_OF_DEATH_B}
          onInput={onField}
        />
        <TextField
          field="UNDERLYING_CAUSE_OF_DEATH_C"
          label="Cause of death C (if applicable)"
          value={draftValues.UNDERLYING_CAUSE_OF_DEATH_C}
          error={errors.UNDERLYING_CAUSE_OF_DEATH_C}
          onInput={onField}
        />
        <TextField
          field="UNDERLYING_CAUSE_OF_DEATH_D"
          label="Cause of death D (if applicable)"
          value={draftValues.UNDERLYING_CAUSE_OF_DEATH_D}
          error={errors.UNDERLYING_CAUSE_OF_DEATH_D}
          onInput={onField}
        />
        <TextField
          field="MANNER_OF_DEATH"
          label="Manner of death"
          value={draftValues.MANNER_OF_DEATH}
          error={errors.MANNER_OF_DEATH}
          onInput={onField}
        />
        <TextField
          field="DECENDENT_MARITAL_STATUS"
          label="Marital status at time of death"
          value={draftValues.DECENDENT_MARITAL_STATUS}
          error={errors.DECENDENT_MARITAL_STATUS}
          onInput={onField}
        />
      </Section>
    </va-accordion-item>
  );
};

// ---------------------------------------------------------------------------
// Derive section constant from composite key
// ---------------------------------------------------------------------------
const sectionTypeFromKey = key => {
  if (key.endsWith(DD214_SERVICE)) return DD214_SERVICE;
  if (key.endsWith(DEATH_DEATH_INFO)) return DEATH_DEATH_INFO;
  return null;
};

// ---------------------------------------------------------------------------
// Main component
// Standalone wizard page rendered after conflict-resolution steps.
// Iterates all uploaded files and renders one accordion item per artifact.
// goForward / goBack are injected by the forms-system when used as CustomPage.
// ---------------------------------------------------------------------------
const ArtifactReviewAccordion = ({ goForward, goBack }) => {
  const formData = useSelector(state => state?.form?.data ?? {});
  const dispatch = useDispatch();
  const files = formData.files ?? [];

  const [editingSection, setEditingSection] = useState(null);
  const [draftValues, setDraftValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleEdit = (key, entry, section) => {
    setEditingSection(key);
    const draft = extractDraft(entry, section);
    setDraftValues(draft);
    setErrors(validateDraft(draft, section));
  };

  const handleCancel = () => {
    setEditingSection(null);
    setDraftValues({});
    setErrors({});
  };

  const clearFieldError = field =>
    setErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleField = (field, value) => {
    setDraftValues(prev => ({ ...prev, [field]: value }));
    if (value) clearFieldError(field);
  };

  const handleDate = (field, value) => {
    setDraftValues(prev => ({ ...prev, [field]: value }));
    if (value) clearFieldError(field);
  };

  const handleSave = (key, fileIdx, entryIndex, artifactType) => {
    const section = sectionTypeFromKey(key);
    const errs = validateDraft(draftValues, section);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const truncated = truncateDraft(draftValues);

    const updatedFiles = files.map((f, fi) => {
      if (fi !== fileIdx) return f;
      const artifacts = f.idpArtifacts ?? {};
      const entries = artifacts[artifactType] ?? [];
      const updatedEntries = entries.map(
        (e, ei) => (ei === entryIndex ? { ...e, ...truncated } : e),
      );
      return {
        ...f,
        idpArtifacts: { ...artifacts, [artifactType]: updatedEntries },
      };
    });
    dispatch(setData({ ...formData, files: updatedFiles }));
    setEditingSection(null);
    setDraftValues({});
    setErrors({});
  };

  const handleContinue = () => {
    if (pageHasErrors(files)) {
      setSubmitAttempted(true);
      return;
    }
    goForward({ formData });
  };

  const totalDd214Count = files.reduce(
    (sum, f) => sum + (f?.idpArtifacts?.dd214?.length ?? 0),
    0,
  );
  const totalDeathCertCount = files.reduce(
    (sum, f) => sum + (f?.idpArtifacts?.deathCertificates?.length ?? 0),
    0,
  );

  const items = [];
  let dd214Counter = 0;
  let deathCertCounter = 0;

  files.forEach((file, fileIndex) => {
    const artifacts = file?.idpArtifacts;
    if (!artifacts) return;

    (artifacts.dd214 ?? []).forEach((entry, entryIndex) => {
      dd214Counter += 1;
      const dd214Headline =
        totalDd214Count > 1 ? `DD-214 (${dd214Counter})` : 'DD-214';
      items.push(
        <Dd214Item
          key={`dd214-${fileIndex}-${entryIndex}`}
          headline={dd214Headline}
          entry={entry}
          fileIndex={fileIndex}
          entryIndex={entryIndex}
          editingSection={editingSection}
          draftValues={draftValues}
          errors={errors}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onField={handleField}
          onDate={handleDate}
        />,
      );
    });

    (artifacts.deathCertificates ?? []).forEach((entry, entryIndex) => {
      deathCertCounter += 1;
      const deathCertHeadline =
        totalDeathCertCount > 1
          ? `Death Certificate (${deathCertCounter})`
          : 'Death Certificate';
      items.push(
        <DeathCertItem
          key={`deathCert-${fileIndex}-${entryIndex}`}
          headline={deathCertHeadline}
          entry={entry}
          fileIndex={fileIndex}
          entryIndex={entryIndex}
          editingSection={editingSection}
          draftValues={draftValues}
          errors={errors}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onField={handleField}
          onDate={handleDate}
        />,
      );
    });
  });

  const stillHasErrors = submitAttempted && pageHasErrors(files);

  return (
    <div>
      <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--1">
        Review your uploaded documents
      </h3>
      <p className="vads-u-margin-bottom--3">
        Review the information we extracted from your uploaded documents. You
        can edit any fields that need to be corrected before submitting.
      </p>
      {stillHasErrors && (
        <va-alert status="error" uswds class="vads-u-margin-bottom--3">
          <h2 slot="headline">Some documents need attention</h2>
          <p>
            Please review and correct the missing information marked in each
            document before continuing.
          </p>
        </va-alert>
      )}
      {!!items.length && (
        <div className="vads-u-width--full">
          <va-accordion uswds>{items}</va-accordion>
        </div>
      )}
      {goForward && (
        <div className="vads-u-margin-top--4 vads-u-display--flex vads-u-flex-direction--row">
          {goBack && <va-button secondary onClick={goBack} text="Back" uswds />}
          <va-button
            onClick={handleContinue}
            text="Continue"
            uswds
            class="vads-u-margin-left--1"
          />
        </div>
      )}
    </div>
  );
};

export default ArtifactReviewAccordion;
