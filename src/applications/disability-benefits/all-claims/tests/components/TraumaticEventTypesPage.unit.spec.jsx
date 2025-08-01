import React from 'react';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { TRAUMATIC_EVENT_TYPES } from '../../constants';
import TraumaticEventTypesPage from '../../components/TraumaticEventTypesPage';

describe('TraumaticEventTypesPage', () => {
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
        <TraumaticEventTypesPage
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

  describe('Traumatic events selection', () => {
    it('should render checkboxes for each selectable traumatic event type', () => {
      const data = {
        eventTypes: {},
      };

      const { container } = render(page({ data }));

      Object.values(TRAUMATIC_EVENT_TYPES).forEach(option => {
        expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
      });
    });

    it('should submit when selecting one or more event types', () => {
      const goForwardSpy = sinon.spy();

      const data = {
        eventTypes: {
          combat: true,
          mst: true,
          nonMst: false,
          other: false,
        },
      };
      const { container } = render(page({ data, goForward: goForwardSpy }));
      fireEvent.click($('button[type="submit"]', container));

      expect(goForwardSpy.called).to.be.true;
    });

    it('should submit when boxes are unchecked', () => {
      const goForwardSpy = sinon.spy();

      const data = {
        eventTypes: {
          combat: false,
          // Deselected boxes are saved as false in Forms Library metadata
          mst: false,
          nonMst: false,
          other: false,
        },
      };
      const { container } = render(page({ data, goForward: goForwardSpy }));
      fireEvent.click($('button[type="submit"]', container));

      expect(goForwardSpy.called).to.be.true;
    });
  });

  describe('Display modal for deleting already entered MST-related evidence', () => {
    describe('when MST events were not selected but no existing MST data has been filled out', () => {
      it('does not show the modal', () => {
        const data = {
          eventTypes: {
            combat: true,
            mst: false,
            nonMst: true,
            other: true,
          },
        };

        const { container } = render(page({ data }));
        fireEvent.click($('button[type="submit"]', container));

        expect($('va-modal[visible="true"]', container)).not.to.exist;
      });
    });

    // Checkboxes that were never selected have an undefined value
    describe('when MST events were not selected and were not previously selected', () => {
      it('does not show the modal', () => {
        const data = {
          eventTypes: {
            combat: undefined,
            mst: undefined,
            nonMst: undefined,
            other: undefined,
          },
        };

        const { container } = render(page({ data }));
        fireEvent.click($('button[type="submit"]', container));

        expect($('va-modal[visible="true"]', container)).not.to.exist;
      });
    });

    describe('when MST events were deselected', () => {
      const baseDataMSTDeselected = {
        eventTypes: {
          combat: true,
          mst: false,
          nonMst: true,
          other: true,
        },
      };

      describe('incident reports for traumatic events', () => {
        describe('when MST-related incident reports were claimed for at least one event', () => {
          it('displays the modal', () => {
            const data = {
              ...baseDataMSTDeselected,
              events: [
                {
                  militaryReports: {
                    restricted: true,
                  },
                },
                // Events without reports metadata:
                {},
                {},
              ],
            };

            const { container } = render(page({ data }));
            fireEvent.click($('button[type="submit"]', container));

            expect($('va-modal[visible="true"]', container)).to.exist;
          });
        });

        describe('when MST-related incident reports were not claimed for at least one event', () => {
          it('does not display the modal', () => {
            const data = {
              ...baseDataMSTDeselected,
              events: [{}, {}],
            };

            const { container } = render(page({ data }));
            fireEvent.click($('button[type="submit"]', container));

            expect($('va-modal[visible="true"]', container)).not.to.exist;
          });
        });

        describe('when MST-related incident reports were claimed for an event but later unchecked', () => {
          it('does not display the modal', () => {
            const data = {
              ...baseDataMSTDeselected,
              events: [
                {
                  militaryReports: {
                    // Deselected boxes are saved as false in Forms Library metadata
                    restricted: false,
                    unrestricted: false,
                    pre2005: false,
                  },
                },
                {},
                {},
              ],
            };

            const { container } = render(page({ data }));
            fireEvent.click($('button[type="submit"]', container));

            expect($('va-modal[visible="true"]', container)).not.to.exist;
          });
        });

        // We need to account for undefined values
        // This is the behavior of the Forms Library when the user visits the a page but doesn't make a selection
        describe('when MST-related incident reports metadata is undefined', () => {
          it('does not display the modal', () => {
            const data = {
              ...baseDataMSTDeselected,
              events: [
                {
                  militaryReports: {
                    restricted: undefined,
                    unrestricted: undefined,
                    pre2005: undefined,
                  },
                },
                {},
                {},
              ],
            };

            const { container } = render(page({ data }));
            fireEvent.click($('button[type="submit"]', container));

            expect($('va-modal[visible="true"]', container)).not.to.exist;
          });
        });
      });

      describe('event notifications consent choice', () => {
        describe('when a user made a choice to receive notifications about events related to their claim', () => {
          it('displays the modal', () => {
            const data = {
              ...baseDataMSTDeselected,
              // this could be yes, no, revoke, etc. we show the modal regardless of the choice IF they made a choice
              optionIndicator: 'yes',
            };

            const { container } = render(page({ data }));
            fireEvent.click($('button[type="submit"]', container));

            expect($('va-modal[visible="true"]', container)).to.exist;
          });
        });

        describe('when a user has not made a choice regarding to receive notifications about events related to their claim', () => {
          it('does not display the modal', () => {
            const data = {
              ...baseDataMSTDeselected,
            };

            const { container } = render(page({ data }));
            fireEvent.click($('button[type="submit"]', container));

            expect($('va-modal[visible="true"]', container)).not.to.exist;
          });
        });

        describe('when consent notificaiton metadata is undefined', () => {
          it('does not display the modal', () => {
            const data = {
              ...baseDataMSTDeselected,
              optionIndicator: undefined,
            };

            const { container } = render(page({ data }));
            fireEvent.click($('button[type="submit"]', container));

            expect($('va-modal[visible="true"]', container)).not.to.exist;
          });
        });
      });
    });
  });

  describe('Modal delete action selection', () => {
    const confirmationAlertSelector =
      'va-alert[status="warning"][visible="true"][close-btn-aria-label="Deleted MST evidence confirmation"]';

    const mstEventsDeselected = {
      combat: true,
      mst: false,
      nonMst: true,
      other: true,
    };

    const mstEventsSelected = {
      combat: true,
      mst: true,
      nonMst: true,
      other: true,
    };

    const existingMSTEvidence = {
      optionIndicator: 'no',
      events: [
        {
          militaryReports: {
            restricted: true,
          },
        },
      ],
    };

    const deselectedMSTWithExistingEvidence = {
      eventTypes: mstEventsDeselected,
      ...existingMSTEvidence,
    };

    const selectedMSTWithExistingEvidence = {
      eventTypes: mstEventsSelected,
      ...existingMSTEvidence,
    };

    describe('When the close button is clicked', () => {
      describe('On the traumatic events page', () => {
        it('closes the modal, re-selects MST as an event type and does not advance the page', () => {
          const setFormDataSpy = sinon.spy();
          const goForwardSpy = sinon.spy();

          const { container } = render(
            page({
              data: deselectedMSTWithExistingEvidence,
              goForward: goForwardSpy,
              setFormData: setFormDataSpy,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.closeEvent();
          expect($('va-modal[visible="true"]', container)).not.to.exist;

          // Re-selects MST event type
          expect(setFormDataSpy.calledWith(selectedMSTWithExistingEvidence)).to
            .be.true;

          // Does not advance page
          expect(goForwardSpy.notCalled).to.be.true;
        });
      });

      describe('On the review and submit page', () => {
        it('closes the modal, re-selects MST as an event type and does not update the page', () => {
          const setFormDataSpy = sinon.spy();
          const updatePageSpy = sinon.spy();

          const { container } = render(
            page({
              data: deselectedMSTWithExistingEvidence,
              setFormData: setFormDataSpy,
              updatePage: updatePageSpy,
              onReviewPage: true,
            }),
          );

          fireEvent.click($('va-button[text="Update page"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.closeEvent();
          expect($('va-modal[visible="true"]', container)).not.to.exist;

          // Re-selects MST event type
          expect(setFormDataSpy.calledWith(selectedMSTWithExistingEvidence)).to
            .be.true;

          // Does not update review and submit page
          expect(updatePageSpy.notCalled).to.be.true;
        });
      });
    });

    describe('when the cancel button is clicked', () => {
      describe('On the traumatic events page', () => {
        it('closes the modal, re-selects MST as an event type and does not advance the page', () => {
          const setFormDataSpy = sinon.spy();
          const goForwardSpy = sinon.spy();

          const { container } = render(
            page({
              data: deselectedMSTWithExistingEvidence,
              goForward: goForwardSpy,
              setFormData: setFormDataSpy,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.secondaryButtonClick();
          expect($('va-modal[visible="true"]', container)).not.to.exist;

          // Re-selects MST event type
          expect(setFormDataSpy.calledWith(selectedMSTWithExistingEvidence)).to
            .be.true;

          // Does not advance page
          expect(goForwardSpy.notCalled).to.be.true;
        });
      });

      describe('On the review and submit page', () => {
        it('closes the modal, re-selects MST as an event type and does not update the page', () => {
          const setFormDataSpy = sinon.spy();
          const updatePageSpy = sinon.spy();

          const { container } = render(
            page({
              data: deselectedMSTWithExistingEvidence,
              setFormData: setFormDataSpy,
              updatePage: updatePageSpy,
              onReviewPage: true,
            }),
          );

          fireEvent.click($('va-button[text="Update page"]', container));
          const modal = container.querySelector('va-modal');

          modal.__events.secondaryButtonClick();
          expect($('va-modal[visible="true"]', container)).not.to.exist;

          // Re-selects MST event type
          expect(setFormDataSpy.calledWith(selectedMSTWithExistingEvidence)).to
            .be.true;

          // Does not update review and submit page
          expect(updatePageSpy.notCalled).to.be.true;
        });
      });
    });

    // Primary Deletion Tests
    describe('When the Confirm button is clicked', () => {
      // Event details we don't want to alter
      const firstEventNonMSTMetadata = {
        details:
          'Briefly describe what happened during your traumatic event in the military.',
        location: 'Where did the event happen?',
        otherReports: 'Other official report type not listed here',
        timing: 'When did the event happen?',
        reports: {
          restricted: true,
          unrestricted: true,
          police: true,
          none: true,
        },
        agency: 'Name of the agency that issued the report',
        city: 'report city',
        state: 'report state',
        township: 'report township',
        country: 'USA',
      };

      // Event details we do want to unselect
      const firstEventSelectedMSTMetadata = {
        militaryReports: {
          restricted: true,
          unrestricted: true,
          pre2005: true,
        },
      };

      const secondEventNonMSTMetadata = {
        details: 'Some details',
        location: 'Forward operating base',
        otherReports: 'After Action Report (AAR)',
        timing: 'Evening',
        reports: {
          restricted: true,
          unrestricted: false,
          police: true,
          none: false,
        },
        agency: 'Name of agency',
        city: 'Reno',
        state: 'NV',
        township: 'Reno township',
        country: 'USA',
      };

      // Testing partially selected MST reports
      const secondEventPartiallySelectedMSTMetadata = {
        militaryReports: {
          restricted: true,
          unrestricted: false,
          pre2005: true,
        },
      };

      // MST deselection plus all existing events metadata
      const optOutOfExistingMSTMetadata = {
        eventTypes: mstEventsDeselected,
        events: [
          {
            ...firstEventNonMSTMetadata,
            ...firstEventSelectedMSTMetadata,
          },
          {
            ...secondEventNonMSTMetadata,
            ...secondEventPartiallySelectedMSTMetadata,
          },
        ],
      };

      // Existing metadata with MST reports deselected (expected state after MST reports selections are scrubbed)
      const deletedMSTReportMetadataOnly = {
        eventTypes: mstEventsDeselected,
        events: [
          {
            ...firstEventNonMSTMetadata,
            militaryReports: {
              restricted: false,
              unrestricted: false,
              pre2005: false,
            },
          },
          {
            ...secondEventNonMSTMetadata,
            militaryReports: {
              restricted: false,
              unrestricted: false,
              pre2005: false,
            },
          },
        ],
      };

      describe('On the traumatic events page', () => {
        it('closes the modal', () => {
          const { container } = render(
            page({ data: deselectedMSTWithExistingEvidence }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.primaryButtonClick();
          expect($('va-modal[visible="true"]', container)).not.to.exist;
        });

        it('Deselects all MST-related reports for all events and preserves all other existing events metadata', () => {
          const setFormDataSpy = sinon.spy();
          const { container } = render(
            page({
              data: optOutOfExistingMSTMetadata,
              setFormData: setFormDataSpy,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');
          modal.__events.primaryButtonClick();

          expect(setFormDataSpy.calledWith(deletedMSTReportMetadataOnly)).to.be
            .true;
        });

        it('deletes a selection to consent to receieve notifications', () => {
          const setFormDataSpy = sinon.spy();
          const consentToNotificationsMetadata = {
            eventTypes: mstEventsDeselected,
            optionIndicator: 'no',
          };

          const { container } = render(
            page({
              data: consentToNotificationsMetadata,
              setFormData: setFormDataSpy,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');
          modal.__events.primaryButtonClick();

          expect(
            setFormDataSpy.calledWith({
              eventTypes: mstEventsDeselected,
              // Reset optionIndicator to undefined so they can reselect if they return to the MST consent page
              optionIndicator: undefined,
            }),
          ).to.be.true;
        });

        it('Does not advance the page and displays a deletion confirmation alert', async () => {
          const goForwardSpy = sinon.spy();
          const { container } = render(
            page({
              data: deselectedMSTWithExistingEvidence,
              goForward: goForwardSpy,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');
          modal.__events.primaryButtonClick();

          expect($(confirmationAlertSelector), container).to.exist;

          expect($(confirmationAlertSelector, container).innerHTML).to.contain(
            'You’ve removed sexual assault or harassment as a type of trauma you experienced.',
            'Review your traumatic events, behavioral changes and supporting documents to remove any information you don’t want to include.',
            'Continue with your claim',
          );

          expect(goForwardSpy.notCalled).to.be.true;
        });
      });

      describe('On the review and submit page', () => {
        it('closes the modal', () => {
          const { container } = render(
            page({
              data: deselectedMSTWithExistingEvidence,
              onReviewPage: true,
            }),
          );

          fireEvent.click($('va-button[text="Update page"]', container));
          const modal = container.querySelector('va-modal');

          modal.__events.primaryButtonClick();
          expect($('va-modal[visible="true"]', container)).not.to.exist;
        });

        it('Deselects all MST-related reports for all events and preserves all other existing events metadata', () => {
          const setFormDataSpy = sinon.spy();
          const { container } = render(
            page({
              data: optOutOfExistingMSTMetadata,
              setFormData: setFormDataSpy,
              onReviewPage: true,
            }),
          );

          fireEvent.click($('va-button[text="Update page"]', container));
          const modal = container.querySelector('va-modal');
          modal.__events.primaryButtonClick();

          expect(setFormDataSpy.calledWith(deletedMSTReportMetadataOnly)).to.be
            .true;
        });

        it('Deletes a selection to consent to receieve notifications', () => {
          const setFormDataSpy = sinon.spy();
          const consentToNotificationsMetadata = {
            eventTypes: mstEventsDeselected,
            optionIndicator: 'no',
          };

          const { container } = render(
            page({
              data: consentToNotificationsMetadata,
              setFormData: setFormDataSpy,
              onReviewPage: true,
            }),
          );

          fireEvent.click($('va-button[text="Update page"]', container));

          const modal = container.querySelector('va-modal');
          modal.__events.primaryButtonClick();

          expect(
            setFormDataSpy.calledWith({
              eventTypes: mstEventsDeselected,
              // Reset optionIndicator to undefined so they can reselect if they return to the MST consent page
              optionIndicator: undefined,
            }),
          ).to.be.true;
        });

        it('displays a deletion confirmation alert but does NOT include a link to continue with the claim to the next page', async () => {
          const { container } = render(
            page({
              data: deselectedMSTWithExistingEvidence,
              onReviewPage: true,
            }),
          );

          fireEvent.click($('va-button[text="Update page"]', container));

          const modal = container.querySelector('va-modal');
          modal.__events.primaryButtonClick();

          expect($(confirmationAlertSelector), container).to.exist;

          expect($(confirmationAlertSelector, container).innerHTML).to.contain(
            'You’ve removed sexual assault or harassment as a type of trauma you experienced.',
            'Review your traumatic events, behavioral changes and supporting documents to remove any information you don’t want to include.',
          );

          expect(
            $(confirmationAlertSelector, container).innerHTML,
          ).not.to.contain('Continue with your claim');
        });
      });
    });

    describe('Page content', () => {
      const mentalHealthDropdownSelector =
        'va-alert-expandable[status="info"][trigger="Get mental health and military sexual trauma support anytime"]';

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
        it('Does not display a Mental Health Alert Dropdown', () => {
          const { container } = render(page({ onReviewPage: true }));
          expect($(mentalHealthDropdownSelector, container)).not.to.exist;
        });

        it('Does not display forward and back buttons', () => {
          const { container } = render(page({ onReviewPage: true }));
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
});
