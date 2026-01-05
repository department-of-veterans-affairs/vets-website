import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';
import SaveInProgressIntro from '~/platform/forms/save-in-progress/SaveInProgressIntro';
import FormTitle from '~/platform/forms-system/src/js/components/FormTitle';
import {
  VaAlertSignIn,
  VaButton,
  VaLink,
  VaProcessList,
  VaProcessListItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal } from '~/platform/site-wide/user-nav/actions';
import { getFormContent, getFormNumber } from '../helpers';
import { PrimaryActionLink } from '../config/constants';

const IntroductionPage = ({ route }) => {
  const { formConfig, pageList } = route;
  const dispatch = useDispatch();
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const formNumber = getFormNumber();
  const { title, subTitle, pdfDownloadUrl } = getFormContent();

  const openLoginModal = () => {
    dispatch(toggleLoginModal(true, 'cta-form'));
  };

  return (
    <article className="schemaform-intro">
      <FormTitle title={title} subTitle={subTitle} />
      <h2>How to submit VA Form {formNumber}</h2>
      <p>You can upload and submit your completed form here on VA.gov.</p>
      <VaProcessList>
        <VaProcessListItem header="Download the form">
          <p>Download the official VA Form {formNumber} from VA.gov.</p>
          <VaLink
            external
            download
            href={pdfDownloadUrl}
            text={`Download VA Form ${formNumber}`}
          />
        </VaProcessListItem>
        <VaProcessListItem header="Fill out the form">
          <div>
            <p>
              Complete the form on your device. Or print and complete it by
              hand. Make sure to complete these important steps:
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
              When you’re ready, you can submit your form here. We’ll ask you to
              complete these steps:
            </p>
            <ul>
              <li>
                First we’ll ask you for some personal details. The information
                you provide needs to match the form. If it doesn’t, it will
                cause delays.
              </li>
              <li>Upload your completed form.</li>
            </ul>
            <p>
              <b>Note: </b>
              We can’t check for mistakes in your form when you upload it here
              on VA.gov. Make sure you review it before you submit.
            </p>
          </div>
        </VaProcessListItem>
      </VaProcessList>
      {userLoggedIn ? (
        <SaveInProgressIntro
          formConfig={formConfig}
          hideUnauthedStartLink
          pageList={pageList}
          prefillEnabled={formConfig.prefillEnabled}
          startText="Start uploading your form"
          verifiedPrefillAlert={<></>}
          customLink={PrimaryActionLink}
        />
      ) : (
        <VaAlertSignIn status="info" visible>
          <span slot="SignInButton">
            <VaButton
              text="Sign in to start uploading your form"
              onClick={openLoginModal}
            />
          </span>
        </VaAlertSignIn>
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
