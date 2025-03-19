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
import * as behaviorListPage from '../../../pages/form0781/behaviorListPage';
import {
  validateBehaviorSelections,
  behaviorListPageTitle,
  showConflictingAlert,
} from '../../../content/form0781/behaviorListPages';
import {
  BEHAVIOR_LIST_SECTION_SUBTITLES,
  BEHAVIOR_CHANGES_WORK,
  BEHAVIOR_CHANGES_HEALTH,
  BEHAVIOR_CHANGES_OTHER,
} from '../../../constants';

describe('Behavior List Page', () => {
  const { schema, uiSchema } = behaviorListPage;

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

    getByText(behaviorListPageTitle);

    expect($$('va-checkbox-group', container).length).to.equal(4);

    // fail fast - verify the correct number of checkboxes are present
    expect($$('va-checkbox', container).length).to.equal(16);

    // verify subtitles for checkbox sections are present
    Object.values(BEHAVIOR_LIST_SECTION_SUBTITLES).forEach(option => {
      expect($$(`va-checkbox[title="${option}"]`, container)).to.exist;
    });

    // verify each checkbox exists with user facing label
    Object.values(BEHAVIOR_CHANGES_WORK).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(BEHAVIOR_CHANGES_HEALTH).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(BEHAVIOR_CHANGES_OTHER).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    expect($$(`va-checkbox[label="none"]`, container)).to.exist;
  });
});

describe('validating selections', () => {
  describe('invalid: conflicting selections', () => {
    const errors = {
      'view:noneCheckbox': {
        addError: sinon.spy(),
      },
      workBehaviors: { addError: sinon.spy() },
      healthBehaviors: { addError: sinon.spy() },
      otherBehaviors: { addError: sinon.spy() },
    };
    it('should add error to the none checkbox when none and behaviors are selected', () => {
      const formData = {
        syncModern0781Flow: true,
        workBehaviors: {
          reassignment: true,
          absences: false,
        },
        otherBehaviors: {
          unlisted: true,
        },
        'view:noneCheckbox': { none: true },
      };

      validateBehaviorSelections(errors, formData);

      expect(showConflictingAlert(formData)).to.be.true;

      expect(errors.workBehaviors.addError.called).to.be.false;
      expect(errors.healthBehaviors.addError.called).to.be.false;
      expect(errors.otherBehaviors.addError.called).to.be.false;
      expect(errors['view:noneCheckbox'].addError.called).to.be.true;
    });
  });

  describe('valid selections', () => {
    const errors = {
      'view:noneCheckbox': {
        addError: sinon.spy(),
      },
      workBehaviors: { addError: sinon.spy() },
      healthBehaviors: { addError: sinon.spy() },
      otherBehaviors: { addError: sinon.spy() },
    };
    it('should not add errors when none is selected with no other selected behaviors', () => {
      const formData = {
        syncModern0781Flow: true,
        workBehaviors: {
          reassignment: false,
          absences: false,
        },
        'view:noneCheckbox': { none: true },
      };

      validateBehaviorSelections(errors, formData);

      expect(showConflictingAlert(formData)).to.be.false;

      expect(errors.workBehaviors.addError.called).to.be.false;
      expect(errors.healthBehaviors.addError.called).to.be.false;
      expect(errors.otherBehaviors.addError.called).to.be.false;
      expect(errors['view:noneCheckbox'].addError.called).to.be.false;
    });

    it('should add errors when none is unselected and behaviors are selected', () => {
      const formData = {
        syncModern0781Flow: true,
        workBehaviors: {
          reassignment: false,
          absences: true,
        },
        'view:noneCheckbox': { none: false },
      };

      validateBehaviorSelections(errors, formData);

      expect(showConflictingAlert(formData)).to.be.false;

      expect(errors.workBehaviors.addError.called).to.be.false;
      expect(errors.healthBehaviors.addError.called).to.be.false;
      expect(errors.otherBehaviors.addError.called).to.be.false;
      expect(errors['view:noneCheckbox'].addError.called).to.be.false;
    });
  });
});
