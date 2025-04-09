import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import sinon from 'sinon';
import BehaviorIntroCombatPage from '../../components/BehaviorIntroCombatPage';
import {
  BEHAVIOR_CHANGES_HEALTH,
  BEHAVIOR_CHANGES_WORK,
} from '../../constants';
import { missingSelectionErrorMessage } from '../../content/form0781/behaviorIntroCombatPage';

describe('BehaviorIntroCombatPage', () => {
  const page = ({
    data = {},
    goBack = () => {},
    goForward = () => {},
    setFormData = () => {},
    updatePage = () => {},
    onReviewPage = false,
  } = {}) => {
    return (
      <div>
        <BehaviorIntroCombatPage
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

  it('should render with two radio selections', () => {
    const { container } = render(page());
    expect($$('va-radio-option', container).length).to.eq(2);
  });

  describe('Answer Behavioral Questions selection', () => {
    describe('Opting in to answering behavioral questions', () => {
      it('should advance to the next page', () => {
        const goForwardSpy = sinon.spy();

        const data = {
          'view:answerCombatBehaviorQuestions': 'true',
        };

        const { container } = render(page({ data, goForward: goForwardSpy }));

        fireEvent.click($('button[type="submit"]', container));
        expect(goForwardSpy.called).to.be.true;
      });
    });

    describe('Opting out of answering behavioral questions', () => {
      it('should advance to the next page', () => {
        const goForwardSpy = sinon.spy();

        const data = {
          'view:answerCombatBehaviorQuestions': 'false',
        };

        const { container } = render(page({ data, goForward: goForwardSpy }));

        fireEvent.click($('button[type="submit"]', container));
        expect(goForwardSpy.called).to.be.true;
      });
    });

    describe('When updating the selection on the Review and Submit page', () => {
      describe('Opting in to answering behavioral questions', () => {
        it('should update the choice', () => {
          const updateSpy = sinon.spy();
          const { container } = render(
            page({
              onReviewPage: true,
              updatePage: updateSpy,
              data: {
                'view:answerCombatBehaviorQuestions': 'true',
              },
            }),
          );
          fireEvent.click($('va-button[text="Update page"]', container));
          expect(updateSpy.called).to.be.true;
        });
      });

      describe('Opting out of answering behavioral questions', () => {
        it('should update the choice', () => {
          const updateSpy = sinon.spy();
          const { container } = render(
            page({
              onReviewPage: true,
              updatePage: updateSpy,
              data: {
                'view:answerCombatBehaviorQuestions': 'false',
              },
            }),
          );

          fireEvent.click($('va-button[text="Update page"]', container));
          expect(updateSpy.called).to.be.true;
        });
      });
    });

    describe('Validations', () => {
      it('raises an error if a selection is not made and does not advance', () => {
        const goForwardSpy = sinon.spy();
        const { container } = render(
          page({ data: {}, goForward: goForwardSpy }),
        );

        fireEvent.click($('button[type="submit"]', container));

        expect($('va-radio', container).error).to.contain(
          missingSelectionErrorMessage,
        );

        expect(goForwardSpy.notCalled).to.be.true;
      });
    });

    describe('Delete already declared behavioral changes modal', () => {
      describe('When the user has already declared behavioral changes, changes the selection to opt out and clicks continue', () => {
        const data = {
          'view:answerCombatBehaviorQuestions': 'false',
          healthBehaviors: {
            appetite: true,
          },
        };

        it('displays a prompt to delete the answers and prevents the page from submitting', () => {
          const goForwardSpy = sinon.spy();
          const { container } = render(page({ data, goForward: goForwardSpy }));

          fireEvent.click($('button[type="submit"]', container));
          expect($('va-modal[visible="true"]', container)).to.exist;
          expect(goForwardSpy.notCalled).to.be.true;
        });
      });

      describe('When the user has already declared behavioral changes, is opted in and clicks continue', () => {
        const data = {
          'view:answerCombatBehaviorQuestions': 'true',
          healthBehaviors: {
            appetite: true,
          },
        };

        it('does not display a prompt to delete the answers and prevent the page from submitting', () => {
          const goForwardSpy = sinon.spy();
          const { container } = render(page({ data, goForward: goForwardSpy }));

          fireEvent.click($('button[type="submit"]', container));
          expect($('va-modal[visible="true"]', container)).not.to.exist;
          expect(goForwardSpy.called).to.be.true;
        });
      });

      describe('On the review and submit page', () => {
        describe('When the user has already declared behavioral changes, changes the selection to opt out and clicks update', () => {
          const data = {
            'view:answerCombatBehaviorQuestions': 'false',
            healthBehaviors: {
              appetite: true,
            },
          };

          it('displays a prompt to delete the answers and prevents the page from updating', () => {
            const updateSpy = sinon.spy();
            const { container } = render(
              page({ data, onReviewPage: true, updatePage: updateSpy }),
            );

            fireEvent.click($('va-button[text="Update page"]', container));

            expect($('va-modal[visible="true"]', container)).to.exist;
            expect(updateSpy.notCalled).to.be.true;
          });
        });

        describe('When the user has already declared behavioral changes, is opted in and clicks update', () => {
          const data = {
            'view:answerCombatBehaviorQuestions': 'true',
            healthBehaviors: {
              appetite: true,
            },
          };

          it('does not display a prompt to delete the answers and does not prevent the update from submitting', () => {
            const updateSpy = sinon.spy();
            const { container } = render(
              page({ data, onReviewPage: true, updatePage: updateSpy }),
            );

            fireEvent.click($('va-button[text="Update page"]', container));

            expect(updateSpy.called).to.be.true;
          });
        });
      });

      // Tests list of previously-selected behaviors in modal, we truncate this list in certain situations because listing all the behaviors a user could have selected would make the modal too big.
      describe('Modal Content', () => {
        describe('When the user has previously claimed less than four behavioral changes on the Behavioral List page', () => {
          const threeSelectedChangesAndOptOut = {
            'view:answerCombatBehaviorQuestions': 'false',
            workBehaviors: {
              performance: true,
              reassignment: true,
            },
            healthBehaviors: {
              appetite: true,
            },
          };

          it('lists all three behavior descriptions in the modal content and does not list additional number of behaviors', () => {
            const { container } = render(
              page({ data: threeSelectedChangesAndOptOut }),
            );

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');

            const descriptionBullets = $$('li', modal);
            expect(descriptionBullets.length).to.eq(3);

            expect(descriptionBullets[0].textContent).to.contain(
              BEHAVIOR_CHANGES_WORK.performance,
            );
            expect(descriptionBullets[1].textContent).to.contain(
              BEHAVIOR_CHANGES_WORK.reassignment,
            );
            expect(descriptionBullets[2].textContent).to.contain(
              BEHAVIOR_CHANGES_HEALTH.appetite,
            );

            expect(container.textContent).not.to.contain(
              'And, 0 other behavioral changes',
            );
          });
        });

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

          it('lists three behavior descriptions in the modal content and a note explaining there are two remaining', () => {
            const { container } = render(
              page({ data: fiveSelectedChangesAndOptOut }),
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
              'And, 2 other behavioral changes',
            );
          });
        });

        // This is the behavior of the Forms Library when the user visits the BehaviorListPage but doesn't make a selection
        describe('When behavioral changes are undefined in the formData', () => {
          it('does not display the behavioral changes in the modal', () => {
            const undefinedPresent = {
              'view:answerCombatBehaviorQuestions': 'false',
              workBehaviors: {
                performance: true,
                reassignment: undefined,
              },
            };

            const { container } = render(page({ data: undefinedPresent }));

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');

            const descriptionBullets = $$('li', modal);

            expect(descriptionBullets.length).to.eq(1);

            expect(descriptionBullets[0].textContent).to.contain(
              BEHAVIOR_CHANGES_WORK.performance,
            );
          });
        });

        // Behavioral changes may be present in the formData with a false value if the user selected and then unselected the behavior on the BehaviorListPage
        describe('When behavioral changes are false in the formData', () => {
          it('does not display the behavioral changes in the modal', () => {
            const undefinedPresent = {
              'view:answerCombatBehaviorQuestions': 'false',
              workBehaviors: {
                performance: true,
                reassignment: false,
              },
            };

            const { container } = render(page({ data: undefinedPresent }));

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');
            const descriptionBullets = $$('li', modal);

            expect(descriptionBullets.length).to.eq(1);

            expect(descriptionBullets[0].textContent).to.contain(
              BEHAVIOR_CHANGES_WORK.performance,
            );
          });
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

        const confirmationAlertSelector =
          'va-alert[status="success"][visible="true"][close-btn-aria-label="Deleted answers confirmation"]';

        describe('When the close button is clicked', () => {
          it('closes the modal', () => {
            const { container } = render(
              page({ data: filledOutDataWithOptOut }),
            );

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');

            modal.__events.closeEvent();
            expect($('va-modal[visible="true"]', container)).not.to.exist;
          });
        });

        describe('When the confirm button is clicked', () => {
          it('closes the modal', () => {
            const { container } = render(
              page({
                data: filledOutDataWithOptOut,
              }),
            );

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');

            modal.__events.primaryButtonClick();
            expect($('va-modal[visible="true"]', container)).not.to.exist;
          });

          it('deletes answered questions and checkboxes', () => {
            const setFormDataSpy = sinon.spy();
            const { container } = render(
              page({
                data: filledOutDataWithOptOut,
                setFormData: setFormDataSpy,
              }),
            );

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');
            modal.__events.primaryButtonClick();

            expect(
              setFormDataSpy.calledWith({
                'view:answerCombatBehaviorQuestions': 'false',
                healthBehaviors: {},
                workBehaviors: {},
                otherBehaviors: {},
                behaviorsDetails: {},
              }),
            );
          });

          it('does not advance the page and displays a deletion confirmation alert', async () => {
            const goForwardSpy = sinon.spy();
            const { container } = render(
              page({
                data: filledOutDataWithOptOut,
                goForward: goForwardSpy,
              }),
            );

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');
            modal.__events.primaryButtonClick();

            expect($(confirmationAlertSelector), container).to.exist;

            expect(
              $(confirmationAlertSelector, container).innerHTML,
            ).to.contain(
              'We’ve removed information about your behavioral changes',
            );

            expect(
              $(confirmationAlertSelector, container).innerHTML,
            ).to.contain('Continue with your claim');
          });
        });

        describe('Deletion confirmation message', () => {
          it('advances to the next page when the continue link is clicked', () => {
            const goForwardSpy = sinon.spy();
            const { container } = render(
              page({
                data: filledOutDataWithOptOut,
                goForward: goForwardSpy,
              }),
            );

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');
            modal.__events.primaryButtonClick();

            fireEvent.click($('button.va-button-link', container));
            expect(goForwardSpy.called).to.be.true;
          });
        });

        describe('When the cancel button is clicked', () => {
          it('closes the modal', () => {
            const { container } = render(
              page({
                data: filledOutDataWithOptOut,
              }),
            );

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');

            modal.__events.secondaryButtonClick();
            expect($('va-modal[visible="true"]', container)).not.to.exist;
          });

          it('does not delete answered questions and checkboxes', () => {
            const setFormDataSpy = sinon.spy();

            const { container } = render(
              page({
                data: filledOutDataWithOptOut,
                setFormData: setFormDataSpy,
              }),
            );

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');
            modal.__events.secondaryButtonClick();

            expect(setFormDataSpy.notCalled).to.be.true;
          });

          it('does not display a deletion confirmation modal', () => {
            const { container } = render(
              page({
                data: filledOutDataWithOptOut,
              }),
            );

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');
            modal.__events.secondaryButtonClick();
            expect($(confirmationAlertSelector, container)).not.to.exist;
          });

          it('does not advance to the next page', () => {
            const goForwardSpy = sinon.spy();

            const { container } = render(
              page({
                data: filledOutDataWithOptOut,
                goForward: goForwardSpy,
              }),
            );

            fireEvent.click($('button[type="submit"]', container));

            const modal = container.querySelector('va-modal');
            modal.__events.secondaryButtonClick();

            expect(goForwardSpy.notCalled).to.be.true;
          });
        });
      });
    });
  });

  describe('Page content', () => {
    const mentalHealthDropdownSelector =
      'va-alert-expandable[status="info"][trigger="Learn how to get mental health help now"]';

    describe('When rendered on the Behavior Intro Combat Page', () => {
      it('Displays a Mental Health Alert Dropdown', () => {
        const { container } = render(page());
        expect($(mentalHealthDropdownSelector, container)).to.exist;
      });

      it('Displays forward and back buttons', () => {
        const { container } = render(page());

        const continueButton = $(
          '.usa-button-primary[type="submit"]',
          container,
        );

        expect(continueButton).to.exist;
        expect(continueButton.textContent).to.contain('Continue');

        const backButton = $('.usa-button-secondary', container);

        expect(backButton).to.exist;
        expect(backButton.textContent).to.contain('Back');
      });
    });

    describe('When rendered on the Review and Submit Page', () => {
      const { container } = render(page({ onReviewPage: true }));

      it('Does not display a Mental Health Alert Dropdown', () => {
        expect($(mentalHealthDropdownSelector, container)).not.to.exist;
      });

      it('Does not display forward and back buttons', () => {
        const continueButton = $(
          '.usa-button-primary[type="submit"][text="Continue"]',
          container,
        );
        expect(continueButton).not.to.exist;

        const backButton = $('.usa-button-secondary', container);
        expect(backButton).not.to.exist;
      });
    });
  });
});
