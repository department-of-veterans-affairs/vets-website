import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '~/platform/utilities/ui';
import FormTitle from '~/platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from '~/platform/forms/save-in-progress/SaveInProgressIntro';

/**
 * @param {Object} props
 * @param {Object} props.route
 * @param {{
 *  formTitle: string,
 *  formSubTitle: string,
 *  hideSipIntro: boolean,
 *  authStartFormText: string,
 *  saveInProgressText: string,
 *  unauthStartText: string,
 *  displayNonVeteranMessaging: boolean,
 *  verifiedPrefillAlert: Object,
 *  customLink: any
 * }} props.content
 * @param {{
 *   resBurden: string,
 *   ombNumber: string,
 *   expDate: string,
 * }} props.ombInfo
 * @param {Object} props.childContent
 * @param {Object} props.additionalChildContent
 * @param {{
 *   forceShowFormControls: boolean
 * }} props.devOnly
 */
export const IntroductionPageView = ({
  devOnly,
  route,
  content,
  ombInfo,
  childContent,
  additionalChildContent = null,
}) => {
  const breadcrumbsRef = useRef('.va-nav-breadcrumbs-list');
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
    customLink = null,
  } = content;
  const { resBurden, ombNumber, expDate, customPrivacyActStmt } = ombInfo || {};

  useEffect(() => {
    focusElement(breadcrumbsRef.current);
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={formTitle} subTitle={formSubTitle} />
      {childContent}
      {!hideSipIntro && (
        <SaveInProgressIntro
          devOnly={devOnly}
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
          customLink={customLink}
        >
          {saveInProgressText}
        </SaveInProgressIntro>
      )}
      {additionalChildContent || null}
      <p />
      {ombInfo && !customPrivacyActStmt ? (
        <va-omb-info
          res-burden={resBurden}
          omb-number={ombNumber}
          exp-date={expDate}
        />
      ) : (
        <va-omb-info
          res-burden={resBurden}
          omb-number={ombNumber}
          exp-date={expDate}
        >
          {customPrivacyActStmt}
        </va-omb-info>
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
  childContent: PropTypes.shape(),
  content: PropTypes.shape({
    formTitle: PropTypes.string.isRequired,
    formSubTitle: PropTypes.string.isRequired,
    hideSipIntro: PropTypes.bool,
    authStartFormText: PropTypes.string,
    saveInProgressText: PropTypes.string,
    unauthStartText: PropTypes.string,
    displayNonVeteranMessaging: PropTypes.bool,
    verifiedPrefillAlert: PropTypes.object,
    customLink: PropTypes.any,
  }),
  devOnly: PropTypes.shape({
    forceShowFormControls: PropTypes.bool,
  }),
  ombInfo: PropTypes.shape(),
};
