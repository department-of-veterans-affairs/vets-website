import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import ProcessDescription from '../components/IntroductionPage/ProcessDescription';
import AlreadyAppliedAlert from '../components/FormAlerts/AlreadyAppliedAlert';
import content from '../locales/en/content.json';

const OMB_RES_BURDEN_1010D = 15;
const OMB_RES_BURDEN_OHI = 10;
const OMB_NUMBER = '2900-0219';
const OMB_EXP_DATE = '12/31/2027';

export const IntroductionPage = ({ route }) => {
  const { formConfig, pageList } = route;
  const { formId, prefillEnabled, savedFormMessages } = formConfig;
  const totalResBurden = OMB_RES_BURDEN_1010D + OMB_RES_BURDEN_OHI;

  const sipIntroProps = useMemo(
    () => ({
      startText: content['form-start-text'],
      messages: savedFormMessages,
      headingLevel: 2,
      formConfig,
      prefillEnabled,
      pageList,
      formId,
    }),
    [formConfig, formId, pageList, prefillEnabled, savedFormMessages],
  );

  return (
    <div className="schemaform-intro">
      <FormTitle
        title={content['form-title']}
        subTitle={content['form-subtitle']}
      />
      <p className="va-introtext">
        If you’re the spouse, dependent, or survivor of a Veteran or service
        member who meets certain requirements, you may qualify for health
        insurance through the Civilian Health and Medical Program of the
        Department of Veterans Affairs (CHAMPVA).
      </p>

      <AlreadyAppliedAlert />

      <ProcessDescription resBurden={totalResBurden} />

      <SaveInProgressIntro {...sipIntroProps} />

      <va-omb-info
        res-burden={OMB_RES_BURDEN_1010D}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />

      <h2>Additional form you may need to complete</h2>
      <h3>
        CHAMPVA Other Health Insurance (OHI) Certification (VA form 10-7959c)
      </h3>
      <p>
        If you have other non-VA health insurance, you’ll also need to fill out
        VA Form 10-7959c. You’ll provide this information at the end of your
        CHAMPVA application.
      </p>

      <va-omb-info
        res-burden={OMB_RES_BURDEN_OHI}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />
    </div>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      customText: PropTypes.object.isRequired,
      formId: PropTypes.string.isRequired,
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default IntroductionPage;
