import { formatFullName } from '../utils/helpers';
import { formatIsoDate, maskSsn, sanitize } from './transformers/helpers';
import { servicesOptions } from '../utils/labels';

const normalizeName = str =>
  (str || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

// Looks up the human-readable label for a 534 service branch value.
// Falls back to sanitize() for unrecognized values.
const formatBranchLabel = val =>
  servicesOptions.find(o => o.value === val)?.label ?? sanitize(val);

export const VETERAN_INFO_FIELDS = [
  {
    label: 'Veteran name',
    editPath: 'veteran',
    getFormValue: formData => formData.veteranFullName,
    normalize: val => normalizeName(formatFullName(val || {})),
    formatValue: val => formatFullName(val || {}),
    applyToForm: (formData, canonicalValue) => ({
      ...formData,
      veteranFullName: {
        ...(formData.veteranFullName || {}),
        ...canonicalValue,
      },
    }),
    artifacts: [
      {
        artifactKey: 'dd214',
        docTypeLabel: 'DD-214',
        getArtifactValue: entry =>
          entry.FIRST_NAME || entry.LAST_NAME
            ? {
                first: entry.FIRST_NAME || '',
                middle: entry.MIDDLE_NAME || '',
                last: entry.LAST_NAME || '',
                suffix: entry.SUFFIX || '',
              }
            : null,
        formatArtifactValue: val => formatFullName(val || {}),
        setArtifactValue: (entry, canonicalValue) => ({
          ...entry,
          FIRST_NAME: canonicalValue.first || '',
          MIDDLE_NAME: canonicalValue.middle || '',
          LAST_NAME: canonicalValue.last || '',
          SUFFIX: canonicalValue.suffix || '',
        }),
      },
      {
        artifactKey: 'deathCertificates',
        docTypeLabel: 'death certificate',
        getArtifactValue: entry =>
          entry.FIRST_NAME || entry.LAST_NAME
            ? {
                first: entry.FIRST_NAME || '',
                middle: entry.MIDDLE_NAME || '',
                last: entry.LAST_NAME || '',
                suffix: entry.SUFFIX || '',
              }
            : null,
        formatArtifactValue: val => formatFullName(val || {}),
        setArtifactValue: (entry, canonicalValue) => ({
          ...entry,
          FIRST_NAME: canonicalValue.first || '',
          MIDDLE_NAME: canonicalValue.middle || '',
          LAST_NAME: canonicalValue.last || '',
          SUFFIX: canonicalValue.suffix || '',
        }),
      },
    ],
  },
  {
    label: 'Social Security number',
    editPath: 'veteran-identification',
    getFormValue: formData => formData.veteranSocialSecurityNumber?.ssn,
    // Both form and artifacts store bare 9 digits (schema: "^[0-9]{9}$").
    normalize: val => val || '',
    formatValue: val => maskSsn(val),
    // canonicalValue is bare 9 digits; write it as-is to match the schema pattern.
    applyToForm: (formData, canonicalValue) => ({
      ...formData,
      veteranSocialSecurityNumber: {
        ...(formData.veteranSocialSecurityNumber || {}),
        ssn: canonicalValue || '',
      },
    }),
    artifacts: [
      {
        artifactKey: 'dd214',
        docTypeLabel: 'DD-214',
        // normalizeSections already produced a bare 9-digit string or null
        getArtifactValue: entry => entry.SOCIAL_SECURITY_NUMBER || null,
        // Format bare digits with dashes for display consistency with form
        formatArtifactValue: val =>
          maskSsn((val || '').replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')),
        // Strip dashes when writing form value (NNN-NN-NNNN) back to artifact
        setArtifactValue: (entry, canonicalValue) => ({
          ...entry,
          SOCIAL_SECURITY_NUMBER: (canonicalValue || '').replace(/\D/g, ''),
        }),
      },
      {
        artifactKey: 'deathCertificates',
        docTypeLabel: 'death certificate',
        getArtifactValue: entry => entry.SOCIAL_SECURITY_NUMBER || null,
        formatArtifactValue: val =>
          maskSsn((val || '').replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')),
        setArtifactValue: (entry, canonicalValue) => ({
          ...entry,
          SOCIAL_SECURITY_NUMBER: (canonicalValue || '').replace(/\D/g, ''),
        }),
      },
    ],
  },
  {
    label: 'Date of birth',
    editPath: 'veteran',
    getFormValue: formData => formData.veteranDateOfBirth,
    // Both form and artifact use ISO YYYY-MM-DD after normalization.
    normalize: val => val || '',
    formatValue: val => formatIsoDate(val),
    applyToForm: (formData, canonicalValue) => ({
      ...formData,
      veteranDateOfBirth: canonicalValue,
    }),
    artifacts: [
      {
        artifactKey: 'dd214',
        docTypeLabel: 'DD-214',
        // normalizeSections already converted MM-DD-YYYY → ISO
        getArtifactValue: entry => entry.DATE_OF_BIRTH || null,
        formatArtifactValue: val => formatIsoDate(val),
        setArtifactValue: (entry, canonicalValue) => ({
          ...entry,
          DATE_OF_BIRTH: canonicalValue,
        }),
      },
    ],
  },
  {
    label: 'Date of death',
    editPath: 'veteran-additional-information',
    getFormValue: formData => formData.veteranDateOfDeath,
    normalize: val => val || '',
    formatValue: val => formatIsoDate(val),
    applyToForm: (formData, canonicalValue) => ({
      ...formData,
      veteranDateOfDeath: canonicalValue,
    }),
    artifacts: [
      {
        artifactKey: 'deathCertificates',
        docTypeLabel: 'death certificate',
        getArtifactValue: entry => entry.DATE_OF_DEATH || null,
        formatArtifactValue: val => formatIsoDate(val),
        setArtifactValue: (entry, canonicalValue) => ({
          ...entry,
          DATE_OF_DEATH: canonicalValue,
        }),
      },
    ],
  },
];

export const MILITARY_HISTORY_FIELDS = [
  {
    label: 'Branch of service',
    editPath: 'service-period',
    getFormValue: formData => formData.serviceBranch,
    // Both form and artifact are 534 values ('army', 'airForce', etc.) after
    // normalization, so exact match is sufficient.
    normalize: val => val || '',
    formatValue: val => formatBranchLabel(val),
    applyToForm: (formData, canonicalValue) => ({
      ...formData,
      serviceBranch: canonicalValue,
    }),
    artifacts: [
      {
        artifactKey: 'dd214',
        docTypeLabel: 'DD-214',
        // normalizeSections mapped the IDP string to a 534 value
        getArtifactValue: entry => entry.BRANCH_OF_SERVICE || null,
        formatArtifactValue: val => formatBranchLabel(val),
        setArtifactValue: (entry, canonicalValue) => ({
          ...entry,
          BRANCH_OF_SERVICE: canonicalValue,
        }),
      },
    ],
  },
  {
    label: 'Date entered active service',
    editPath: 'service-period',
    getFormValue: formData => formData.activeServiceDateRange?.from,
    normalize: val => val || '',
    formatValue: val => formatIsoDate(val),
    applyToForm: (formData, canonicalValue) => ({
      ...formData,
      activeServiceDateRange: {
        ...(formData.activeServiceDateRange || {}),
        from: canonicalValue,
      },
    }),
    artifacts: [
      {
        artifactKey: 'dd214',
        docTypeLabel: 'DD-214',
        getArtifactValue: entry => entry.DATE_ENTERED_ACTIVE_SERVICE || null,
        formatArtifactValue: val => formatIsoDate(val),
        setArtifactValue: (entry, canonicalValue) => ({
          ...entry,
          DATE_ENTERED_ACTIVE_SERVICE: canonicalValue,
        }),
      },
    ],
  },
  {
    label: 'Date separated from service',
    editPath: 'service-period',
    getFormValue: formData => formData.activeServiceDateRange?.to,
    normalize: val => val || '',
    formatValue: val => formatIsoDate(val),
    applyToForm: (formData, canonicalValue) => ({
      ...formData,
      activeServiceDateRange: {
        ...(formData.activeServiceDateRange || {}),
        to: canonicalValue,
      },
    }),
    artifacts: [
      {
        artifactKey: 'dd214',
        docTypeLabel: 'DD-214',
        getArtifactValue: entry => entry.DATE_SEPARATED_ACTIVE_SERVICE || null,
        formatArtifactValue: val => formatIsoDate(val),
        setArtifactValue: (entry, canonicalValue) => ({
          ...entry,
          DATE_SEPARATED_ACTIVE_SERVICE: canonicalValue,
        }),
      },
    ],
  },
];
