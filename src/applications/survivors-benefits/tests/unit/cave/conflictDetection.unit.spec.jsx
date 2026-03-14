import { expect } from 'chai';
import {
  buildConflicts,
  autoResolveArtifacts,
  applyToAllArtifacts,
  resolveField,
  hasConflicts,
} from '../../../cave/utils/conflictDetection';

// ---------------------------------------------------------------------------
// Minimal field definition factory for testing
// ---------------------------------------------------------------------------

const makeField = (overrides = {}) => ({
  label: 'Test field',
  getFormValue: formData => formData.testValue,
  normalize: val => (val || '').toLowerCase().trim(),
  formatValue: val => val || '',
  applyToForm: (formData, canonicalValue) => ({
    ...formData,
    testValue: canonicalValue,
  }),
  artifacts: [
    {
      artifactKey: 'dd214',
      docTypeLabel: 'DD-214',
      getArtifactValue: entry => entry.TEST_FIELD || null,
      setArtifactValue: (entry, canonicalValue) => ({
        ...entry,
        TEST_FIELD: canonicalValue,
      }),
    },
  ],
  ...overrides,
});

// Builds a file object with idpArtifacts
const makeFile = (dd214Entries = [], name = 'test.pdf', key = 'key-1') => ({
  name,
  idpTrackingKey: key,
  idpArtifacts: {
    dd214: dd214Entries,
  },
});

// ---------------------------------------------------------------------------
// buildConflicts
// ---------------------------------------------------------------------------

describe('cave/utils/conflictDetection — buildConflicts', () => {
  it('returns empty array when there are no files', () => {
    const formData = { testValue: 'army' };
    const result = buildConflicts(formData, [], [makeField()]);
    expect(result).to.deep.equal([]);
  });

  it('returns empty array when form value is blank', () => {
    const formData = { testValue: '' };
    const file = makeFile([{ TEST_FIELD: 'navy' }]);
    const result = buildConflicts(formData, [file], [makeField()]);
    expect(result).to.deep.equal([]);
  });

  it('returns empty array when form value is null', () => {
    const formData = { testValue: null };
    const file = makeFile([{ TEST_FIELD: 'navy' }]);
    const result = buildConflicts(formData, [file], [makeField()]);
    expect(result).to.deep.equal([]);
  });

  it('returns empty array when artifact value matches form value (after normalize)', () => {
    const formData = { testValue: 'Army' };
    const file = makeFile([{ TEST_FIELD: 'army' }]);
    const result = buildConflicts(formData, [file], [makeField()]);
    expect(result).to.deep.equal([]);
  });

  it('returns empty array when artifact value is null', () => {
    const formData = { testValue: 'army' };
    const file = makeFile([{ TEST_FIELD: null }]);
    const result = buildConflicts(formData, [file], [makeField()]);
    expect(result).to.deep.equal([]);
  });

  it('returns empty array when artifact entry has no value for the field', () => {
    const formData = { testValue: 'army' };
    const file = makeFile([{}]);
    const result = buildConflicts(formData, [file], [makeField()]);
    expect(result).to.deep.equal([]);
  });

  it('detects a conflict when artifact differs from form', () => {
    const formData = { testValue: 'army' };
    const file = makeFile([{ TEST_FIELD: 'navy' }]);
    const result = buildConflicts(formData, [file], [makeField()]);
    expect(result).to.have.length(1);
    expect(result[0].label).to.equal('Test field');
    expect(result[0].formValue).to.equal('army');
  });

  it('includes artifactOptions with rawValue and displayValue', () => {
    const formData = { testValue: 'army' };
    const file = makeFile([{ TEST_FIELD: 'navy' }]);
    const result = buildConflicts(formData, [file], [makeField()]);
    expect(result[0].artifactOptions).to.have.length(1);
    expect(result[0].artifactOptions[0].rawValue).to.equal('navy');
  });

  it('includes sourceFiles in each artifact option', () => {
    const formData = { testValue: 'army' };
    const file = makeFile([{ TEST_FIELD: 'navy' }], 'dd214.pdf', 'key-abc');
    const result = buildConflicts(formData, [file], [makeField()]);
    const sources = result[0].artifactOptions[0].sourceFiles;
    expect(sources).to.have.length(1);
    expect(sources[0].fileName).to.equal('dd214.pdf');
    expect(sources[0].trackingKey).to.equal('key-abc');
  });

  it('deduplicates artifact options with the same normalized value from multiple entries', () => {
    const formData = { testValue: 'army' };
    // Two entries in the same file both say 'navy' — should produce one option
    const file = makeFile([{ TEST_FIELD: 'navy' }, { TEST_FIELD: 'Navy' }]);
    const result = buildConflicts(formData, [file], [makeField()]);
    expect(result[0].artifactOptions).to.have.length(1);
  });

  it('deduplicates source files for the same tracking key', () => {
    const formData = { testValue: 'army' };
    const file1 = makeFile([{ TEST_FIELD: 'navy' }], 'a.pdf', 'same-key');
    const file2 = makeFile([{ TEST_FIELD: 'navy' }], 'a.pdf', 'same-key');
    const result = buildConflicts(formData, [file1, file2], [makeField()]);
    expect(result[0].artifactOptions[0].sourceFiles).to.have.length(1);
  });

  it('produces two options when two files have different conflicting values', () => {
    const formData = { testValue: 'army' };
    const file1 = makeFile([{ TEST_FIELD: 'navy' }], 'a.pdf', 'key-1');
    const file2 = makeFile([{ TEST_FIELD: 'air force' }], 'b.pdf', 'key-2');
    const result = buildConflicts(formData, [file1, file2], [makeField()]);
    expect(result[0].artifactOptions).to.have.length(2);
  });

  it('handles files without idpArtifacts gracefully', () => {
    const formData = { testValue: 'army' };
    const file = { name: 'no-idp.pdf', idpTrackingKey: 'k' };
    const result = buildConflicts(formData, [file], [makeField()]);
    expect(result).to.deep.equal([]);
  });

  it('reports conflicts for multiple field definitions independently', () => {
    const field1 = makeField({
      label: 'Field 1',
      getFormValue: d => d.val1,
      applyToForm: (d, v) => ({ ...d, val1: v }),
      artifacts: [
        {
          artifactKey: 'dd214',
          docTypeLabel: 'DD-214',
          getArtifactValue: e => e.F1 || null,
          setArtifactValue: (e, v) => ({ ...e, F1: v }),
        },
      ],
    });
    const field2 = makeField({
      label: 'Field 2',
      getFormValue: d => d.val2,
      applyToForm: (d, v) => ({ ...d, val2: v }),
      artifacts: [
        {
          artifactKey: 'dd214',
          docTypeLabel: 'DD-214',
          getArtifactValue: e => e.F2 || null,
          setArtifactValue: (e, v) => ({ ...e, F2: v }),
        },
      ],
    });
    const formData = { val1: 'a', val2: 'b' };
    const file = {
      name: 'f.pdf',
      idpTrackingKey: 'k',
      idpArtifacts: { dd214: [{ F1: 'x', F2: 'y' }] },
    };
    const result = buildConflicts(formData, [file], [field1, field2]);
    expect(result).to.have.length(2);
  });
});

