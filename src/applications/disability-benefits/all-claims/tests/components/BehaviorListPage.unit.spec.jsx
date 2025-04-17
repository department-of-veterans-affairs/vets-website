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
    onReviewPage = false,
    updatePage = () => {},
  } = {}) => {
    return (
      <div>
        <BehaviorListPage
          setFormData={setFormData}
          data={data}
          goBack={goBack}
          goForward={goForward}
          onReviewPage={onReviewPage}
          updatePage={updatePage}
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
      describe('When the user has already added behavioral change details, deletes the details, goes back, then unselects ALL described behavior types', () => {
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
            reassignment: undefined, // details were provided, then later deleted
            unlisted: undefined, // details were provided, then later deleted
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
    });

    describe('Modal Selections', () => {
      const updatedDataWithBehaviorDetails = {
        workBehaviors: {
          reassignment: true,
          performance: false, // this checkbox is unselected
        },
        healthBehaviors: {
          appetite: true,
          consultations: true,
        },
        otherBehaviors: {
          socialEconomic: false, // this checkbox is unselected
          unlisted: false, // this checkbox is unselected
        },
        behaviorsDetails: {
          appetite: 'Details of appetite behavior',
          performance: 'Details of performance behavior',
          socialEconomic: 'Details of socialEconomic behavior',
        },
      };

      describe('When the confirm button is clicked', () => {
        it('closes the modal, deletes behaviorsDetails, shows a confirmation alert, and does not advance to the next page', () => {
          const setFormDataSpy = sinon.spy();
          const goForwardSpy = sinon.spy();

          const { container } = render(
            page({
              data: updatedDataWithBehaviorDetails,
              setFormData: setFormDataSpy,
              goForward: goForwardSpy,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.primaryButtonClick();
          expect($('va-modal[visible="false"]', container)).to.exist;
          expect($('va-alert[visible="true"]', container)).to.exist;
          expect(goForwardSpy.notCalled).to.be.true;
          expect(setFormDataSpy.called).to.be.true;

          // EXPECTED_UPDATED_DATA_AFTER_EVENT = {
          // workBehaviors: { reassignment: true, performance: false },
          // healthBehaviors: { appetite: true, consultations: true },
          // otherBehaviors: { socialEconomic: false, unlisted: false },
          // behaviorsDetails: { appetite: 'Details of appetite behavior' }
          // };

          expect(setFormDataSpy.args[0][0].workBehaviors).to.deep.equal({
            performance: false,
            reassignment: true,
          });
          expect(setFormDataSpy.args[0][0].healthBehaviors).to.deep.equal({
            appetite: true,
            consultations: true,
          });
          expect(setFormDataSpy.args[0][0].otherBehaviors).to.deep.equal({
            socialEconomic: false,
            unlisted: false,
          });
          expect(setFormDataSpy.args[0][0].behaviorsDetails).to.deep.equal({
            appetite: 'Details of appetite behavior',
          });
        });
      });

      describe('When the close button is clicked', () => {
        it('closes the modal, resets unchecked behavioral types that have details, does not show alert, and does not advance to the next page', () => {
          const setFormDataSpy = sinon.spy();
          const goForwardSpy = sinon.spy();

          const { container } = render(
            page({
              data: updatedDataWithBehaviorDetails,
              setFormData: setFormDataSpy,
              goForward: goForwardSpy,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.closeEvent();

          // EXPECTED_UPDATED_DATA_AFTER_EVENT = {
          // workBehaviors: { reassignment: true, performance: true },
          // healthBehaviors: { appetite: true, consultations: true },
          // otherBehaviors: { socialEconomic: true, unlisted: false },
          // behaviorsDetails: {
          //   appetite: 'Details of appetite behavior',
          //   performance: 'Details of performance behavior',
          //   socialEconomic: 'Details of socialEconomic behavior'
          // }

          expect($('va-modal[visible="false"]', container)).to.exist;
          expect($('va-alert[visible="false"]', container)).to.exist;
          expect(goForwardSpy.notCalled).to.be.true;
          expect(setFormDataSpy.called).to.be.true;

          expect(setFormDataSpy.args[0][0].workBehaviors).to.deep.equal({
            reassignment: true,
            performance: true,
          });
          expect(setFormDataSpy.args[0][0].healthBehaviors).to.deep.equal({
            appetite: true,
            consultations: true,
          });
          expect(setFormDataSpy.args[0][0].otherBehaviors).to.deep.equal({
            socialEconomic: true,
            unlisted: false,
          });
          expect(setFormDataSpy.args[0][0].behaviorsDetails).to.deep.equal({
            appetite: 'Details of appetite behavior',
            performance: 'Details of performance behavior',
            socialEconomic: 'Details of socialEconomic behavior',
          });
        });
      });

      describe('When the cancel button is clicked', () => {
        it('closes the modal, resets checkboxes, does not show alert, and does not advance to the next page', () => {
          const setFormDataSpy = sinon.spy();
          const goForwardSpy = sinon.spy();

          const { container } = render(
            page({
              data: updatedDataWithBehaviorDetails,
              setFormData: setFormDataSpy,
              goForward: goForwardSpy,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.secondaryButtonClick();

          // EXPECTED_UPDATED_DATA_AFTER_EVENT = {
          // workBehaviors: { reassignment: true, performance: true },
          // healthBehaviors: { appetite: true, consultations: true },
          // otherBehaviors: { socialEconomic: true, unlisted: false },
          // behaviorsDetails: {
          //   appetite: 'Details of appetite behavior',
          //   performance: 'Details of performance behavior',
          //   socialEconomic: 'Details of socialEconomic behavior'
          // }

          expect($('va-modal[visible="false"]', container)).to.exist;
          expect(setFormDataSpy.called).to.be.true;
          expect(setFormDataSpy.args[0][0].workBehaviors).to.deep.equal({
            reassignment: true,
            performance: true,
          });
          expect(setFormDataSpy.args[0][0].healthBehaviors).to.deep.equal({
            appetite: true,
            consultations: true,
          });
          expect(setFormDataSpy.args[0][0].otherBehaviors).to.deep.equal({
            socialEconomic: true,
            unlisted: false,
          });
          expect(setFormDataSpy.args[0][0].behaviorsDetails).to.deep.equal({
            appetite: 'Details of appetite behavior',
            performance: 'Details of performance behavior',
            socialEconomic: 'Details of socialEconomic behavior',
          });
        });
      });
    });
  });

  describe('Review and submit page', () => {
    it('should render all checkboxes on review & submit in edit mode', () => {
      const { container } = render(page({ onReviewPage: true }));
      const checkboxGroups = $$('va-checkbox-group', container);
      expect(checkboxGroups.length).to.equal(4);
      checkboxGroups.forEach(group => {
        const label = group.getAttribute('label');
        expect(Object.values(BEHAVIOR_LIST_SECTION_SUBTITLES)).to.include(
          label,
        );
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
    it('should call updatePage on review & submit in edit mode', () => {
      const updateSpy = sinon.spy();
      const { container } = render(
        page({ onReviewPage: true, updatePage: updateSpy }),
      );
      fireEvent.click($('va-button[text="Update page"]', container));
      expect(updateSpy.called).to.be.true;
    });
  });

  describe('Modal Content', () => {
    describe('When less than four behavior details are about to be deleted', () => {
      const threeSelectedChanges = {
        workBehaviors: {
          reassignment: true,
          performance: false, // this checkbox is unselected
        },
        healthBehaviors: {
          appetite: false, // this checkbox is unselected
          consultations: true,
        },
        otherBehaviors: {
          socialEconomic: false, // this checkbox is unselected
        },
        behaviorsDetails: {
          performance: 'Details of performance behavior',
          appetite: 'Details of appetite behavior',
          socialEconomic: 'Details of socialEconomic behavior',
        },
      };

      it('lists all behavior descriptions in the modal content and does not list additional number of behaviors', () => {
        const { container } = render(page({ data: threeSelectedChanges }));

        fireEvent.click($('button[type="submit"]', container));

        const modal = container.querySelector('va-modal');
        const descriptionBullets = $$('li', modal);

        expect(descriptionBullets.length).to.eq(3);
        expect(container.textContent).not.to.contain(
          'And, 0 other behavioral changes',
        );
      });
    });

    describe('When four behavior details are about to be deleted', () => {
      const fourSelectedChanges = {
        workBehaviors: {
          reassignment: false, // this checkbox is unselected
          performance: false, // this checkbox is unselected
        },
        healthBehaviors: {
          appetite: false, // this checkbox is unselected
          consultations: true,
        },
        otherBehaviors: {
          socialEconomic: false, // this checkbox is unselected
        },
        behaviorsDetails: {
          reassignment: 'Details of reassignment behavior',
          performance: 'Details of performance behavior',
          appetite: 'Details of appetite behavior',
          socialEconomic: 'Details of socialEconomic behavior',
        },
      };

      it('lists all four behavior descriptions in the modal content', () => {
        const { container } = render(page({ data: fourSelectedChanges }));

        fireEvent.click($('button[type="submit"]', container));

        const modal = container.querySelector('va-modal');
        const descriptionBullets = $$('li', modal);

        expect(descriptionBullets.length).to.eq(4);
        expect(container.textContent).not.contain(
          'And, 0 other behavioral changes',
        );
      });
    });

    describe('When five or more behavior details are about to be deleted', () => {
      const fiveSelectedChanges = {
        workBehaviors: {
          reassignment: false, // this checkbox is unselected
          performance: false, // this checkbox is unselected
        },
        healthBehaviors: {
          appetite: false, // this checkbox is unselected
          consultations: false, // this checkbox is unselected
        },
        otherBehaviors: {
          socialEconomic: false, // this checkbox is unselected
        },
        behaviorsDetails: {
          reassignment: 'Details of reassignment behavior',
          performance: 'Details of performance behavior',
          appetite: 'Details of appetite behavior',
          consultations: 'Details of consultations behavior',
          socialEconomic: 'Details of socialEconomic behavior',
        },
      };

      it('lists three behavior descriptions in the modal content and a note explaining there are two remaining', () => {
        const { container } = render(page({ data: fiveSelectedChanges }));

        fireEvent.click($('button[type="submit"]', container));

        const modal = container.querySelector('va-modal');
        const descriptionBullets = $$('li', modal);

        expect(descriptionBullets.length).to.eq(4);
        expect(descriptionBullets[3].textContent).to.contain(
          'And, 2 other behavioral changes',
        );
      });
    });
  });
});
