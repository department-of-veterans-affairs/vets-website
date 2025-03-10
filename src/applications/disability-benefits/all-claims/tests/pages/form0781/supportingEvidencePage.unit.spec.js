import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { checkVaCheckbox } from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as supportingEvidencePage from '../../../pages/form0781/supportingEvidencePage';
import {
  validateSupportingEvidenceSelections,
  supportingEvidencePageTitle,
  showConflictingAlert,
} from '../../../content/form0781/supportingEvidencePage';
import {
  SUPPORTING_EVIDENCE_SUBTITLES,
  SUPPORTING_EVIDENCE_REPORT,
  SUPPORTING_EVIDENCE_RECORD,
  SUPPORTING_EVIDENCE_WITNESS,
  SUPPORTING_EVIDENCE_OTHER,
} from '../../../constants';

describe('Supporting Evidence Page', () => {
  const { schema, uiSchema } = supportingEvidencePage;

  it('should define a uiSchema object', () => {
    expect(uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(schema).to.be.an('object');
  });

  it('should submit without making a selection', () => {
    const onSubmit = sinon.spy();

    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );
    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit if selections made', () => {
    const onSubmit = sinon.spy();

    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    const checkboxGroup = $('va-checkbox-group', container);
    checkVaCheckbox(checkboxGroup, 'unlisted');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should render with all checkboxes', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    getByText(supportingEvidencePageTitle);

    expect($$('va-checkbox-group', container).length).to.equal(5);

    // fail fast - verify the correct number of checkboxes are present
    expect($$('va-checkbox', container).length).to.equal(10);

    // verify subtitles for checkbox sections are present
    Object.values(SUPPORTING_EVIDENCE_SUBTITLES).forEach(option => {
      expect($$(`va-checkbox[title="${option}"]`, container)).to.exist;
    });

    // verify each checkbox exists with user facing label
    Object.values(SUPPORTING_EVIDENCE_REPORT).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(SUPPORTING_EVIDENCE_RECORD).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(SUPPORTING_EVIDENCE_WITNESS).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(SUPPORTING_EVIDENCE_OTHER).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    expect($$(`va-checkbox[label="none"]`, container)).to.exist;
  });
});

describe('validating selections', () => {
  describe('invalid: conflicting selections', () => {
    const errors = {
      supportingEvidenceNoneCheckbox: {
        addError: sinon.spy(),
      },
      supportingEvidenceReports: { addError: sinon.spy() },
      supportingEvidenceRecords: { addError: sinon.spy() },
      supportingEvidenceWitness: { addError: sinon.spy() },
      supportingEvidenceOther: { addError: sinon.spy() },
    };
    it('should show alert and add errors when none and supporting evidence is selected', () => {
      const formData = {
        syncModern0781Flow: true,
        supportingEvidenceReports: {
          police: true,
        },
        supportingEvidenceRecords: {
          physicians: false,
          counseling: false,
          crisis: false,
        },
        supportingEvidenceWitness: {
          family: true,
          faculty: true,
          service: false,
          clergy: true,
        },
        supportingEvidenceOther: {
          personal: true,
        },
        supportingEvidenceNoneCheckbox: { none: true },
      };

      validateSupportingEvidenceSelections(errors, formData);

      // errors
      expect(errors.supportingEvidenceReports.addError.called).to.be.true;
      expect(errors.supportingEvidenceRecords.addError.called).to.be.false;
      expect(errors.supportingEvidenceWitness.addError.called).to.be.true;
      expect(errors.supportingEvidenceOther.addError.called).to.be.true;
      expect(errors.supportingEvidenceNoneCheckbox.addError.called).to.be.true;

      // alert
      expect(showConflictingAlert(formData)).to.be.true;
    });
  });

  describe('valid selections', () => {
    const errors = {
      supportingEvidenceNoneCheckbox: {
        addError: sinon.spy(),
      },
      supportingEvidenceReports: { addError: sinon.spy() },
      supportingEvidenceRecords: { addError: sinon.spy() },
      supportingEvidenceWitness: { addError: sinon.spy() },
      supportingEvidenceOther: { addError: sinon.spy() },
    };
    it('should not show alert or add errors when none is selected and with no other selected supporting evidence', () => {
      const formData = {
        syncModern0781Flow: true,
        supportingEvidenceReports: {
          police: false,
        },
        supportingEvidenceNoneCheckbox: { none: true },
      };

      validateSupportingEvidenceSelections(errors, formData);

      // errors
      expect(errors.supportingEvidenceReports.addError.called).to.be.false;
      expect(errors.supportingEvidenceRecords.addError.called).to.be.false;
      expect(errors.supportingEvidenceWitness.addError.called).to.be.false;
      expect(errors.supportingEvidenceOther.addError.called).to.be.false;
      expect(errors.supportingEvidenceNoneCheckbox.addError.called).to.be.false;

      // alert
      expect(showConflictingAlert(formData)).to.be.false;
    });

    it('should not show alert or add errors when none is unselected and supporting evidence is selected', () => {
      const formData = {
        syncModern0781Flow: true,
        supportingEvidenceReports: {
          police: true,
        },
        supportingEvidenceNoneCheckbox: { none: false },
      };

      validateSupportingEvidenceSelections(errors, formData);

      // errors
      expect(errors.supportingEvidenceReports.addError.called).to.be.false;
      expect(errors.supportingEvidenceRecords.addError.called).to.be.false;
      expect(errors.supportingEvidenceWitness.addError.called).to.be.false;
      expect(errors.supportingEvidenceOther.addError.called).to.be.false;
      expect(errors.supportingEvidenceNoneCheckbox.addError.called).to.be.false;

      // alert
      expect(showConflictingAlert(formData)).to.be.false;
    });
  });
});
