import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import FormTitle from '~/platform/forms-system/src/js/components/FormTitle';
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

const IntroductionPage = ({ route, router }) => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const formNumber = getFormNumber();
  const { subTitle, pdfDownloadUrl } = getFormContent();

  const goToSignIn = () => {
    window.location = SIGN_IN_URL;
  };

  const startBtn = useMemo(
    () => {
      const startForm = () => {
        sessionStorage.setItem('formIncompleteARP', 'true');
        recordEvent({ event: `${formNumber}-start-form` });
        return router.push(route.pageList[1].path);
      };
      return (
        <VaLinkAction
          href="#start"
          label="Start form upload and submission"
          class=" representative-form__start"
          text="Start form upload and submission"
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
    <article className="schemaform-intro representative-form">
      <FormTitle title={`Submit VA Form ${formNumber}`} subTitle={subTitle} />
      <h2 className="representative-form__h2">
        Follow these steps to submit the form
      </h2>
      <VaProcessList>
        <VaProcessListItem header="Confirm that you represent the claimant">
          <p>
            Make sure you or your Veterans Service Organization (VSO) have
            established representation with the claimant. If you don’t currently
            represent them, the portal will not allow you to submit the form.
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
            First provide information about the claimant so we can confirm that
            you represent them. Then upload the form, review, and submit the
            form.
          </p>
          <p>
            <strong>Note:</strong> The portal can’t check for mistakes in your
            form, so make sure you review all the information before you upload
            and submit.
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
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default IntroductionPage;
