import React, { useEffect } from 'react';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { FormApplicationSteps } from '../components/FormApplicationSteps';

function IntroductionPage(props) {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  });

  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply for Certificate of Eligibility" />
      <p>Equal to VA Form 26-1880 (Apply for Certificate of Eligibility).</p>
      <SaveInProgressIntro
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        startText="Start the Application"
        hideUnauthedStartLink
      >
        Please complete the 26-1880 form to apply for Certificate of Eligibility
        (VA Form 26-1880).
      </SaveInProgressIntro>
      <FormApplicationSteps />
      <SaveInProgressIntro
        hideUnauthedStartLink
        buttonOnly
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        startText="Start the Application"
      />
      <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
        <OMBInfo resBurden={30} ombNumber="2900-0086" expDate="11/30/2022" />
      </div>
    </div>
  );
}

export default IntroductionPage;
