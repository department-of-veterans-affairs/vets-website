import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import ToxicExposureChoicePage from '../../pages/toxicExposure/toxicExposureChoicePage';

describe('ToxicExposureChoicePage', () => {
  const TOXIC_EXPOSURE_TOGGLE_NAME =
    'disabilityCompensationToxicExposureDestructionModal';

  // Helper function to create mock functions with tracking
  const createMockFn = () => {
    const calls = [];
    const fn = (...args) => {
      calls.push(args);
      fn.called = true;
      fn.calledOnce = calls.length === 1;
      fn.callCount = calls.length;
      fn.lastCall = { args };
      return undefined;
    };

    fn.calls = calls;
    fn.called = false;
    fn.calledOnce = false;
    fn.lastCall = { args: [] };
    fn.callCount = 0;
    fn.calledWith = (...args) => {
      return calls.some(
        call =>
          call.length === args.length &&
          call.every((arg, i) => arg === args[i]),
      );
    };

    return fn;
  };

  // Helper function to click modal buttons by text
  const clickModalButton = async buttonText => {
    const modal = document.querySelector('va-modal');
    const buttons = modal?.querySelectorAll('button') || [];
    const button = Array.from(buttons).find(
      b => b.textContent.trim() === buttonText,
    );
    if (button) {
      await userEvent.click(button);
    }
  };

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

  const renderPage = ({
    data = {},
    goBack = null,
    goForward = null,
    setFormData = null,
    updatePage = null,
    onReviewPage = false,
    featureToggleEnabled = true,
  } = {}) => {
    // Create mocks if not provided
    const goBackFn = goBack || createMockFn();
    const goForwardFn = goForward || createMockFn();
    const setFormDataFn = setFormData || createMockFn();
    const updatePageFn = updatePage || createMockFn();
    const mockStore = getMockStore(featureToggleEnabled);

    const utils = render(
      <Provider store={mockStore}>
        <ToxicExposureChoicePage
          setFormData={setFormDataFn}
          data={data}
          goBack={goBackFn}
          goForward={goForwardFn}
          onReviewPage={onReviewPage}
          updatePage={updatePageFn}
        />
      </Provider>,
    );

    return {
      ...utils,
      goBack: goBackFn,
      goForward: goForwardFn,
      setFormData: setFormDataFn,
      updatePage: updatePageFn,
      user: userEvent,
    };
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

      renderPage({ data });

      // Should render checkbox for each new condition
      expect(document.querySelector('va-checkbox[label="Chronic Bronchitis"]'))
        .to.exist;
      expect(document.querySelector('va-checkbox[label="Asthma"]')).to.exist;

      // Should render the "none" option
      expect(
        document.querySelector(
          'va-checkbox[label="I am not claiming any conditions related to toxic exposure"]',
        ),
      ).to.exist;
    });

    it('should submit when selecting one or more conditions', async () => {
      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: {
            chronicbronchitis: true,
          },
        },
      };

      const { goForward, user } = renderPage({ data });
      const submitButton = document.querySelector('button[type="submit"]');

      await user.click(submitButton);

      await waitFor(() => {
        expect(goForward.calledOnce).to.be.true;
        expect(goForward.calledWith(data)).to.be.true;
      });
    });

    it('should allow navigation when no condition is selected and no existing toxic exposure data', async () => {
      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: {},
        },
      };

      const { goForward, user } = renderPage({ data });
      const submitButton = document.querySelector('button[type="submit"]');

      await user.click(submitButton);

      await waitFor(() => {
        expect(goForward.calledOnce).to.be.true;
      });
    });

    it('should show modal when no condition is selected but has existing toxic exposure data', async () => {
      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: {},
          gulfWar1990: {
            bahrain: true,
          },
        },
      };

      const { goForward, user } = renderPage({
        data,
        featureToggleEnabled: true,
      });
      const submitButton = document.querySelector('button[type="submit"]');

      await user.click(submitButton);

      await waitFor(() => {
        const modal = document.querySelector('va-modal');
        expect(modal).to.exist;
        expect(modal.getAttribute('visible')).to.equal('true');
        expect(goForward.called).to.be.false;
      });
    });

    it('should allow navigation when selecting "none" option and no existing data', async () => {
      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: {
            none: true,
          },
        },
      };

      const { goForward, user } = renderPage({ data });
      const submitButton = document.querySelector('button[type="submit"]');

      await user.click(submitButton);

      await waitFor(() => {
        expect(goForward.calledOnce).to.be.true;
      });
    });

    it('should show modal when selecting "none" option but has existing toxic exposure data', async () => {
      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: {
            none: true,
          },
          herbicide: {
            vietnam: true,
          },
        },
      };

      const { goForward, user } = renderPage({
        data,
        featureToggleEnabled: true,
      });
      const submitButton = document.querySelector('button[type="submit"]');

      await user.click(submitButton);

      await waitFor(() => {
        const modal = document.querySelector('va-modal');
        expect(modal).to.exist;
        expect(modal.getAttribute('visible')).to.equal('true');
        expect(goForward.called).to.be.false;
      });
    });
  });

  describe('Display modal for deleting already entered toxic exposure data', () => {
    describe('when conditions are selected but no existing toxic exposure data has been filled out', () => {
      it('does not show the modal and allows navigation', async () => {
        const data = {
          newDisabilities: [{ condition: 'Chronic Bronchitis' }],
          toxicExposure: {
            conditions: {
              chronicbronchitis: true,
            },
          },
        };

        const { goForward, user } = renderPage({ data });
        const submitButton = document.querySelector('button[type="submit"]');

        await user.click(submitButton);

        await waitFor(() => {
          expect(document.querySelector('va-modal[visible="true"]')).not.to
            .exist;
          expect(goForward.calledOnce).to.be.true;
        });
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

      it('displays the modal for Gulf War 1990 locations', async () => {
        const data = {
          ...baseDataNoneSelected,
          toxicExposure: {
            ...baseDataNoneSelected.toxicExposure,
            gulfWar1990: {
              bahrain: true,
            },
          },
        };

        const { user } = renderPage({ data, featureToggleEnabled: true });
        const submitButton = document.querySelector('button[type="submit"]');

        await user.click(submitButton);

        await waitFor(() => {
          const modal = document.querySelector('va-modal');
          expect(modal).to.exist;
          expect(modal.getAttribute('visible')).to.equal('true');
        });
      });

      it('displays the modal for Gulf War 2001 locations', async () => {
        const data = {
          ...baseDataNoneSelected,
          toxicExposure: {
            ...baseDataNoneSelected.toxicExposure,
            gulfWar2001: {
              afghanistan: true,
            },
          },
        };

        const { user } = renderPage({ data, featureToggleEnabled: true });
        const submitButton = document.querySelector('button[type="submit"]');

        await user.click(submitButton);

        await waitFor(() => {
          const modal = document.querySelector('va-modal');
          expect(modal).to.exist;
          expect(modal.getAttribute('visible')).to.equal('true');
        });
      });

      it('displays the modal for herbicide locations', async () => {
        const data = {
          ...baseDataNoneSelected,
          toxicExposure: {
            ...baseDataNoneSelected.toxicExposure,
            herbicide: {
              vietnam: true,
            },
          },
        };

        const { user } = renderPage({ data, featureToggleEnabled: true });
        const submitButton = document.querySelector('button[type="submit"]');

        await user.click(submitButton);

        await waitFor(() => {
          const modal = document.querySelector('va-modal');
          expect(modal).to.exist;
          expect(modal.getAttribute('visible')).to.equal('true');
        });
      });

      it('displays the modal for additional exposures', async () => {
        const data = {
          ...baseDataNoneSelected,
          toxicExposure: {
            ...baseDataNoneSelected.toxicExposure,
            additionalExposures: {
              asbestos: true,
            },
          },
        };

        const { user } = renderPage({ data, featureToggleEnabled: true });
        const submitButton = document.querySelector('button[type="submit"]');

        await user.click(submitButton);

        await waitFor(() => {
          const modal = document.querySelector('va-modal');
          expect(modal).to.exist;
          expect(modal.getAttribute('visible')).to.equal('true');
        });
      });

      it('does not display the modal when data was unchecked', async () => {
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

        const { goForward, user } = renderPage({ data });
        const submitButton = document.querySelector('button[type="submit"]');

        await user.click(submitButton);

        await waitFor(() => {
          expect(document.querySelector('va-modal[visible="true"]')).not.to
            .exist;
          expect(goForward.calledOnce).to.be.true;
        });
      });
    });
  });

  describe('Modal delete action selection', () => {
    const confirmationAlertSelector =
      'va-alert[status="warning"][visible="true"][close-btn-aria-label="Deleted toxic exposure confirmation"]';

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
        conditions: { none: true },
        ...existingToxicExposureEvidence,
      },
    };

    describe('When the close button is clicked', () => {
      it('closes the modal and reverts "none" selection if it was selected', async () => {
        const { setFormData, goForward, user } = renderPage({
          data: selectedNoneWithExistingEvidence,
          featureToggleEnabled: true,
        });

        const submitButton = document.querySelector('button[type="submit"]');
        await user.click(submitButton);

        await waitFor(() => {
          const modal = document.querySelector('va-modal');
          expect(modal).to.exist;
        });

        const modal = document.querySelector('va-modal');
        // Simulate modal close event
        modal.__events.closeEvent();

        await waitFor(() => {
          expect(document.querySelector('va-modal[visible="true"]')).not.to
            .exist;

          // Should revert "none" selection
          expect(setFormData.called).to.be.true;
          const calledData = setFormData.lastCall.args[0];
          expect(calledData.toxicExposure.conditions.none).to.be.false;

          // Should not advance page
          expect(goForward.called).to.be.false;
        });
      });

      it('closes the modal without changes when nothing was selected', async () => {
        const data = {
          newDisabilities: [{ condition: 'Chronic Bronchitis' }],
          toxicExposure: {
            conditions: {},
            gulfWar1990: {
              bahrain: true,
            },
          },
        };

        const { setFormData, goForward, user } = renderPage({
          data,
          featureToggleEnabled: true,
        });

        const submitButton = document.querySelector('button[type="submit"]');
        await user.click(submitButton);

        await waitFor(() => {
          const modal = document.querySelector('va-modal');
          expect(modal).to.exist;
        });

        const modal = document.querySelector('va-modal');
        modal.__events.closeEvent();

        await waitFor(() => {
          expect(document.querySelector('va-modal[visible="true"]')).not.to
            .exist;

          // Should not call setFormData when nothing needs reverting
          expect(setFormData.called).to.be.false;

          // Should not advance page
          expect(goForward.called).to.be.false;
        });
      });
    });

    describe('When the cancel button is clicked', () => {
      it('closes the modal and reverts "none" selection if it was selected', async () => {
        const { setFormData, goForward, user } = renderPage({
          data: selectedNoneWithExistingEvidence,
          featureToggleEnabled: true,
        });

        const submitButton = document.querySelector('button[type="submit"]');
        await user.click(submitButton);

        await waitFor(() => {
          const modal = document.querySelector('va-modal');
          expect(modal).to.exist;
        });

        await clickModalButton('No, return to claim');

        await waitFor(() => {
          expect(document.querySelector('va-modal[visible="true"]')).not.to
            .exist;

          // Should revert "none" selection
          expect(setFormData.called).to.be.true;
          const calledData = setFormData.lastCall.args[0];
          expect(calledData.toxicExposure.conditions.none).to.be.false;

          // Should not advance page
          expect(goForward.called).to.be.false;
        });
      });
    });

    describe('When the Confirm button is clicked', () => {
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

      const optOutOfExistingToxicExposureMetadata = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: fullToxicExposureMetadata,
      };

      it('deletes all toxic exposure data except conditions when "none" is selected', async () => {
        const { setFormData, user } = renderPage({
          data: optOutOfExistingToxicExposureMetadata,
          featureToggleEnabled: true,
        });

        const submitButton = document.querySelector('button[type="submit"]');
        await user.click(submitButton);

        await waitFor(() => {
          const modal = document.querySelector('va-modal');
          expect(modal).to.exist;
        });

        await clickModalButton('Yes, remove condition');

        await waitFor(() => {
          expect(setFormData.called).to.be.true;
          const calledData = setFormData.lastCall.args[0];
          expect(calledData.toxicExposure).to.deep.equal({
            conditions: { none: true },
          });
          expect(calledData.newDisabilities).to.deep.equal([
            { condition: 'Chronic Bronchitis' },
          ]);
        });
      });

      it('deletes all toxic exposure data when nothing is selected', async () => {
        const dataWithNoSelection = {
          newDisabilities: [{ condition: 'Chronic Bronchitis' }],
          toxicExposure: {
            ...fullToxicExposureMetadata,
            conditions: {},
          },
        };

        const { setFormData, user } = renderPage({
          data: dataWithNoSelection,
          featureToggleEnabled: true,
        });

        const submitButton = document.querySelector('button[type="submit"]');
        await user.click(submitButton);

        await waitFor(() => {
          const modal = document.querySelector('va-modal');
          expect(modal).to.exist;
        });

        await clickModalButton('Yes, remove condition');

        await waitFor(() => {
          expect(setFormData.called).to.be.true;
          const calledData = setFormData.lastCall.args[0];
          expect(calledData.toxicExposure).to.deep.equal({ conditions: {} });
          expect(calledData.newDisabilities).to.deep.equal([
            { condition: 'Chronic Bronchitis' },
          ]);
        });
      });

      it('displays deletion confirmation alert', async () => {
        const { user } = renderPage({
          data: selectedNoneWithExistingEvidence,
          featureToggleEnabled: true,
        });

        const submitButton = document.querySelector('button[type="submit"]');
        await user.click(submitButton);

        await waitFor(() => {
          const modal = document.querySelector('va-modal');
          expect(modal).to.exist;
        });

        await clickModalButton('Yes, remove condition');

        await waitFor(() => {
          const alert = document.querySelector(confirmationAlertSelector);
          expect(alert).to.exist;
          expect(alert.textContent).to.contain(
            'removed toxic exposure conditions from your claim',
          );
        });
      });
    });
  });

  describe('Page content', () => {
    it('displays the page title and checkboxes', () => {
      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: { conditions: {} },
      };

      const { container } = renderPage({ data });

      expect(container.textContent).to.contain('Toxic exposure');
      expect(document.querySelector('va-checkbox-group')).to.exist;
      expect(container.textContent).to.contain(
        'Learn more about toxic exposure',
      );
    });

    it('displays forward and back buttons on the form page', () => {
      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: { conditions: {} },
      };

      renderPage({ data });

      const continueButton = document.querySelector(
        '.usa-button-primary[type="submit"]',
      );
      expect(continueButton).to.exist;
      expect(continueButton.textContent).to.contain('Continue');

      const backButton = document.querySelector(
        '.form-progress-buttons .usa-button-secondary',
      );
      expect(backButton).to.exist;
      expect(backButton.textContent).to.contain('Back');
    });

    it('displays update button on review page', () => {
      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: { conditions: {} },
      };

      renderPage({ data, onReviewPage: true });

      expect(document.querySelector('va-button[text="Update page"]')).to.exist;
      expect(
        document.querySelector(
          '.usa-button-primary[type="submit"][text="Continue"]',
        ),
      ).not.to.exist;
      expect(
        document.querySelector('.form-progress-buttons .usa-button-secondary'),
      ).not.to.exist;
    });
  });

  describe('Modal content', () => {
    it('displays correct modal title and content', async () => {
      const data = {
        newDisabilities: [{ condition: 'Chronic Bronchitis' }],
        toxicExposure: {
          conditions: { none: true },
          gulfWar1990: { bahrain: true },
        },
      };

      const { user } = renderPage({ data, featureToggleEnabled: true });
      const submitButton = document.querySelector('button[type="submit"]');

      await user.click(submitButton);

      await waitFor(() => {
        const modal = document.querySelector('va-modal');
        expect(modal).to.exist;

        // Check modal title
        expect(modal.innerHTML).to.contain(
          'Remove condition related to toxic exposure?',
        );

        // Check modal content lists
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
        const buttons = modal.querySelectorAll('button');
        expect(buttons).to.have.length(2);
        expect(buttons[0].textContent.trim()).to.equal('Yes, remove condition');
        expect(buttons[1].textContent.trim()).to.equal('No, return to claim');
      });
    });
  });

  describe('Feature toggle for toxic exposure destruction modal', () => {
    const dataWithNoneSelectedAndExistingData = {
      newDisabilities: [{ condition: 'Chronic Bronchitis' }],
      toxicExposure: {
        conditions: { none: true },
        gulfWar1990: { bahrain: true },
      },
    };

    describe('when feature toggle is enabled', () => {
      it('shows the modal when "none" is selected with existing data', async () => {
        const { user } = renderPage({
          data: dataWithNoneSelectedAndExistingData,
          featureToggleEnabled: true,
        });

        const submitButton = document.querySelector('button[type="submit"]');
        await user.click(submitButton);

        await waitFor(() => {
          expect(document.querySelector('va-modal[visible="true"]')).to.exist;
        });
      });

      it('shows the modal when nothing is selected with existing data', async () => {
        const dataWithNoSelection = {
          newDisabilities: [{ condition: 'Chronic Bronchitis' }],
          toxicExposure: {
            conditions: {},
            gulfWar1990: { bahrain: true },
          },
        };

        const { user } = renderPage({
          data: dataWithNoSelection,
          featureToggleEnabled: true,
        });

        const submitButton = document.querySelector('button[type="submit"]');
        await user.click(submitButton);

        await waitFor(() => {
          expect(document.querySelector('va-modal[visible="true"]')).to.exist;
        });
      });

      it('deletes toxic exposure data when confirming modal', async () => {
        const { setFormData, user } = renderPage({
          data: dataWithNoneSelectedAndExistingData,
          featureToggleEnabled: true,
        });

        const submitButton = document.querySelector('button[type="submit"]');
        await user.click(submitButton);

        await waitFor(() => {
          const modal = document.querySelector('va-modal');
          expect(modal).to.exist;
        });

        await clickModalButton('Yes, remove condition');

        await waitFor(() => {
          expect(setFormData.called).to.be.true;
          const calledData = setFormData.lastCall.args[0];
          expect(calledData.toxicExposure.conditions.none).to.be.true;
        });
      });
    });

    describe('when feature toggle is disabled', () => {
      it('does NOT show the modal and proceeds forward', async () => {
        const { goForward, user } = renderPage({
          data: dataWithNoneSelectedAndExistingData,
          featureToggleEnabled: false,
        });

        const submitButton = document.querySelector('button[type="submit"]');
        await user.click(submitButton);

        await waitFor(() => {
          expect(document.querySelector('va-modal[visible="true"]')).not.to
            .exist;
          expect(goForward.calledOnce).to.be.true;
        });
      });

      it('does NOT delete toxic exposure data when feature toggle is disabled', async () => {
        const { setFormData, goForward, user } = renderPage({
          data: dataWithNoneSelectedAndExistingData,
          featureToggleEnabled: false,
        });

        const submitButton = document.querySelector('button[type="submit"]');
        await user.click(submitButton);

        await waitFor(() => {
          expect(setFormData.called).to.be.false;
          expect(goForward.calledOnce).to.be.true;
        });
      });
    });
  });
});