// ---------------------------------------------------------------------------
// autoResolveArtifacts
// ---------------------------------------------------------------------------

describe('cave/utils/conflictDetection — autoResolveArtifacts', () => {
  it('returns same reference when files is null/empty', () => {
    const result = autoResolveArtifacts({}, null, [makeField()]);
    expect(result).to.be.null;
  });

  it('returns same reference when files array is empty', () => {
    const files = [];
    const result = autoResolveArtifacts({}, files, [makeField()]);
    expect(result).to.equal(files);
  });

  it('returns same reference when nothing changes', () => {
    const formData = { testValue: 'army' };
    const file = makeFile([{ TEST_FIELD: 'navy' }]);
    const files = [file];
    // artifact already has a valid value, so no auto-fill happens
    const result = autoResolveArtifacts(formData, files, [makeField()]);
    expect(result).to.equal(files);
  });

  it('fills a null artifact field from form data', () => {
    const formData = { testValue: 'army' };
    const file = makeFile([{ TEST_FIELD: null }]);
    const result = autoResolveArtifacts(formData, [file], [makeField()]);
    expect(result[0].idpArtifacts.dd214[0].TEST_FIELD).to.equal('army');
  });

  it('does not overwrite an artifact field that already has a valid value', () => {
    const formData = { testValue: 'army' };
    const file = makeFile([{ TEST_FIELD: 'navy' }]);
    const result = autoResolveArtifacts(formData, [file], [makeField()]);
    // 'navy' is valid, so it should not be overwritten
    expect(result[0].idpArtifacts.dd214[0].TEST_FIELD).to.equal('navy');
  });

  it('does not fill when form value is falsy', () => {
    const formData = { testValue: '' };
    const file = makeFile([{ TEST_FIELD: null }]);
    const result = autoResolveArtifacts(formData, [file], [makeField()]);
    expect(result[0].idpArtifacts.dd214[0].TEST_FIELD).to.be.null;
  });

  it('returns a new array reference when something changes', () => {
    const formData = { testValue: 'army' };
    const file = makeFile([{ TEST_FIELD: null }]);
    const files = [file];
    const result = autoResolveArtifacts(formData, files, [makeField()]);
    expect(result).to.not.equal(files);
  });

  it('skips files without idpArtifacts', () => {
    const formData = { testValue: 'army' };
    const file = { name: 'no-idp.pdf', idpTrackingKey: 'k' };
    const files = [file];
    const result = autoResolveArtifacts(formData, files, [makeField()]);
    expect(result).to.equal(files);
  });
});

