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
import { deletedEvidenceAlertConfirmationContent } from '../../content/traumaticEventTypes';

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

    it('should submit without selecting an event type', () => {
      const goForwardSpy = sinon.spy();

      const data = {
        eventTypes: {},
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
    describe('when MST events were not selected', () => {
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
      // Include both consent and reports
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

    describe('when MST events were deselected', () => {
      const baseDataMSTDeselected = {
        eventTypes: {
          // Deselected boxes are saved as false in Forms Library metadata
          mst: false,
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
        describe('when a user made a choice regarding to receive notifications about events related to their claim', () => {
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

        describe('when a user has not ade a choice regarding to receive notifications about events related to their claim', () => {
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

  describe('modal delete action selection', () => {
    const confirmationAlertSelector =
      'va-alert[status="success"][visible="true"][close-btn-aria-label="Deleted MST evidence confirmation"]';

    const deselectedMSTWithExistingEvidence = {
      eventTypes: {
        combat: true,
        mst: false,
        nonMst: true,
        other: true,
      },
      optionIndicator: 'no',
      events: [
        {
          militaryReports: {
            restricted: true,
          },
        },
      ],
    };

    describe('When the close button is clicked', () => {
      it('closes the modal', () => {
        const { container } = render(
          page({ data: deselectedMSTWithExistingEvidence }),
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
          page({ data: deselectedMSTWithExistingEvidence }),
        );

        fireEvent.click($('button[type="submit"]', container));

        const modal = container.querySelector('va-modal');

        modal.__events.primaryButtonClick();
        expect($('va-modal[visible="true"]', container)).not.to.exist;
      });

      it('deletes answered questions and checkboxes', () => {
        const setFormDataSpy = sinon.spy();
        const { container } = render(
          page({ data: deselectedMSTWithExistingEvidence }),
        );

        fireEvent.click($('button[type="submit"]', container));

        const modal = container.querySelector('va-modal');
        modal.__events.primaryButtonClick();

        expect(
          setFormDataSpy.calledWith({
            // Confirm this works as expected
            optionIndicator: undefined,
            militaryReports: {},
          }),
        );
      });

      it('does not advance the page and displays a deletion confirmation alert', async () => {
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
          deletedEvidenceAlertConfirmationContent,
        );

        expect($(confirmationAlertSelector, container).innerHTML).to.contain(
          'Continue with your claim',
        );
      });
    });
  });
});
