import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import ProcessDescription from '../components/IntroductionPage/ProcessDescription';
import { TITLE, SUBTITLE } from '../constants';

const OMB_RES_BURDEN_1010D = 15;
const OMB_RES_BURDEN_OHI = 10;
const OMB_NUMBER = '2900-0219';
const OMB_EXP_DATE = '12/31/2027';

export const IntroductionPage = ({ route }) => {
  const { formConfig, pageList } = route;
  const { customText, formId, prefillEnabled, savedFormMessages } = formConfig;
  const totalResBurden = OMB_RES_BURDEN_1010D + OMB_RES_BURDEN_OHI;

  const sipIntroProps = useMemo(
    () => ({
      startText: 'Start the form',
      messages: savedFormMessages,
      formConfig: { customText },
      headingLevel: 2,
      prefillEnabled,
      pageList,
      formId,
    }),
    [customText, formId, pageList, prefillEnabled, savedFormMessages],
  );

  return (
    <div className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <p>
        If you’re the spouse, dependent, or survivor of a Veteran or service
        member who meets certain requirements, you may qualify for health
        insurance through the Civilian Health and Medical Program of the
        Department of Veterans Affairs (CHAMPVA).
      </p>

      <ProcessDescription resBurden={totalResBurden} />

      <SaveInProgressIntro {...sipIntroProps} />

      <va-omb-info
        res-burden={OMB_RES_BURDEN_1010D}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />

      <h2>Additional form you may need to complete</h2>
      <h3>CHAMPVA other health insurance (OHI) certification</h3>
      <p>VA form 10-7959c</p>

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