// ---------------------------------------------------------------------------
// applyToAllArtifacts
// ---------------------------------------------------------------------------

describe('cave/utils/conflictDetection — applyToAllArtifacts', () => {
  it('returns empty array for null/undefined files', () => {
    expect(applyToAllArtifacts(null, makeField(), 'army')).to.deep.equal([]);
    expect(applyToAllArtifacts(undefined, makeField(), 'army')).to.deep.equal(
      [],
    );
  });

  it('applies the canonical value to all entries across all files', () => {
    const files = [
      makeFile([{ TEST_FIELD: 'navy' }, { TEST_FIELD: 'air force' }]),
      makeFile([{ TEST_FIELD: 'marines' }], 'b.pdf', 'key-2'),
    ];
    const result = applyToAllArtifacts(files, makeField(), 'army');
    expect(result[0].idpArtifacts.dd214[0].TEST_FIELD).to.equal('army');
    expect(result[0].idpArtifacts.dd214[1].TEST_FIELD).to.equal('army');
    expect(result[1].idpArtifacts.dd214[0].TEST_FIELD).to.equal('army');
  });

  it('skips files without idpArtifacts', () => {
    const file = { name: 'no-idp.pdf', idpTrackingKey: 'k' };
    const result = applyToAllArtifacts([file], makeField(), 'army');
    expect(result[0]).to.not.have.property('idpArtifacts');
  });

  it('returns new file objects (does not mutate originals)', () => {
    const files = [makeFile([{ TEST_FIELD: 'navy' }])];
    const result = applyToAllArtifacts(files, makeField(), 'army');
    expect(result[0]).to.not.equal(files[0]);
    expect(files[0].idpArtifacts.dd214[0].TEST_FIELD).to.equal('navy');
  });
});

// ---------------------------------------------------------------------------
// resolveField
// ---------------------------------------------------------------------------

describe('cave/utils/conflictDetection — resolveField', () => {
  const field = makeField();

  it('keeps form data unchanged when choice is "form"', () => {
    const formData = { testValue: 'army' };
    const files = [makeFile([{ TEST_FIELD: 'navy' }])];
    const { formData: nextFormData } = resolveField(
      formData,
      files,
      field,
      'form',
    );
    expect(nextFormData).to.equal(formData);
  });

  it('updates all artifact entries when choice is "form"', () => {
    const formData = { testValue: 'army' };
    const files = [makeFile([{ TEST_FIELD: 'navy' }])];
    const { files: nextFiles } = resolveField(formData, files, field, 'form');
    expect(nextFiles[0].idpArtifacts.dd214[0].TEST_FIELD).to.equal('army');
  });

  it('updates form data when choice is an artifact rawValue', () => {
    const formData = { testValue: 'army' };
    const files = [makeFile([{ TEST_FIELD: 'navy' }])];
    const choice = { rawValue: 'navy' };
    const { formData: nextFormData } = resolveField(
      formData,
      files,
      field,
      choice,
    );
    expect(nextFormData.testValue).to.equal('navy');
  });

  it('updates artifact entries when choice is an artifact rawValue', () => {
    const formData = { testValue: 'army' };
    const files = [
      makeFile([{ TEST_FIELD: 'coast guard' }], 'a.pdf', 'k1'),
      makeFile([{ TEST_FIELD: 'navy' }], 'b.pdf', 'k2'),
    ];
    const choice = { rawValue: 'navy' };
    const { files: nextFiles } = resolveField(formData, files, field, choice);
    expect(nextFiles[0].idpArtifacts.dd214[0].TEST_FIELD).to.equal('navy');
    expect(nextFiles[1].idpArtifacts.dd214[0].TEST_FIELD).to.equal('navy');
  });
});

// ---------------------------------------------------------------------------
// hasConflicts
// ---------------------------------------------------------------------------

describe('cave/utils/conflictDetection — hasConflicts', () => {
  it('returns false when there are no files', () => {
    const formData = { testValue: 'army', files: [] };
    expect(hasConflicts(formData, [makeField()])).to.be.false;
  });

  it('returns false when artifact matches form', () => {
    const file = makeFile([{ TEST_FIELD: 'army' }]);
    const formData = { testValue: 'army', files: [file] };
    expect(hasConflicts(formData, [makeField()])).to.be.false;
  });

  it('returns false when formData.files is undefined', () => {
    const formData = { testValue: 'army' };
    expect(hasConflicts(formData, [makeField()])).to.be.false;
  });

  it('returns true when artifact differs from form', () => {
    const file = makeFile([{ TEST_FIELD: 'navy' }]);
    const formData = { testValue: 'army', files: [file] };
    expect(hasConflicts(formData, [makeField()])).to.be.true;
  });

  it('returns false when form value is blank (no conflict possible)', () => {
    const file = makeFile([{ TEST_FIELD: 'navy' }]);
    const formData = { testValue: '', files: [file] };
    expect(hasConflicts(formData, [makeField()])).to.be.false;
  });
});
