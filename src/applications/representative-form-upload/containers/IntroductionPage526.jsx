import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Toggler } from 'platform/utilities/feature-toggles';
import { useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import {
  VaAlert,
  VaButton,
  VaLink,
  VaLinkAction,
  VaProcessList,
  VaProcessListItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from 'platform/monitoring/record-event';
import { getFormContent, getFormNumber } from '../helpers';
import { SIGN_IN_URL } from '../constants';

const IntroductionPage526 = ({ route, router }) => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const formNumber = getFormNumber();
  const { pdfDownloadUrl } = getFormContent();

  const goToSignIn = () => {
    window.location = SIGN_IN_URL;
  };

  const startBtn = useMemo(
    () => {
      const startForm = event => {
        event.preventDefault();
        sessionStorage.setItem('formIncompleteARP', 'true');
        recordEvent({ event: `${formNumber}-start-form` });
        return router.push(route.pageList[1].path);
      };
      return (
        <VaLinkAction
          href={route.pageList[1].path}
          class=" representative-form__start"
          text="Start the submission"
          onClick={startForm}
          type="primary"
        />
      );
    },
    [route.pageList, router],
  );
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <Toggler
      toggleName={
        Toggler.TOGGLE_NAMES.accreditedRepresentativePortalEnable526ezBdd
      }
    >
      <Toggler.Enabled>
        <article className="schemaform-intro representative-form">
          <h1>Submit VA Form 21-526EZ</h1>
          <p className="va-introtext">
            Application for Disability Compensation and Related Compensation
            Benefits
          </p>
          <h2 className="representative-form__h2">
            Follow these steps to complete the submission
          </h2>
          <VaProcessList>
            <VaProcessListItem header="Make sure you represent the claimant">
              <p>
                The portal won’t allow you to complete the submission if you or
                your Veterans Service Organization (VSO) don’t represent the
                claimant.
              </p>
            </VaProcessListItem>
            <VaProcessListItem header="Prepare the form and supporting documents">
              <p>
                Download the form on your computer and fill it out, or print and
                complete it by hand. For smooth processing, make sure you:
              </p>
              <ul>
                <li>Provide all the required information</li>
                <li>Sign the form</li>
              </ul>
              <VaLink
                download
                filetype="PDF"
                href={pdfDownloadUrl}
                onClick={e => {
                  e.preventDefault();
                  window.open(pdfDownloadUrl, '_blank');
                }}
                text={`Download VA Form ${formNumber}`}
              />
              <p>
                If this is a Benefits Delivery at Discharge (BDD) claim, you’ll
                need to include a completed Separation Health Assessment - Part
                A Self-Assessment form.
              </p>
              <VaLink
                class="vads-u-margin-y--2 vads-u-display--block "
                href="https://www.va.gov/disability/how-to-file-claim/when-to-file/pre-discharge-claim/"
                text="Learn about the Benefits Delivery at Discharge (BDD) program"
              />
              <VaLink
                download
                filetype="PDF"
                href="https://www.benefits.va.gov/compensation/docs/SHA_DBQ_Part_A_Self-Assessment.pdf"
                onClick={e => {
                  e.preventDefault();
                  window.open(pdfDownloadUrl, '_blank');
                }}
                text="Download Separation Health Assessment - Part A Self-Assessment"
              />
            </VaProcessListItem>
            <VaProcessListItem header="Upload and submit VA Form 21-526EZ">
              <p>
                Fill out all the required steps, upload the form and supporting
                documents, and submit.
              </p>
              <p>
                <strong>Note:</strong> The portal can’t check for mistakes in
                uploaded forms. Check for any mistakes before you upload.
              </p>
            </VaProcessListItem>
          </VaProcessList>
          {userLoggedIn ? (
            startBtn
          ) : (
            <VaAlert status="info" visible>
              <h2 slot="headline">Sign in now to upload your form</h2>
              <p>
                By signing in we can fill in some of your information for you to
                save you time.
              </p>
              <VaButton
                text="Sign in to start uploading your form"
                onClick={goToSignIn}
              />
            </VaAlert>
          )}
        </article>
      </Toggler.Enabled>
      <Toggler.Disabled>
        <article className="schemaform-intro representative-form">
          <h1>Submit VA Form 21-526EZ</h1>
          <p className="va-introtext">
            Application for Disability Compensation and Related Compensation
            Benefits
          </p>
          <h2 className="representative-form__h2">
            Follow these steps to submit the form
          </h2>
          <VaProcessList>
            <VaProcessListItem header="Confirm that you represent the claimant">
              <p>
                Make sure you or your Veterans Service Organization (VSO) have
                established representation with the claimant. If you don’t
                currently represent them, the portal will not allow you to
                submit the form.
              </p>
            </VaProcessListItem>
            <VaProcessListItem header="Download, fill out, and sign the form">
              <p>
                Download the form on your computer and fill it out, or print and
                complete it by hand. For smooth processing, make sure you:
              </p>
              <ul>
                <li>Provide all the required information</li>
                <li>Sign the form</li>
              </ul>
              <VaLink
                download
                filetype="PDF"
                href={pdfDownloadUrl}
                onClick={e => {
                  e.preventDefault();
                  window.open(pdfDownloadUrl, '_blank');
                }}
                text={`Download VA Form ${formNumber}`}
              />
            </VaProcessListItem>
            <VaProcessListItem header="Upload and submit the form">
              <p>
                First provide information about the claimant so we can confirm
                that you represent them. Then upload the form, review, and
                submit the form.
              </p>
              <p>
                <strong>Note:</strong> The portal can’t check for mistakes in
                your form, so make sure you review all the information before
                you upload and submit.
              </p>
              <p>When you’re ready, start the process below.</p>
            </VaProcessListItem>
          </VaProcessList>
          {userLoggedIn ? (
            startBtn
          ) : (
            <VaAlert status="info" visible>
              <h2 slot="headline">Sign in now to upload your form</h2>
              <p>
                By signing in we can fill in some of your information for you to
                save you time.
              </p>
              <VaButton
                text="Sign in to start uploading your form"
                onClick={goToSignIn}
              />
            </VaAlert>
          )}
        </article>
      </Toggler.Disabled>
    </Toggler>
  );
};

IntroductionPage526.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default IntroductionPage526;
