import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';
import FormTitle from '~/platform/forms-system/src/js/components/FormTitle';
import {
  VaAlert,
  VaButton,
  VaLink,
  VaProcessList,
  VaProcessListItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from 'platform/monitoring/record-event';
import { getFormContent, getFormNumber } from '../helpers';
import { SIGN_IN_URL } from '../constants';

const IntroductionPage = ({ route, router }) => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const formNumber = getFormNumber();
  const { title, subTitle, pdfDownloadUrl } = getFormContent();

  const goToSignIn = () => {
    window.location = SIGN_IN_URL;
  };

  const startBtn = useMemo(
    () => {
      const startForm = () => {
        recordEvent({ event: `${formNumber}-start-form` });
        return router.push(route.pageList[1].path);
      };
      return (
        <a
          href="#start"
          className="vads-c-action-link--green"
          onClick={startForm}
        >
          Start application
        </a>
      );
    },
    [route.pageList, router],
  );

  return (
    <article className="schemaform-intro">
      <FormTitle title={title} subTitle={subTitle} />
      <h2>Follow these steps to submit the form</h2>
      <VaProcessList>
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
            external
            filetype="PDF"
            href={pdfDownloadUrl}
            text={`Download VA Form ${formNumber} (PDF)`}
          />
        </VaProcessListItem>
        <VaProcessListItem header="Upload and submit the form">
          <div>
            <p>Upload the form, review and submit the form.</p>
            <p>
              <strong>Note:</strong> The portal can’t check for mistakes in your
              form, so make sure you review all the information before you
              upload and submit.
            </p>
            <p>When you’re ready, start the process below.</p>
          </div>
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
