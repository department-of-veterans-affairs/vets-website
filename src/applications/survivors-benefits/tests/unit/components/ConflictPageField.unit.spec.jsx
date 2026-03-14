import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import createConflictPageField from '../../../components/ConflictPageField';
import {
  VETERAN_INFO_FIELDS,
  MILITARY_HISTORY_FIELDS,
} from '../../../cave/fieldMapping';

// ---------------------------------------------------------------------------
// Store factory
// ---------------------------------------------------------------------------
const makeStore = (formData = {}) =>
  createStore(() => ({ form: { data: formData } }));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

// No conflicts: form name matches artifact name
const noConflictData = {
  veteranFullName: { first: 'John', last: 'Smith', middle: '', suffix: '' },
  files: [],
};

// Conflict: form name ≠ artifact name
const conflictData = {
  veteranFullName: { first: 'John', last: 'Smith', middle: '', suffix: '' },
  files: [
    {
      name: 'dd214.pdf',
      idpTrackingKey: 'track-1',
      idpArtifacts: {
        dd214: [
          {
            VETERAN_NAME: {
              first: 'Jane',
              last: 'Doe',
              middle: '',
              suffix: '',
            },
          },
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Test helper
// ---------------------------------------------------------------------------
const renderField = (fieldGroup, formData, emptyMessage = 'No conflicts.') => {
  const FieldComponent = createConflictPageField(fieldGroup, emptyMessage);
  return render(
    <Provider store={makeStore(formData)}>
      <FieldComponent />
    </Provider>,
  );
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('createConflictPageField', () => {
  afterEach(cleanup);

  it('returns a function (component factory)', () => {
    const result = createConflictPageField(
      VETERAN_INFO_FIELDS,
      'No conflicts.',
    );
    expect(result).to.be.a('function');
  });

  describe('when there are no conflicts', () => {
    it('renders the emptyMessage paragraph', () => {
      const { container } = renderField(
        VETERAN_INFO_FIELDS,
        noConflictData,
        'No veteran info conflicts found.',
      );
      expect(container.querySelector('p').textContent).to.equal(
        'No veteran info conflicts found.',
      );
    });

    it('does not render a va-radio', () => {
      const { container } = renderField(VETERAN_INFO_FIELDS, noConflictData);
      expect(container.querySelector('va-radio')).to.not.exist;
    });
  });

  describe('when there are conflicts', () => {
    it('renders a va-radio for the conflicting field', () => {
      const { container } = renderField(VETERAN_INFO_FIELDS, conflictData);
      expect(container.querySelector('va-radio')).to.exist;
    });

    it('labels the va-radio with the field label', () => {
      const { container } = renderField(VETERAN_INFO_FIELDS, conflictData);
      const radio = container.querySelector('va-radio');
      expect(radio.getAttribute('label')).to.equal('Veteran name');
    });

    it('renders a "form" option showing the value entered by the user', () => {
      const { container } = renderField(VETERAN_INFO_FIELDS, conflictData);
      const formOption = container.querySelector(
        'va-radio-option[value="form"]',
      );
      expect(formOption).to.exist;
      expect(formOption.getAttribute('label')).to.include('entered by you');
    });

    it('renders an artifact option showing the extracted value', () => {
      const { container } = renderField(VETERAN_INFO_FIELDS, conflictData);
      const artifactOption = container.querySelector(
        'va-radio-option[value="0"]',
      );
      expect(artifactOption).to.exist;
      expect(artifactOption.getAttribute('label')).to.include('found in');
    });

    it('does not render the emptyMessage', () => {
      const { container } = renderField(
        VETERAN_INFO_FIELDS,
        conflictData,
        'No conflicts.',
      );
      expect(container.textContent).to.not.include('No conflicts.');
    });

    it('renders an edit link for the conflicting field', () => {
      const { container } = renderField(VETERAN_INFO_FIELDS, conflictData);
      const link = container.querySelector('a');
      expect(link).to.exist;
      expect(link.textContent.toLowerCase()).to.include('edit');
    });
  });

  describe('with MILITARY_HISTORY_FIELDS and no conflicts', () => {
    it('renders emptyMessage when no service-branch conflict', () => {
      const data = {
        serviceBranch: 'army',
        files: [],
      };
      const { container } = renderField(
        MILITARY_HISTORY_FIELDS,
        data,
        'No military history conflicts.',
      );
      expect(container.textContent).to.include(
        'No military history conflicts.',
      );
    });
  });
});
