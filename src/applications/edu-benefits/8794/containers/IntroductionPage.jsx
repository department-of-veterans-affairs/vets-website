import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import { useSelector } from 'react-redux';
import { scrollToTop } from 'platform/utilities/scroll';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import OmbInfo from '../components/OmbInfo';

const IntroductionPage = ({ route }) => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  useEffect(() => {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }, []);

  useEffect(() => {
    const vaOmbInfoButton = document.getElementById('va-omb-info');
    let closeButtonInModalShadowDom = null;
    let modalObserver = null;

    const handleCloseModalClick = () => {
      if (vaOmbInfoButton) {
        const vaButton = vaOmbInfoButton.shadowRoot.querySelector(
          'va-button[secondary]',
        );
        const button = vaButton.shadowRoot.querySelector(
          'button[class="usa-button usa-button--outline"]',
        );
        button.focus();
      }

      // Cleanup the observer once the modal is closed and btn is focused
      if (modalObserver) {
        modalObserver.disconnect();
        modalObserver = null;
      }
      // Remove listener from the close button if it's going away
      if (closeButtonInModalShadowDom) {
        closeButtonInModalShadowDom.removeEventListener(
          'click',
          handleCloseModalClick,
        );
        closeButtonInModalShadowDom = null;
      }
    };

    const setupCloseButtonObserverInModal = modalShadowRoot => {
      if (modalObserver) {
        modalObserver.disconnect();
      }

      modalObserver = new MutationObserver(
        (mutationsList, observerInstance) => {
          for (const mutation of mutationsList) {
            if (
              mutation.type === 'childList' &&
              mutation.addedNodes.length > 0
            ) {
              const foundCloseButton = modalShadowRoot.querySelector(
                'button[aria-label="Close Privacy Act Statement modal"]',
              );

              if (foundCloseButton) {
                if (closeButtonInModalShadowDom) {
                  closeButtonInModalShadowDom.removeEventListener(
                    'click',
                    handleCloseModalClick,
                  );
                }
                closeButtonInModalShadowDom = foundCloseButton;
                closeButtonInModalShadowDom.addEventListener(
                  'click',
                  handleCloseModalClick,
                );

                observerInstance.disconnect();
                modalObserver = null;
                return; // Exit the loop and function
              }
            }
          }
        },
      );
      modalObserver.observe(modalShadowRoot, {
        childList: true,
        subtree: true,
      });
    };

    const handleOpenModalClick = () => {
      if (vaOmbInfoButton && vaOmbInfoButton.shadowRoot) {
        const outerShadowRoot = vaOmbInfoButton.shadowRoot;

        // Step 1: Find the <va-modal> element within the va-omb-info's Shadow DOM
        const vaModalElement = outerShadowRoot.querySelector('va-modal');

        if (vaModalElement && vaModalElement.shadowRoot) {
          setupCloseButtonObserverInModal(vaModalElement.shadowRoot);
        }
      }
    };

    // --- Setup on Component Mount ---
    if (vaOmbInfoButton) {
      vaOmbInfoButton.addEventListener('click', handleOpenModalClick);
    }

    return () => {
      if (vaOmbInfoButton) {
        vaOmbInfoButton.removeEventListener('click', handleOpenModalClick);
      }
      if (closeButtonInModalShadowDom) {
        closeButtonInModalShadowDom.removeEventListener(
          'click',
          handleCloseModalClick,
        );
      }
      if (modalObserver) {
        modalObserver.disconnect();
      }
    };
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title="Update your institution’s list of certifying officials" />
      <p className="vads-u-margin-y--2">
        Designation of certifying official(s) (VA Form 22-8794)
      </p>
      <va-alert status="info" visible>
        <h2 slot="headline">
          For educational institutions and training facilities only
        </h2>
        <p>
          Note: This form is intended for educational institutions and training
          facilities submitting reports regarding school certifying officials.
        </p>
      </va-alert>
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2 mobile-lg:vads-u-margin-y--4">
        What to know before you fill out this form
      </h2>
      <p>
        This form is used to tell us about any changes related to your school’s
        certifying officials. Be sure to include the names and titles of{' '}
        <strong>all</strong> certifying officials at your school or training
        facility, not just the information that has changed.
        <br />
        <br />
        <strong>Note: </strong>
        This form will replace the one you submitted before. It should list
        everyone who is authorized to certify enrollment information and
        “read-only SCOs” who have permission to request or submit information to
        VA.
      </p>

      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-bottom--2">
        How to submit this form
      </h2>
      <va-process-list>
        <va-process-list-item header="Complete the form">
          <p>
            Fill out the form online. Ensure you have all the necessary details,
            such as your list of certifying officials, their contact information
            and Section 305 training dates before continuing.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Download the completed form as a PDF">
          <p>
            When you reach the final step of this form, be sure to download and
            save the PDF to your device.
            <br />
            <br />
            <strong>Note: </strong> This online tool does not submit the form
            for you. You must download your completed form as a PDF and proceed
            to the next step.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Upload your PDF to the Education File Upload Portal or email it to your State Approving Agency (SAA)">
          <p className="vads-u-margin-top--1p5">
            <strong>If your institution has a VA facility code:</strong> Go to
            the Education File Upload Portal and upload the completed PDF
            document that you downloaded. This is how you submit this form.
          </p>
          <p>
            <strong>
              If your institution doesn’t have a VA facility code:
            </strong>{' '}
            Email your completed PDF to your State Approving Agency (SAA). If
            you need help finding their email address,{' '}
            <va-link
              text="search the SAA contact directory"
              href="https://nasaa-vetseducation.com/nasaa-contacts/"
              external
            />
            .
          </p>
        </va-process-list-item>
      </va-process-list>
      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-y--4">
        Start the form
      </h2>
      <SaveInProgressIntro
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        formConfig={route.formConfig}
        pageList={route.pageList}
        startText="Start your Designation of certifying official(s)"
        unauthStartText="Sign in to start your form"
        hideUnauthedStartLink={!userLoggedIn}
      />

      <div
        className={userLoggedIn ? 'vads-u-margin-top--4' : ''}
        data-testid="omb-info"
      >
        <OmbInfo />
      </div>
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
