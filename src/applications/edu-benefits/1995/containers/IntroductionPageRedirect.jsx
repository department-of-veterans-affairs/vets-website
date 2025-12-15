import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { fetchClaimantInfo } from '../actions';
import { selectMeb1995Reroute } from '../selectors/featureToggles';

export const IntroductionPageRedirect = ({ route }) => {
  const dispatch = useDispatch();
  const rerouteFlag = useSelector(selectMeb1995Reroute);

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  const renderSaveInProgressIntro = useCallback(
    buttonOnly => (
      <SaveInProgressIntro
        buttonOnly={buttonOnly}
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        pageList={route.pageList}
        startText="Start your questionnaire"
        unauthStartText="Sign in to get started"
      />
    ),
    [
      route.formConfig.prefillEnabled,
      route.formConfig.savedFormMessages,
      route.pageList,
    ],
  );

  useEffect(
    () => {
      if (rerouteFlag) {
        dispatch(fetchClaimantInfo());
      }
    },
    [dispatch, rerouteFlag],
  );

  if (!rerouteFlag) {
    return null;
  }

  return (
    <div
      className="schemaform-intro"
      itemScope
      itemType="http://schema.org/HowTo"
    >
      <FormTitle title="Change your education benefits" />
      <va-alert status="info" visible uswds>
        <h3 slot="headline">Update your benefits without VA Form 22-1995</h3>
        <p>
          If you need to change or update your benefit for a new Certificate of
          Eligibility (COE), you’re in the right place. We’ll help you find the
          right form.
        </p>
      </va-alert>

      <h2 className="vads-u-font-size--h3 vads-u-margin-top--4">
        Determine which form to use
      </h2>
      <p>Answer a few questions to determine which form you need.</p>

      <div className="vads-u-margin-y--4">
        {/* {renderSaveInProgressIntro(false)} */}
      </div>

      <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
        <va-omb-info
          res-burden={20}
          omb-number="2900-0074"
          exp-date="09/30/2027"
        />
      </div>
    </div>
  );
};

IntroductionPageRedirect.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }).isRequired,
};
IntroductionPageRedirect.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }).isRequired,
};

export default IntroductionPageRedirect;
