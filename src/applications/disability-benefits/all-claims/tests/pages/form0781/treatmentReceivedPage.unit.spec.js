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
import * as treatmentReceivedPage from '../../../pages/form0781/treatmentReceivedPage';
import {
  treatmentReceivedTitle,
  validateProviders,
  showConflictingAlert,
} from '../../../content/form0781/treatmentReceivedPage';
import {
  TREATMENT_RECEIVED_SUBTITLES,
  TREATMENT_RECEIVED_VA,
  TREATMENT_RECEIVED_NON_VA,
} from '../../../constants';

describe('Treatment Received Page', () => {
  const { schema, uiSchema } = treatmentReceivedPage;

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

    getByText(treatmentReceivedTitle);

    expect($$('va-checkbox-group', container).length).to.equal(3);

    // fail fast - verify the correct number of checkboxes are present
    expect($$('va-checkbox', container).length).to.equal(7);

    // verify subtitles for checkbox sections are present
    Object.values(TREATMENT_RECEIVED_SUBTITLES).forEach(option => {
      expect($$(`va-checkbox[title="${option}"]`, container)).to.exist;
    });

    // verify each checkbox exists with user facing label
    Object.values(TREATMENT_RECEIVED_VA).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(TREATMENT_RECEIVED_NON_VA).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    expect($$(`va-checkbox[label="none"]`, container)).to.exist;
  });
});

describe('validating selections', () => {
  describe('invalid: conflicting selections', () => {
    const errors = {
      'view:treatmentNoneCheckbox': {
        addError: sinon.spy(),
      },
      treatmentReceivedNonVaProvider: { addError: sinon.spy() },
      treatmentReceivedVaProvider: { addError: sinon.spy() },
    };
    it('should show alert and add errors when none and providers are selected', () => {
      const formData = {
        syncModern0781Flow: true,
        treatmentReceivedNonVaProvider: {
          nonVa: true,
          vaCenters: false,
        },
        treatmentReceivedVaProvider: {
          medicalCenter: false,
          communityOutpatient: false,
          vaPaid: false,
          dod: false,
        },
        'view:treatmentNoneCheckbox': { none: true },
      };

      validateProviders(errors, formData);

      // errors
      expect(errors.treatmentReceivedNonVaProvider.addError.called).to.be.true;
      expect(errors.treatmentReceivedVaProvider.addError.called).to.be.false;
      expect(errors['view:treatmentNoneCheckbox'].addError.called).to.be.true;

      // alert
      expect(showConflictingAlert(formData)).to.be.true;
    });
  });

  describe('valid selections', () => {
    const errors = {
      'view:treatmentNoneCheckbox': {
        addError: sinon.spy(),
      },
      treatmentReceivedNonVaProvider: { addError: sinon.spy() },
      treatmentReceivedVaProvider: { addError: sinon.spy() },
    };
    it('should not show alert or add errors when none is selected and with no other selected providers', () => {
      const formData = {
        syncModern0781Flow: true,
        treatmentReceivedNonVaProvider: {
          nonVa: false,
          vaCenters: false,
        },
        'view:treatmentNoneCheckbox': { none: true },
      };

      validateProviders(errors, formData);

      // errors
      expect(errors.treatmentReceivedVaProvider.addError.called).to.be.false;
      expect(errors.treatmentReceivedNonVaProvider.addError.called).to.be.false;
      expect(errors['view:treatmentNoneCheckbox'].addError.called).to.be.false;

      // alert
      expect(showConflictingAlert(formData)).to.be.false;
    });

    it('should not show alert or add errors when none is unselected and providers are selected', () => {
      const formData = {
        syncModern0781Flow: true,
        treatmentReceivedNonVaProvider: {
          nonVa: false,
          vaCenters: true,
        },
        'view:treatmentNoneCheckbox': { none: false },
      };

      validateProviders(errors, formData);

      // errors
      expect(errors.treatmentReceivedVaProvider.addError.called).to.be.false;
      expect(errors.treatmentReceivedNonVaProvider.addError.called).to.be.false;
      expect(errors['view:treatmentNoneCheckbox'].addError.called).to.be.false;

      // alert
      expect(showConflictingAlert(formData)).to.be.false;
    });
  });
});
