import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import {
  VaLinkAction,
  VaProcessList,
  VaProcessListItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from 'platform/monitoring/record-event';
import FormTitle from '~/platform/forms-system/src/js/components/FormTitle';
import { getFormContent, getFormNumber } from '../helpers';
import { ITF_PATH } from '../constants';

const IntroductionPageITF = ({ route, router }) => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const formNumber = getFormNumber();
  const { subTitle } = getFormContent();
  const startBtn = useMemo(() => {
    const startForm = () => {
      sessionStorage.setItem('formIncompleteARP', 'true');
      recordEvent({ event: `${formNumber}-start-form` });
      return router.push(`${ITF_PATH}/claimant-background`);
    };
    return (
      <VaLinkAction
        href="#start"
        class=" representative-form__start"
        text="Start the submission"
        onClick={startForm}
        type="primary"
      />
    );
  }, [route.pageList, router, formNumber]);
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <article className="schemaform-intro representative-form">
      <FormTitle title={`Submit VA Form ${formNumber}`} subTitle={subTitle} />
      <h2 className="representative-form__h2">
        Follow these steps to complete the submission
      </h2>
      <VaProcessList>
        <VaProcessListItem header="Make sure you represent the claimant">
          <p>
            The portal won’t allow you to complete the submission if you or your
            Veterans Service Organization (VSO) don’t represent the claimant.
          </p>
        </VaProcessListItem>
        <VaProcessListItem header="Submit VA Form 21-0966">
          <p>Fill out all the required steps and submit.</p>
        </VaProcessListItem>
      </VaProcessList>
      {userLoggedIn && startBtn}
    </article>
  );
};

IntroductionPageITF.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default IntroductionPageITF;
