import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';
import FormTitle from '~/platform/forms-system/src/js/components/FormTitle';
import {
  VaAlert,
  VaButton,
  VaLink,
  VaProcessList,
  VaProcessListItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal } from '~/platform/site-wide/user-nav/actions';
import recordEvent from 'platform/monitoring/record-event';
import { getFormContent, getFormNumber } from '../helpers';

const IntroductionPage = ({ route, router }) => {
  const dispatch = useDispatch();
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const formNumber = getFormNumber();
  const { title, subTitle, pdfDownloadUrl } = getFormContent();

  const openLoginModal = () => {
    dispatch(toggleLoginModal(true, 'cta-form'));
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
      <h2>How to submit VA form {formNumber}</h2>
      <p>This upload tool allows Veterans to submit a completed VA form.</p>
      <VaProcessList>
        <VaProcessListItem header="Download the form">
          <p>Download the official VA Form {formNumber} from VA.gov.</p>
          <VaLink
            external
            filetype="PDF"
            href={pdfDownloadUrl}
            text={`Download VA Form ${formNumber}`}
          />
        </VaProcessListItem>
        <VaProcessListItem header="Fill out the form">
          <div>
            <p>
              Complete the form on your device, or print and complete it by
              hand. For smooth processing, make sure you:
            </p>
            <ul>
              <li>Provide all the required information</li>
              <li>Sign the form</li>
            </ul>
          </div>
        </VaProcessListItem>
        <VaProcessListItem header="Upload your form here">
          <div>
            <p>
              When you’re ready to submit your form, you can use the upload tool
              below:
            </p>
            <ul>
              <li>
                First we’ll ask you for some personal details. The information
                you provide needs to match the form. If it doesn’t, it will
                cause delays.
              </li>
              <li>Then we’ll ask you to upload your completed form.</li>
              <li>
                <b>Note:</b> The upload tool can’t check for mistakes in your
                form. Make sure you review your file before you submit.
              </li>
            </ul>
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
            onClick={openLoginModal}
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
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default IntroductionPage;
