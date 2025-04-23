import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getPreviousPagePath } from 'platform/forms-system/src/js/routing';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import RegistrationOnlyAlert from '../components/FormAlerts/RegistrationOnlyAlert';
import FormFooter from '../components/FormFooter';
import content from '../locales/en/content.json';

const AuthRegistrationOnlyPage = ({ location, route, router }) => {
  const { data: formData } = useSelector(state => state.form);

  const goBack = useCallback(
    () =>
      router.push(
        getPreviousPagePath(route.pageList, formData, location.pathname),
      ),
    [formData, location.pathname, route.pageList, router],
  );

  return (
    <>
      <div className="progress-box progress-box-schemaform vads-u-padding-x--0">
        <RegistrationOnlyAlert headingLevel={1} />
        <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
          <div className="small-6 medium-5 columns">
            <ProgressButton
              buttonClass="hca-button-progress usa-button-secondary"
              onButtonClick={goBack}
              buttonText={content['button-back']}
              beforeText="«"
            />
          </div>
        </div>
      </div>
      <FormFooter />
    </>
  );
};

AuthRegistrationOnlyPage.propTypes = {
  location: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
};

export default AuthRegistrationOnlyPage;
