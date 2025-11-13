import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui/focus';
import { scrollToTop } from 'platform/utilities/scroll';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { TITLE, SUBTITLE } from '../constants';

const OMB_RES_BURDEN = 25;
const OMB_NUMBER = '2900-0747';
const OMB_EXP_DATE = '11/30/2025';

export const IntroductionPage = ({
  route: {
    formConfig: { prefillEnabled, savedFormMessages },
    pageList,
  },
}) => {
  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={prefillEnabled}
        messages={savedFormMessages}
        pageList={pageList}
        startText="Start the application"
      />
      <va-omb-info
        res-burden={OMB_RES_BURDEN}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />
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
