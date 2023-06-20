import React, { useEffect, useRef } from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

export const IntroductionPageView = ({
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
    authStartFormText,
    saveInProgressText,
    unauthStartText,
    displayNonVeteranMessaging = false,
  } = content;
  const { resBurden, ombNumber, expDate } = ombInfo;

  useEffect(() => {
    focusElement(breadcrumbsRef.current);
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={formTitle} subTitle={formSubTitle} />
      {childContent}
      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText={authStartFormText}
        unauthStartText={unauthStartText}
        displayNonVeteranMessaging={displayNonVeteranMessaging}
      >
        {saveInProgressText}
      </SaveInProgressIntro>
      {additionalChildContent || null}
      <p />
      <va-omb-info
        res-burden={resBurden}
        omb-number={ombNumber}
        exp-date={expDate}
      />
    </article>
  );
};
