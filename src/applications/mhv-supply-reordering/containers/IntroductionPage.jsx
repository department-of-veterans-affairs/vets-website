import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { getMdotInProgressForm } from '../actions';
import { INTRO_TITLE, INTRO_SUBTITLE } from '../constants';

import VerifiedPrefillAlert from '../components/VerifiedPrefillAlert';
import Alerts from './Alerts';
import SuppliesAvailable from '../components/SuppliesAvailable';
import SuppliesUnavailable from '../components/SuppliesUnavailable';
import {
  isAlerting,
  selectSupplies,
  selectUnavailableSupplies,
} from '../selectors';

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

  const isNotAlerting = !useSelector(isAlerting);
  const supplies = useSelector(selectSupplies);
  const unavailableSupplies = useSelector(selectUnavailableSupplies);

  useEffect(() => focusElement('h1'), [loading]);

  useEffect(() => dispatch(getMdotInProgressForm()), [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <FormTitle title={INTRO_TITLE} />
      <p className="vads-u-font-family--serif">{INTRO_SUBTITLE}</p>
      <Alerts />
      {isNotAlerting && (
        <>
          <SuppliesAvailable supplies={supplies} />
          <SaveInProgressIntro
            headingLevel={3}
            prefillEnabled={route.formConfig.prefillEnabled}
            messages={route.formConfig.savedFormMessages}
            pageList={route.pageList}
            startText="Start a new order"
            formConfig={route.formConfig}
            verifiedPrefillAlert={VerifiedPrefillAlert}
          />
          <SuppliesUnavailable supplies={unavailableSupplies} />
        </>
      )}
    </>
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
