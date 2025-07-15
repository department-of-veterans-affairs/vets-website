import React from 'react';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import ToxicExposureChoicePage from '../../pages/toxicExposure/toxicExposureChoicePage';

describe('ToxicExposureChoicePage', () => {
  const TOXIC_EXPOSURE_TOGGLE_NAME =
    'disabilityCompensationToxicExposureDestructionModal';

  const getMockStore = (featureToggleEnabled = true) => {
    const toggles = {};

    toggles[TOXIC_EXPOSURE_TOGGLE_NAME] = featureToggleEnabled;

    return {
      getState: () => ({
        featureToggles: toggles,
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
  };

  const page = ({
    data = {},
    goBack = () => {},
    goForward = () => {},
    setFormData = () => {},
    updatePage = () => {},
    onReviewPage = false,
    featureToggleEnabled = true,
  } = {}) => {
    const mockStore = getMockStore(featureToggleEnabled);
    return (
      <Provider store={mockStore}>
        <div>
          <ToxicExposureChoicePage
            setFormData={setFormData}
            data={data}
            goBack={goBack}
            goForward={goForward}
            onReviewPage={onReviewPage}
            updatePage={updatePage}
          />
        </div>
      </Provider>
    );
  };

  describe('Toxic exposure condition selection', () => {
    it('should render checkboxes for each condition plus none option', () => {
      const data = {
        newDisabilities: [
          { condition: 'Chronic Bronchitis' },
          { condition: 'Asthma' },
        ],
        toxicExposure: {
          conditions: {},
        },
      };

      const { container } = render(page({ data }));

      // Should render checkbox for each new condition
      expect($$('va-checkbox[label="Chronic Bronchitis"]', container)).to.exist;
      expect($$('va-checkbox[label="Asthma"]', container)).to.exist;

      // Should render the "none" option
      expect(
        $$(
          'va-checkbox[label="I am not claiming any conditions related to toxic exposure"]',
          container,
        ),
      ).to.exist;
    });

    it('should submit when selecting one or more conditions', () => {
      const goForwardSpy = sinon.spy();

      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: {
            chronicbronchitis: true,
          },
        },
      };
      const { container } = render(page({ data, goForward: goForwardSpy }));
      fireEvent.click($('button[type="submit"]', container));

      expect(goForwardSpy.called).to.be.true;
    });

    it('should require at least one selection to submit', () => {
      const goForwardSpy = sinon.spy();

      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: {},
        },
      };
      const { container } = render(page({ data, goForward: goForwardSpy }));
      fireEvent.click($('button[type="submit"]', container));

      expect(goForwardSpy.called).to.be.false;
    });

    it('should submit when selecting none option', () => {
      const goForwardSpy = sinon.spy();

      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: {
            none: true,
          },
        },
      };
      const { container } = render(page({ data, goForward: goForwardSpy }));
      fireEvent.click($('button[type="submit"]', container));

      expect(goForwardSpy.called).to.be.true;
    });
  });

  describe('Display modal for deleting already entered toxic exposure data', () => {
    describe('when "none" is not selected but no existing toxic exposure data has been filled out', () => {
      it('does not show the modal', () => {
        const data = {
          newDisabilities: [{ condition: 'Chronic Bronchitis' }],
          toxicExposure: {
            conditions: {
              chronicbronchitis: true,
            },
          },
        };

        const { container } = render(page({ data }));
        fireEvent.click($('button[type="submit"]', container));

        expect($('va-modal[visible="true"]', container)).not.to.exist;
      });
    });

    describe('when "none" is not selected and there was no previous selection', () => {
      it('does not show the modal', () => {
        const data = {
          newDisabilities: [{ condition: 'Chronic Bronchitis' }],
          toxicExposure: {
            conditions: {
              chronicbronchitis: undefined,
              none: undefined,
            },
          },
        };

        const { container } = render(page({ data }));
        fireEvent.click($('button[type="submit"]', container));

        expect($('va-modal[visible="true"]', container)).not.to.exist;
      });
    });

    describe('when "none" is selected and existing toxic exposure data exists', () => {
      const baseDataNoneSelected = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: {
            none: true,
          },
        },
      };

      describe('when Gulf War 1990 locations were claimed', () => {
        it('displays the modal', () => {
          const data = {
            ...baseDataNoneSelected,
            toxicExposure: {
              ...baseDataNoneSelected.toxicExposure,
              gulfWar1990: {
                bahrain: true,
              },
            },
          };

          const { container } = render(
            page({ data, featureToggleEnabled: true }),
          );
          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');
          expect(modal).to.exist;
          expect(modal.getAttribute('visible')).to.equal('true');
        });
      });

      describe('when Gulf War 2001 locations were claimed', () => {
        it('displays the modal', () => {
          const data = {
            ...baseDataNoneSelected,
            toxicExposure: {
              ...baseDataNoneSelected.toxicExposure,
              gulfWar2001: {
                afghanistan: true,
              },
            },
          };

          const { container } = render(
            page({ data, featureToggleEnabled: true }),
          );
          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');
          expect(modal).to.exist;
          expect(modal.getAttribute('visible')).to.equal('true');
        });
      });

      describe('when herbicide locations were claimed', () => {
        it('displays the modal', () => {
          const data = {
            ...baseDataNoneSelected,
            toxicExposure: {
              ...baseDataNoneSelected.toxicExposure,
              herbicide: {
                vietnam: true,
              },
            },
          };

          const { container } = render(
            page({ data, featureToggleEnabled: true }),
          );
          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');
          expect(modal).to.exist;
          expect(modal.getAttribute('visible')).to.equal('true');
        });
      });

      describe('when additional exposures were claimed', () => {
        it('displays the modal', () => {
          const data = {
            ...baseDataNoneSelected,
            toxicExposure: {
              ...baseDataNoneSelected.toxicExposure,
              additionalExposures: {
                asbestos: true,
              },
            },
          };

          const { container } = render(
            page({ data, featureToggleEnabled: true }),
          );
          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');
          expect(modal).to.exist;
          expect(modal.getAttribute('visible')).to.equal('true');
        });
      });

      describe('when toxic exposure data was claimed but later unchecked', () => {
        it('does not display the modal', () => {
          const data = {
            ...baseDataNoneSelected,
            toxicExposure: {
              ...baseDataNoneSelected.toxicExposure,
              gulfWar1990: {
                bahrain: false,
                airspace: false,
              },
            },
          };

          const { container } = render(page({ data }));
          fireEvent.click($('button[type="submit"]', container));

          expect($('va-modal[visible="true"]', container)).not.to.exist;
        });
      });

      describe('when toxic exposure metadata is undefined', () => {
        it('does not display the modal', () => {
          const data = {
            ...baseDataNoneSelected,
            toxicExposure: {
              ...baseDataNoneSelected.toxicExposure,
              gulfWar1990: {
                bahrain: undefined,
                airspace: undefined,
              },
            },
          };

          const { container } = render(page({ data }));
          fireEvent.click($('button[type="submit"]', container));

          expect($('va-modal[visible="true"]', container)).not.to.exist;
        });
      });
    });
  });

  describe('Modal delete action selection', () => {
    const confirmationAlertSelector =
      'va-alert[status="warning"][visible="true"][close-btn-aria-label="Deleted toxic exposure confirmation"]';

    const noneSelected = {
      chronicbronchitis: true,
      none: true,
    };

    const existingToxicExposureEvidence = {
      gulfWar1990: {
        bahrain: true,
      },
      herbicide: {
        vietnam: true,
      },
    };

    const selectedNoneWithExistingEvidence = {
      newDisabilities: [{ condition: 'Chronic Bronchitis' }],
      toxicExposure: {
        conditions: noneSelected,
        ...existingToxicExposureEvidence,
      },
    };

    describe('When the close button is clicked', () => {
      describe('On the toxic exposure page', () => {
        it('closes the modal, re-selects "none" as false and does not advance the page', () => {
          const setFormDataSpy = sinon.spy();
          const goForwardSpy = sinon.spy();

          const { container } = render(
            page({
              data: selectedNoneWithExistingEvidence,
              goForward: goForwardSpy,
              setFormData: setFormDataSpy,
              featureToggleEnabled: true,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.closeEvent();
          expect($('va-modal[visible="true"]', container)).not.to.exist;

          // Re-deselects "none" option
          const calledData = setFormDataSpy.lastCall.args[0];
          expect(calledData.toxicExposure.conditions.none).to.be.false;
          expect(calledData.toxicExposure.conditions.chronicbronchitis).to.be
            .true;

          // Does not advance page
          expect(goForwardSpy.called).to.be.false;
        });
      });

      describe('On the review and submit page', () => {
        it('closes the modal, re-selects "none" as false and does not update the page', () => {
          const setFormDataSpy = sinon.spy();
          const updatePageSpy = sinon.spy();

          const { container } = render(
            page({
              data: selectedNoneWithExistingEvidence,
              setFormData: setFormDataSpy,
              updatePage: updatePageSpy,
              onReviewPage: true,
              featureToggleEnabled: true,
            }),
          );

          fireEvent.click($('va-button[text="Update page"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.closeEvent();
          expect($('va-modal[visible="true"]', container)).not.to.exist;

          // Re-deselects "none" option
          const calledData = setFormDataSpy.lastCall.args[0];
          expect(calledData.toxicExposure.conditions.none).to.be.false;
          expect(calledData.toxicExposure.conditions.chronicbronchitis).to.be
            .true;

          // Does not update review and submit page
          expect(updatePageSpy.called).to.be.false;
        });
      });
    });

    describe('when the cancel button is clicked', () => {
      describe('On the toxic exposure page', () => {
        it('closes the modal, re-selects "none" as false and does not advance the page', () => {
          const setFormDataSpy = sinon.spy();
          const goForwardSpy = sinon.spy();

          const { container } = render(
            page({
              data: selectedNoneWithExistingEvidence,
              goForward: goForwardSpy,
              setFormData: setFormDataSpy,
              featureToggleEnabled: true,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.secondaryButtonClick();
          expect($('va-modal[visible="true"]', container)).not.to.exist;

          // Re-deselects "none" option
          const calledData = setFormDataSpy.lastCall.args[0];
          expect(calledData.toxicExposure.conditions.none).to.be.false;
          expect(calledData.toxicExposure.conditions.chronicbronchitis).to.be
            .true;

          // Does not advance page
          expect(goForwardSpy.called).to.be.false;
        });
      });

      describe('On the review and submit page', () => {
        it('closes the modal, re-selects "none" as false and does not update the page', () => {
          const setFormDataSpy = sinon.spy();
          const updatePageSpy = sinon.spy();

          const { container } = render(
            page({
              data: selectedNoneWithExistingEvidence,
              setFormData: setFormDataSpy,
              updatePage: updatePageSpy,
              onReviewPage: true,
              featureToggleEnabled: true,
            }),
          );

          fireEvent.click($('va-button[text="Update page"]', container));
          const modal = container.querySelector('va-modal');

          modal.__events.secondaryButtonClick();
          expect($('va-modal[visible="true"]', container)).not.to.exist;

          // Re-deselects "none" option
          const calledData = setFormDataSpy.lastCall.args[0];

          expect(calledData.toxicExposure.conditions.none).to.be.false;
          expect(calledData.toxicExposure.conditions.chronicbronchitis).to.be
            .true;

          // Does not update review and submit page
          expect(updatePageSpy.called).to.be.false;
        });
      });
    });

    // Primary Deletion Tests
    describe('When the Confirm button is clicked', () => {
      // Toxic exposure data we want to preserve
      const preservedToxicExposureMetadata = {
        conditions: { none: true },
      };

      // Toxic exposure data we want to delete
      const fullToxicExposureMetadata = {
        conditions: { none: true },
        gulfWar1990: {
          bahrain: true,
          airspace: true,
        },
        gulfWar1990Details: {
          bahrain: {
            startDate: '1991-01-01',
            endDate: '1991-12-31',
          },
        },
        gulfWar2001: {
          afghanistan: true,
        },
        gulfWar2001Details: {
          afghanistan: {
            startDate: '2001-10-01',
            endDate: '2002-10-01',
          },
        },
        herbicide: {
          vietnam: true,
        },
        herbicideDetails: {
          vietnam: {
            startDate: '1968-01-01',
            endDate: '1970-01-01',
          },
        },
        additionalExposures: {
          asbestos: true,
        },
        additionalExposuresDetails: {
          asbestos: {
            startDate: '1980-01-01',
            endDate: '1985-01-01',
          },
        },
        specifyOtherExposures: 'Lead exposure',
      };

      // Full toxic exposure data to be cleaned
      const optOutOfExistingToxicExposureMetadata = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: fullToxicExposureMetadata,
      };

      describe('On the toxic exposure page', () => {
        it('closes the modal', () => {
          const { container } = render(
            page({
              data: selectedNoneWithExistingEvidence,
              featureToggleEnabled: true,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');

          modal.__events.primaryButtonClick();
          expect($('va-modal[visible="true"]', container)).not.to.exist;
        });

        it('Deletes all toxic exposure data except conditions and preserves all other form metadata', () => {
          const setFormDataSpy = sinon.spy();
          const { container } = render(
            page({
              data: optOutOfExistingToxicExposureMetadata,
              setFormData: setFormDataSpy,
              featureToggleEnabled: true,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');
          modal.__events.primaryButtonClick();

          expect(setFormDataSpy.called).to.be.true;
          const calledData = setFormDataSpy.lastCall.args[0];
          expect(calledData.toxicExposure).to.deep.equal(
            preservedToxicExposureMetadata,
          );
          expect(calledData.newDisabilities).to.deep.equal([
            { condition: 'Chronic Bronchitis' },
          ]);
        });

        it('Does not advance the page and displays a deletion confirmation alert', async () => {
          const goForwardSpy = sinon.spy();
          const { container } = render(
            page({
              data: selectedNoneWithExistingEvidence,
              goForward: goForwardSpy,
              featureToggleEnabled: true,
            }),
          );

          fireEvent.click($('button[type="submit"]', container));

          const modal = container.querySelector('va-modal');
          modal.__events.primaryButtonClick();

          const alert = container.querySelector(confirmationAlertSelector);
          expect(alert).to.exist;

          const alertElement = $(confirmationAlertSelector, container);
          expect(alertElement.textContent).to.contain(
            'removed toxic exposure conditions from your claim',
          );
          expect(alertElement.textContent).to.contain(
            'Review your conditions and supporting documents to remove any information you',
          );
          // Check for the va-link element instead of textContent
          expect(
            alertElement.querySelector(
              'va-link[text="Continue with your claim"]',
            ),
          ).to.exist;

          expect(goForwardSpy.called).to.be.false;
        });
      });

      describe('On the review and submit page', () => {
        it('closes the modal', () => {
          const { container } = render(
            page({
              data: selectedNoneWithExistingEvidence,
              onReviewPage: true,
              featureToggleEnabled: true,
            }),
          );

          fireEvent.click($('va-button[text="Update page"]', container));
          const modal = container.querySelector('va-modal');

          modal.__events.primaryButtonClick();
          expect($('va-modal[visible="true"]', container)).not.to.exist;
        });

        it('Deletes all toxic exposure data except conditions and preserves all other form metadata', () => {
          const setFormDataSpy = sinon.spy();
          const { container } = render(
            page({
              data: optOutOfExistingToxicExposureMetadata,
              setFormData: setFormDataSpy,
              onReviewPage: true,
              featureToggleEnabled: true,
            }),
          );

          fireEvent.click($('va-button[text="Update page"]', container));
          const modal = container.querySelector('va-modal');
          modal.__events.primaryButtonClick();

          expect(setFormDataSpy.called).to.be.true;
          const calledData = setFormDataSpy.lastCall.args[0];
          expect(calledData.toxicExposure).to.deep.equal(
            preservedToxicExposureMetadata,
          );
          expect(calledData.newDisabilities).to.deep.equal([
            { condition: 'Chronic Bronchitis' },
          ]);
        });

        it('displays a deletion confirmation alert but does NOT include a link to continue with the claim to the next page', async () => {
          const { container } = render(
            page({
              data: selectedNoneWithExistingEvidence,
              onReviewPage: true,
              featureToggleEnabled: true,
            }),
          );

          fireEvent.click($('va-button[text="Update page"]', container));

          const modal = container.querySelector('va-modal');
          modal.__events.primaryButtonClick();

          const alert = container.querySelector(confirmationAlertSelector);
          expect(alert).to.exist;

          const alertElement = $(confirmationAlertSelector, container);
          expect(alertElement.textContent).to.contain(
            'removed toxic exposure conditions from your claim',
          );
          expect(alertElement.textContent).to.contain(
            'Review your conditions and supporting documents to remove any information you',
          );

          expect(alertElement.textContent).not.to.contain(
            'Continue with your claim',
          );
        });
      });
    });

    describe('Page content', () => {
      describe('When rendered on the toxic exposure page', () => {
        it('Displays the page title and description', () => {
          const data = {
            newDisabilities: [{ condition: 'Chronic Bronchitis' }],
            toxicExposure: { conditions: {} },
          };

          const { container } = render(page({ data }));

          expect(container.textContent).to.contain('Toxic exposure');
          // The question text is in the VaCheckboxGroup label which may not render in tests
          // Instead check for the checkbox group and description
          expect(container.querySelector('va-checkbox-group')).to.exist;
          expect(container.textContent).to.contain(
            'Learn more about toxic exposure',
          );
        });

        it('Displays forward and back buttons', () => {
          const data = {
            newDisabilities: [{ condition: 'Chronic Bronchitis' }],
            toxicExposure: { conditions: {} },
          };

          const { container } = render(page({ data }));
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
        it('Does not display forward and back buttons', () => {
          const data = {
            newDisabilities: [{ condition: 'Chronic Bronchitis' }],
            toxicExposure: { conditions: {} },
          };

          const { container } = render(page({ data, onReviewPage: true }));
          const continueButton = $(
            '.usa-button-primary[type="submit"][text="Continue"]',
            container,
          );
          expect(continueButton).not.to.exist;

          const backButton = $('.usa-button-secondary', container);
          expect(backButton).not.to.exist;
        });

        it('Displays update page button', () => {
          const data = {
            newDisabilities: [{ condition: 'Chronic Bronchitis' }],
            toxicExposure: { conditions: {} },
          };

          const { container } = render(page({ data, onReviewPage: true }));

          expect($('va-button[text="Update page"]', container)).to.exist;
        });
      });
    });
  });

  describe('Modal content', () => {
    it('should display correct modal title and content', () => {
      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
        },
      };

      const { container } = render(page({ data, featureToggleEnabled: true }));
      fireEvent.click($('button[type="submit"]', container));

      const modal = container.querySelector('va-modal');
      expect(modal).to.exist;

      // Check modal title
      expect(modal.innerHTML).to.contain(
        'Remove toxic exposure conditions from your claim?',
      );

      // Check modal content lists
      expect(modal.innerHTML).to.contain('Toxic exposure conditions');
      expect(modal.innerHTML).to.contain(
        'Gulf War service locations and dates (1990 and 2001)',
      );
      expect(modal.innerHTML).to.contain(
        'Agent Orange exposure locations and dates',
      );
      expect(modal.innerHTML).to.contain(
        'Other toxic exposure details and dates',
      );

      // Check button text
      expect(modal.getAttribute('primary-button-text')).to.equal(
        'Yes, remove toxic exposure information',
      );
      expect(modal.getAttribute('secondary-button-text')).to.equal(
        'No, return to claim',
      );
    });
  });

  describe('Alert confirmation content', () => {
    it('should display correct confirmation alert after deletion', () => {
      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
        },
      };

      const { container } = render(page({ data, featureToggleEnabled: true }));
      fireEvent.click($('button[type="submit"]', container));

      const modal = container.querySelector('va-modal');
      modal.__events.primaryButtonClick();

      const alert = container.querySelector(
        'va-alert[status="warning"][visible="true"]',
      );
      expect(alert).to.exist;

      expect(alert.textContent).to.contain(
        'removed toxic exposure conditions from your claim',
      );
      expect(alert.textContent).to.contain(
        'Review your conditions and supporting documents to remove any information you',
      );
    });
  });

  describe('Feature toggle for toxic exposure destruction modal', () => {
    const dataWithNoneSelectedAndExistingData = {
      newDisabilities: [{ condition: 'Chronic Bronchitis' }],
      toxicExposure: {
        conditions: {
          none: true,
        },
        gulfWar1990: {
          bahrain: true,
        },
      },
    };

    describe('when feature toggle is enabled', () => {
      it('should show the modal when "none" is selected with existing data', () => {
        const { container } = render(
          page({
            data: dataWithNoneSelectedAndExistingData,
            featureToggleEnabled: true,
          }),
        );

        fireEvent.click($('button[type="submit"]', container));
        expect($('va-modal[visible="true"]', container)).to.exist;
      });

      it('should delete toxic exposure data when confirming modal', () => {
        const setFormDataSpy = sinon.spy();
        const { container } = render(
          page({
            data: dataWithNoneSelectedAndExistingData,
            setFormData: setFormDataSpy,
            featureToggleEnabled: true,
          }),
        );

        fireEvent.click($('button[type="submit"]', container));

        const modal = container.querySelector('va-modal');
        modal.__events.primaryButtonClick();

        // Should have called setFormData with deleted toxic exposure data
        expect(setFormDataSpy.called).to.be.true;
        const calledData = setFormDataSpy.lastCall.args[0];
        expect(calledData.toxicExposure.gulfWar1990).to.be.undefined;
        expect(calledData.toxicExposure.conditions.none).to.be.true;
      });

      it('should show confirmation alert after deleting data', () => {
        const { container } = render(
          page({
            data: dataWithNoneSelectedAndExistingData,
            featureToggleEnabled: true,
          }),
        );

        fireEvent.click($('button[type="submit"]', container));

        const modal = container.querySelector('va-modal');
        modal.__events.primaryButtonClick();

        const alert = container.querySelector(
          'va-alert[status="warning"][visible="true"]',
        );
        expect(alert).to.exist;
      });
    });

    describe('when feature toggle is disabled', () => {
      it('should NOT show the modal when "none" is selected with existing data', () => {
        const goForwardSpy = sinon.spy();
        const { container } = render(
          page({
            data: dataWithNoneSelectedAndExistingData,
            goForward: goForwardSpy,
            featureToggleEnabled: false,
          }),
        );

        fireEvent.click($('button[type="submit"]', container));

        // Should not show modal
        expect($('va-modal[visible="true"]', container)).not.to.exist;

        // Should proceed forward
        expect(goForwardSpy.called).to.be.true;
      });

      it('should NOT delete toxic exposure data when feature toggle is disabled', () => {
        const setFormDataSpy = sinon.spy();
        const goForwardSpy = sinon.spy();
        const { container } = render(
          page({
            data: dataWithNoneSelectedAndExistingData,
            setFormData: setFormDataSpy,
            goForward: goForwardSpy,
            featureToggleEnabled: false,
          }),
        );

        fireEvent.click($('button[type="submit"]', container));

        // Should not have called setFormData to delete data
        expect(setFormDataSpy.called).to.be.false;

        // Should proceed forward
        expect(goForwardSpy.called).to.be.true;
      });

      it('should work the same on review page when feature toggle is disabled', () => {
        const updatePageSpy = sinon.spy();
        const { container } = render(
          page({
            data: dataWithNoneSelectedAndExistingData,
            updatePage: updatePageSpy,
            onReviewPage: true,
            featureToggleEnabled: false,
          }),
        );

        fireEvent.click($('va-button[text="Update page"]', container));

        // Should not show modal
        expect($('va-modal[visible="true"]', container)).not.to.exist;

        // Should update page
        expect(updatePageSpy.called).to.be.true;
      });
    });
  });
});
