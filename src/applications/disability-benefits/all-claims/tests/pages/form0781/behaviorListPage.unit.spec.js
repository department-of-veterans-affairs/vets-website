import { expect } from 'chai';
import sinon from 'sinon';
import * as behaviorListPage from '../../../pages/form0781/behaviorListPage';
import { validateBehaviorSelections } from '../../../content/form0781/behaviorListPages';

describe('Behavior List Page', () => {
  it('should define a uiSchema object', () => {
    expect(behaviorListPage.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(behaviorListPage.schema).to.be.an('object');
  });
});

describe('validateBehaviorSelections', () => {
  describe('when selections are invalid', () => {
    it('should add error when selecting none and selecting a behavior', () => {
      const errors = {
        'view:optOut': {
          addError: sinon.spy(),
        },
      };

      const formData = {
        syncModern0781Flow: true,
        workBehaviors: {
          reassignment: true,
          absences: false,
        },
        'view:optOut': { none: true },
      };

      validateBehaviorSelections(errors, formData);
      expect(errors['view:optOut'].addError.called).to.be.true;
    });

    it('should add error when selecting none and selecting a behavior', () => {
      const errors = {
        'view:optOut': {
          addError: sinon.spy(),
        },
      };

      const formData = {
        syncModern0781Flow: true,
        workBehaviors: {
          reassignment: false,
          absences: false,
        },
        unlistedBehaviors: 'another behavior',
        'view:optOut': { none: true },
      };

      validateBehaviorSelections(errors, formData);
      expect(errors['view:optOut'].addError.called).to.be.true;
    });
  });

  describe('when selections are valid', () => {
    it('should add not error when selecting none and with no other selected behaviors', () => {
      const errors = {
        'view:optOut': {
          addError: sinon.spy(),
        },
      };

      const formData = {
        syncModern0781Flow: true,
        workBehaviors: {
          reassignment: false,
          absences: false,
        },
        'view:optOut': { none: true },
      };

      validateBehaviorSelections(errors, formData);
      expect(errors['view:optOut'].addError.called).to.be.false;
    });

    it('should add not error when behaviors are selected and none is unselected', () => {
      const errors = {
        'view:optOut': {
          addError: sinon.spy(),
        },
      };

      const formData = {
        syncModern0781Flow: true,
        workBehaviors: {
          reassignment: false,
          absences: true,
        },
        unlistedBehaviors: 'another behavior',
        'view:optOut': { none: false },
      };

      validateBehaviorSelections(errors, formData);
      expect(errors['view:optOut'].addError.called).to.be.false;
    });
  });
});
