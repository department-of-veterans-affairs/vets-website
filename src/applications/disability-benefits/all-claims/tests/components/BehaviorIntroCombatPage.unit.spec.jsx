import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import sinon from 'sinon';
import BehaviorIntroCombatPage, {
  missingSelectionErrorMessage,
} from '../../components/BehaviorIntroCombatPage';
import {
  BEHAVIOR_CHANGES_HEALTH,
  BEHAVIOR_CHANGES_WORK,
} from '../../constants';

describe('BehaviorIntroCombatPage', () => {
  const page = ({
    data = {},
    goBack = () => {},
    goForward = () => {},
    setFormData = () => {},
  } = {}) => {
    return (
      <div>
        <BehaviorIntroCombatPage
          setFormData={setFormData}
          data={data}
          goBack={goBack}
          goForward={goForward}
        />
      </div>
    );
  };

  // it('should render with two radio selections', () => {
  //   const { container } = render(page());
  //   expect($$('va-radio-option', container).length).to.eq(2);
  // });

  describe('Answer Behavioral Questions selection', () => {
    describe('Opting in to answering behavioral questions', () => {
      // it('should advance to the next page', () => {
      //   const goForwardSpy = sinon.spy();

      //   const data = {
      //     'view:answerCombatBehaviorQuestions': 'true',
      //   };

      //   const { container } = render(page({ data, goForward: goForwardSpy }));

      //   fireEvent.click($('button[type="submit"]', container));
      //   expect(goForwardSpy.called).to.be.true;
      // });
    });

    describe('Opting out of answering behavioral questions', () => {
      // it('should advance to the next page', () => {
      //   const goForwardSpy = sinon.spy();

      //   const data = {
      //     'view:answerCombatBehaviorQuestions': 'false',
      //   };

      //   const { container } = render(page({ data, goForward: goForwardSpy }));

      //   fireEvent.click($('button[type="submit"]', container));
      //   expect(goForwardSpy.called).to.be.true;
      // });
    });

    describe('Validations', () => {
      // it('raises an error if a selection is not made and does not advance', () => {
      //   const goForwardSpy = sinon.spy();
      //   const { container } = render(
      //     page({ data: {}, goForward: goForwardSpy }),
      //   );

      //   fireEvent.click($('button[type="submit"]', container));

      //   expect($('va-radio', container).error).to.contain(
      //     missingSelectionErrorMessage,
      //   );

      //   expect(goForwardSpy.notCalled).to.be.true;
      // });
    });

    describe('Delete already declared behavioral changes modal', () => {
      describe('When the user has already declared behavioral changes, changes the selection to opt out and clicks continue', () => {
        const data = {
          'view:answerCombatBehaviorQuestions': 'false',
          healthBehaviors: {
            appetite: true,
          },
        };

        // it('displays a prompt to delete the answers and prevents the page from submitting', () => {
        //   const goForwardSpy = sinon.spy();
        //   const { container } = render(page({ data, goForward: goForwardSpy }));

        //   fireEvent.click($('button[type="submit"]', container));
        //   expect($('va-modal[visible="true"]', container)).to.exist;
        //   expect(goForwardSpy.notCalled).to.be.true;
        // });
      });

      describe('When the user has already declared behavioral changes, is opted in and clicks continue', () => {
        const data = {
          'view:answerCombatBehaviorQuestions': 'true',
          healthBehaviors: {
            appetite: true,
          },
        };

        // it('does not display a prompt to delete the answers and prevent the page from submitting', () => {
        //   const goForwardSpy = sinon.spy();
        //   const { container } = render(page({ data, goForward: goForwardSpy }));

        //   fireEvent.click($('button[type="submit"]', container));
        //   expect($('va-modal[visible="true"]', container)).not.to.exist;
        //   expect(goForwardSpy.called).to.be.true;
        // });
      });

      describe('Modal Content', () => {
        describe('When the user has previously claimed up to four behavioral changes on the Behavioral List page', () => {
          const fourSelectedChangesAndOptOut = {
            'view:answerCombatBehaviorQuestions': 'false',
            workBehaviors: {
              performance: true,
              reassignment: true,
              absences: true,
            },
            healthBehaviors: {
              appetite: true,
            },
          };

          it('lists all four behavior descriptions in the modal content', () => {
            const { container } = render(
              page({ data: fourSelectedChangesAndOptOut }),
            );

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');

            const descriptionBullets = $$('li', modal);
            expect(descriptionBullets.length).to.eq(4);

            expect(descriptionBullets[0].textContent).to.contain(
              BEHAVIOR_CHANGES_WORK.performance,
            );
            expect(descriptionBullets[1].textContent).to.contain(
              BEHAVIOR_CHANGES_WORK.reassignment,
            );
            expect(descriptionBullets[2].textContent).to.contain(
              BEHAVIOR_CHANGES_WORK.absences,
            );
            expect(descriptionBullets[3].textContent).to.contain(
              BEHAVIOR_CHANGES_HEALTH.appetite,
            );
          });
        });

        describe('When the user has previously claimed five or more behavioral changes on the Behavioral List page', () => {
          const fiveSelectedChangesAndOptOut = {
            'view:answerCombatBehaviorQuestions': 'false',
            workBehaviors: {
              performance: true,
              reassignment: true,
              absences: true,
            },
            healthBehaviors: {
              appetite: true,
              screenings: true,
            },
          };

          // Fix first use case firstx
          // it('lists three behavior descriptions in the modal content and a note explaining there are two remaining', () => {
          //   const { container } = render(
          //     page({ data: fiveSelectedChangesAndOptOut }),
          //   );

          //   fireEvent.click($('button[type="submit"]', container));

          //   const modal = container.querySelector('va-modal');

          //   const descriptionBullets = $$('li', modal);
          //   expect(descriptionBullets.length).to.eq(4);

          //   // console.log(
          //   //   'Description bullets',
          //   //   descriptionBullets.map(x => x.textContent),
          //   // );
          //   // Should be correct order?
          //   expect(descriptionBullets[0].textContent).to.contain(
          //     BEHAVIOR_CHANGES_WORK.performance,
          //   );
          //   expect(descriptionBullets[1].textContent).to.contain(
          //     BEHAVIOR_CHANGES_WORK.reassignment,
          //   );
          //   expect(descriptionBullets[2].textContent).to.contain(
          //     BEHAVIOR_CHANGES_WORK.absences,
          //   );
          //   expect(descriptionBullets[3].textContent).to.contain(
          //     'And, 2 other behavioral changes',
          //   );
          // });
        });
      });

      describe('Modal Selections', () => {
        const filledOutDataWithOptOut = {
          'view:answerCombatBehaviorQuestions': 'false',
          healthBehaviors: {
            appetite: true,
          },
          workBehaviors: {
            performance: true,
          },
          otherBehaviors: {
            socialEconomic: true,
          },
          behaviorsDetails: {
            appetite: 'Details of appetite behavior',
            performance: 'Details of performance behavior',
            socialEconomic: 'Details of socialEconomic behavior',
          },
        };

        describe('When the close button is clicked', () => {
          // it('closes the modal', () => {
          //   const { container } = render(
          //     page({ data: filledOutDataWithOptOut }),
          //   );

          //   fireEvent.click($('button[type="submit"]', container));

          //   const modal = container.querySelector('va-modal');

          //   modal.__events.closeEvent();
          //   expect($('va-modal[visible="true"]', container)).not.to.exist;
          // });
        });

        describe('When the confirm button is clicked', () => {
          // it('closes the modal, deletes answered questions and checkboxes and advances to the next page', () => {
          //   const setFormDataSpy = sinon.spy();
          //   const goForwardSpy = sinon.spy();

          //   const { container } = render(
          //     page({
          //       data: filledOutDataWithOptOut,
          //       setFormData: setFormDataSpy,
          //       goForward: goForwardSpy,
          //     }),
          //   );

          //   fireEvent.click($('button[type="submit"]', container));

          //   const modal = container.querySelector('va-modal');

          //   modal.__events.primaryButtonClick();
          //   expect($('va-modal[visible="true"]', container)).not.to.exist;

          //   expect(
          //     setFormDataSpy.calledWith({
          //       'view:answerCombatBehaviorQuestions': 'false',
          //       healthBehaviors: {},
          //       workBehaviors: {},
          //       otherBehaviors: {},
          //       behaviorsDetails: {},
          //     }),
          //   );

          //   expect(goForwardSpy.called).to.be.true;
          // });
        });


        // TODO: TEST FILTERS OUT FALSE VALUES (WAS CLICKED AND THEN CLICKED OFF)
        // TODO: TEST FILTERS OUT UNDEFEINED VALUES (WAS NEVER CLICKED)

        describe('When the cancel button is clicked', () => {
          // it('closes the modal, does not delete answered questons and does not advance to the next page', () => {
          //   const setFormDataSpy = sinon.spy();
          //   const goForwardSpy = sinon.spy();

          //   const { container } = render(
          //     page({
          //       data: filledOutDataWithOptOut,
          //       setFormData: setFormDataSpy,
          //       goForward: goForwardSpy,
          //     }),
          //   );

          //   fireEvent.click($('button[type="submit"]', container));

          //   const modal = container.querySelector('va-modal');

          //   modal.__events.secondaryButtonClick();
          //   expect($('va-modal[visible="true"]', container)).not.to.exist;

          //   expect(setFormDataSpy.notCalled).to.be.true;
          //   expect(goForwardSpy.notCalled).to.be.true;
          // });
        });
      });
    });
  });
});
