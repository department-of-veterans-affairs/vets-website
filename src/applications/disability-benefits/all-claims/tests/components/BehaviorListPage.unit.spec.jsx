import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import sinon from 'sinon';

import BehaviorListPage from '../../components/BehaviorListPage';
import {
  validateBehaviorSelections,
  showConflictingAlert,
  behaviorListNoneLabel,
} from '../../content/form0781/behaviorListPages';
import {
  BEHAVIOR_LIST_SECTION_SUBTITLES,
  BEHAVIOR_CHANGES_WORK,
  BEHAVIOR_CHANGES_HEALTH,
  BEHAVIOR_CHANGES_OTHER,
} from '../../constants';

describe('BehaviorListPage', () => {
  const page = ({
    data = {},
    goBack = () => {},
    goForward = () => {},
    setFormData = () => {},
  } = {}) => {
    return (
      <div>
        <BehaviorListPage
          setFormData={setFormData}
          data={data}
          goBack={goBack}
          goForward={goForward}
        />
      </div>
    );
  };

  it('should render with all checkboxes', () => {
    const { container } = render(page());

    const checkboxGroups = $$('va-checkbox-group', container);
    expect(checkboxGroups.length).to.equal(4);
    checkboxGroups.forEach(group => {
      const label = group.getAttribute('label');
      expect(Object.values(BEHAVIOR_LIST_SECTION_SUBTITLES)).to.include(label);
    });

    const checkboxes = $$('va-checkbox', container);
    expect(checkboxes.length).to.equal(16);

    const allCheckBoxDescriptions = [
      ...Object.values(BEHAVIOR_CHANGES_WORK),
      ...Object.values(BEHAVIOR_CHANGES_HEALTH),
      ...Object.values(BEHAVIOR_CHANGES_OTHER),
    ];
    allCheckBoxDescriptions.push(behaviorListNoneLabel);

    checkboxes.forEach(checkbox => {
      const label = checkbox.getAttribute('label');
      expect(allCheckBoxDescriptions).to.include(label);
    });
  });

  it('should submit without making a selection', () => {
    const goForwardSpy = sinon.spy();

    const data = {
      syncModern0781Flow: true,
    };

    const { container } = render(page({ data, goForward: goForwardSpy }));

    fireEvent.click($('button[type="submit"]', container));
    expect(goForwardSpy.called).to.be.true;
  });

  it('should submit if valid selections made', () => {
    const goForwardSpy = sinon.spy();

    const data = {
      syncModern0781Flow: true,
      workBehaviors: {
        reassignment: true,
        absences: false,
      },
      otherBehaviors: {
        unlisted: true,
      },
      'view:noneCheckbox': { 'view:noBehaviorChanges': false },
      behaviorsDetails: {
        reassignment: 'details about reassignment',
        unlisted: 'details about unlisted',
      },
    };

    const { container } = render(page({ data, goForward: goForwardSpy }));

    fireEvent.click($('button[type="submit"]', container));
    expect(goForwardSpy.called).to.be.true;
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
          'view:noneCheckbox': { 'view:noBehaviorChanges': true },
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
          'view:noneCheckbox': { 'view:noBehaviorChanges': true },
        };

        validateBehaviorSelections(errors, formData);

        expect(showConflictingAlert(formData)).to.be.false;

        expect(errors.workBehaviors.addError.called).to.be.false;
        expect(errors.healthBehaviors.addError.called).to.be.false;
        expect(errors.otherBehaviors.addError.called).to.be.false;
        expect(errors['view:noneCheckbox'].addError.called).to.be.false;
      });

      it('should not add errors when none is unselected and behaviors are selected', () => {
        const formData = {
          syncModern0781Flow: true,
          workBehaviors: {
            reassignment: false,
            absences: true,
          },
          'view:noneCheckbox': { 'view:noBehaviorChanges': false },
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

  describe('Destructive action modal', () => {
    describe('Show the modal', () => {
      describe('When the user has already added behavioral change details, goes back, then unselects a described behavior type', () => {
        const data = {
          syncModern0781Flow: true,
          workBehaviors: {
            reassignment: true,
            absences: true,
          },
          otherBehaviors: {
            unlisted: false, // this checkbox is unselected
          },
          'view:noneCheckbox': { 'view:noBehaviorChanges': false },
          behaviorsDetails: {
            reassignment: 'details about reassignment',
            unlisted: 'details about unlisted',
          },
        };

        it('displays a prompt to delete the details and prevents the page from submitting', () => {
          const goForwardSpy = sinon.spy();
          const { container } = render(page({ data, goForward: goForwardSpy }));

          fireEvent.click($('button[type="submit"]', container));
          expect($('va-modal[visible="true"]', container)).to.exist;
          expect(goForwardSpy.notCalled).to.be.true;
        });
      });

      describe('When the user has already added behavioral change details, goes back, then unselects ALL described behavior types', () => {
        const data = {
          syncModern0781Flow: true,
          workBehaviors: {
            reassignment: false, // this checkbox is unselected
            absences: false, // this checkbox is unselected
          },
          otherBehaviors: {
            unlisted: false, // this checkbox is unselected
          },
          'view:noneCheckbox': { 'view:noBehaviorChanges': false },
          behaviorsDetails: {
            reassignment: 'details about reassignment',
            unlisted: 'details about unlisted',
          },
        };

        it('displays a prompt to delete the details and prevents the page from submitting', () => {
          const goForwardSpy = sinon.spy();
          const { container } = render(page({ data, goForward: goForwardSpy }));

          fireEvent.click($('button[type="submit"]', container));
          expect($('va-modal[visible="true"]', container)).to.exist;
          expect(goForwardSpy.notCalled).to.be.true;
        });
      });
    });

    describe('Do not show the modal', () => {
      describe('When all behavior details have a selected behavior type', () => {
        const data = {
          syncModern0781Flow: true,
          workBehaviors: {
            reassignment: true,
            absences: true, // this checkbox is selected, but has no optional details
          },
          otherBehaviors: {
            unlisted: true,
          },
          'view:noneCheckbox': { 'view:noBehaviorChanges': false },
          behaviorsDetails: {
            reassignment: 'details about reassignment',
            unlisted: 'details about unlisted',
          },
        };

        it('does not show a prompt and allows submit', () => {
          const goForwardSpy = sinon.spy();
          const { container } = render(page({ data, goForward: goForwardSpy }));

          fireEvent.click($('button[type="submit"]', container));
          expect($('va-modal[visible="false"]', container)).to.exist;
          expect(goForwardSpy.called).to.be.true;
        });
      });
      //   const data = {
      //     syncModern0781Flow: true,
      //     workBehaviors: {
      //       reassignment: false, // this checkbox is unselected
      //       absences: false, // this checkbox is unselected
      //     },
      //     otherBehaviors: {
      //       unlisted: false, // this checkbox is unselected
      //     },
      //     'view:noneCheckbox': { 'view:noBehaviorChanges': false },
      //     behaviorsDetails: {
      //       reassignment: 'details about reassignment',
      //       unlisted: 'details about unlisted',
      //     },
      //   };

      //   it('displays a prompt to delete the details and prevents the page from submitting', () => {
      //     const goForwardSpy = sinon.spy();
      //     const { container } = render(page({ data, goForward: goForwardSpy }));

      //     fireEvent.click($('button[type="submit"]', container));
      //     expect($('va-modal[visible="true"]', container)).to.exist;
      //     expect(goForwardSpy.notCalled).to.be.true;
      //   });
      // });
    });

    describe('Modal Selections', () => {
      const filledOutDataWithBehaviorsDetails = {
        workBehaviors: {
          performance: false, // this checkbox is unselected
        },
        healthBehaviors: {
          appetite: true,
        },
        otherBehaviors: {
          socialEconomic: false, // this checkbox is unselected
        },
        behaviorsDetails: {
          appetite: 'Details of appetite behavior',
          performance: 'Details of performance behavior',
          socialEconomic: 'Details of socialEconomic behavior',
        },
      };

      describe('When the close button is clicked', () => {
        it('closes the modal', () => {
          const { container } = render(
            page({ data: filledOutDataWithBehaviorsDetails }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.closeEvent();
          expect($('va-modal[visible="true"]', container)).not.to.exist;
        });
      });

      describe('When the confirm button is clicked', () => {
        it('closes the modal, deletes behaviorsDetails advances to the next page', () => {
          const setFormDataSpy = sinon.spy();
          const goForwardSpy = sinon.spy();
          const deepClonedData = {
            workBehaviors: {
              performance: false, // this checkbox is unselected
            },
            healthBehaviors: {
              appetite: true,
            },
            otherBehaviors: {
              socialEconomic: false, // this checkbox is unselected
            },
            // unselected behaviorsDetails are removed below
            behaviorsDetails: {
              appetite: 'Details of appetite behavior',
            },
          };

          const { container } = render(
            page({
              data: filledOutDataWithBehaviorsDetails,
              setFormData: setFormDataSpy,
              goForward: goForwardSpy,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.primaryButtonClick();
          expect($('va-modal[visible="true"]', container)).not.to.exist;

          expect(setFormDataSpy.calledWith(deepClonedData)).to.be.true;

          expect(goForwardSpy.called).to.be.true;
        });
      });

      describe('When the cancel button is clicked', () => {
        it('closes the modal, does not delete answered questons and does not advance to the next page', () => {
          const setFormDataSpy = sinon.spy();
          const goForwardSpy = sinon.spy();

          const { container } = render(
            page({
              data: filledOutDataWithBehaviorsDetails,
              setFormData: setFormDataSpy,
              goForward: goForwardSpy,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.secondaryButtonClick();
          expect($('va-modal[visible="true"]', container)).to.not.exist;

          expect(setFormDataSpy.notCalled).to.be.true;
          expect(goForwardSpy.notCalled).to.be.true;
        });
      });
    });
  });
});
