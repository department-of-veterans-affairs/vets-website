import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector, useDispatch } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { TITLE, SUBTITLE } from '../constants';
import { setFormId } from '../../redux/actions';

const OMB_RES_BURDEN = 30;
const OMB_NUMBER = '1234-5678';
const OMB_EXP_DATE = '10/7/2026';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Prepare">
        <h4>To fill out this application, you’ll need your:</h4>
        <ul>
          <li>Apointment Information</li>
          <li>Travel Receipts</li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Apply">
        <p>Complete this benefits form.</p>
        <p>
          After submitting the form, you’ll get a confirmation message. You can
          print this for your records.
        </p>
      </va-process-list-item>
      <va-process-list-item header="VA Review">
        <p>
          We process claims within a week. If more than a week has passed since
          you submitted your application and you haven’t heard back, please
          don’t apply again. Call us at.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Decision">
        <p>
          Once we’ve processed your claim, you’ll get a notice in the mail with
          our decision.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage = props => {
  const dispatch = useDispatch();
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));
  const inProgressForms =
    useSelector(state => state.user.profile.savedForms) || [];
  const inProgressCCForms = inProgressForms.filter(x =>
    x.form.startsWith('CC'),
  );
  const [selection, setCCForm] = React.useState('CC');
  const { route } = props;
  const { formConfig, pageList } = route;
  const showVerifyIdentify = userLoggedIn && !userIdVerified;

  const setInProgressFormId = e => {
    setCCForm(e.target.value);
    dispatch(setFormId(e.target.value));
  };

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to apply for travel pay benefits.
      </h2>
      <ProcessList />
      {showVerifyIdentify ? (
        <div>{/* add verify identity alert if applicable */}</div>
      ) : (
        <>
          <VaSelect
            label="Select a formid"
            onVaSelect={setInProgressFormId}
            value={selection}
          >
            <option value="CC">Start a new application</option>
            {inProgressCCForms.map((form, index) => (
              <option key={index} value={form.form}>
                {form.form} - Last updated:{' '}
                {new Date(form.lastUpdated).toLocaleDateString()}
              </option>
            ))}
          </VaSelect>
          <SaveInProgressIntro
            formId={selection}
            headingLevel={2}
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            pageList={pageList}
            startText="Start a new application"
            devOnly={{
              forceShowFormControls: true,
            }}
          />
        </>
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
