import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { getMdotInProgressForm } from '../actions';
import { TITLE, SUBTITLE } from '../constants';

import Alerts from './Alerts';

const OMB_RES_BURDEN = 30;
const OMB_NUMBER = '2346A';
const OMB_EXP_DATE = '12/31/2025';

const Loading = () => (
  <div className="vads-u-margin--5">
    <va-loading-indicator message="Please wait while we load your information..." />
  </div>
);

export const IntroductionPage = ({ route }) => {
  const dispatch = useDispatch();
  const state = useSelector(s => s);
  const loading =
    state?.mdotInProgressForm?.loading ||
    state?.user?.profile?.loading ||
    false;

  useEffect(() => focusElement('h1'), [loading]);

  useEffect(() => dispatch(getMdotInProgressForm()), [dispatch]);

  const alerts = <Alerts />;

  if (loading) {
    return <Loading />;
  }

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to apply for benefits.
      </h2>
      {alerts || (
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={route.formConfig.prefillEnabled}
          messages={route.formConfig.savedFormMessages}
          pageList={route.pageList}
          startText="Start the application"
          devOnly={{
            forceShowFormControls: true,
          }}
        />
      )}
      <p />
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
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
};

export default IntroductionPage;
