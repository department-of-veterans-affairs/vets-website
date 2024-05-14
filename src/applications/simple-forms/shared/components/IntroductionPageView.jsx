import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '~/platform/utilities/ui';
import FormTitle from '~/platform/forms-system/src/js/components/FormTitle';
import SIPIntroOld from '~/platform/forms/save-in-progress/SaveInProgressIntro';
import SIPIntroNew from '~/applications/simple-forms/21-4138/containers/saveInProgress/SaveInProgressIntro';
import { VaOmbInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const IntroductionPageView = ({
  route,
  content,
  ombInfo,
  childContent,
  additionalChildContent = null,
  useNew = false,
}) => {
  const breadcrumbsRef = useRef('.va-nav-breadcrumbs-list');
  const SaveInProgressIntro = useNew ? SIPIntroNew : SIPIntroOld;
  const { formConfig, pageList } = route;
  const {
    formTitle,
    formSubTitle,
    hideSipIntro = false, // show <SaveInProgressIntro> by default
    authStartFormText,
    saveInProgressText,
    unauthStartText,
    displayNonVeteranMessaging = false,
    verifiedPrefillAlert = null,
  } = content;
  const { resBurden, ombNumber, expDate, customPrivacyActStmt } = ombInfo;

  useEffect(() => {
    focusElement(breadcrumbsRef.current);
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={formTitle} subTitle={formSubTitle} />
      {childContent}
      {!hideSipIntro && (
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText={authStartFormText}
          unauthStartText={unauthStartText}
          displayNonVeteranMessaging={displayNonVeteranMessaging}
          verifiedPrefillAlert={verifiedPrefillAlert}
          formConfig={formConfig}
          hideUnauthedStartLink={formConfig.hideUnauthedStartLink ?? false}
        >
          {saveInProgressText}
        </SaveInProgressIntro>
      )}
      {additionalChildContent || null}
      <p />
      {!customPrivacyActStmt ? (
        <VaOmbInfo
          resBurden={resBurden}
          ombNumber={ombNumber}
          expDate={expDate}
        />
      ) : (
        <VaOmbInfo
          resBurden={resBurden}
          ombNumber={ombNumber}
          expDate={expDate}
        >
          {customPrivacyActStmt}
        </VaOmbInfo>
      )}
    </article>
  );
};

IntroductionPageView.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
      hideUnauthedStartLink: PropTypes.bool,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  additionalChildContent: PropTypes.object,
  childContent: PropTypes.object,
  content: PropTypes.shape({
    formTitle: PropTypes.string.isRequired,
    formSubTitle: PropTypes.string.isRequired,
    hideSipIntro: PropTypes.bool,
    authStartFormText: PropTypes.string,
    saveInProgressText: PropTypes.string,
    unauthStartText: PropTypes.string,
    displayNonVeteranMessaging: PropTypes.bool,
    verifiedPrefillAlert: PropTypes.object,
  }),
  ombInfo: PropTypes.object,
  useNew: PropTypes.bool,
};
