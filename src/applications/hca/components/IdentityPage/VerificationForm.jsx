import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import ServerErrorAlert from '../FormAlerts/ServerErrorAlert';
import LoginRequiredAlert from '../FormAlerts/LoginRequiredAlert';
import { selectEnrollmentStatus } from '../../utils/selectors';
import {
  idFormSchema as schema,
  idFormUiSchema as uiSchema,
} from '../../definitions/idForm';

const IdentityVerificationForm = props => {
  const { data, onLogin, onChange, onSubmit } = props;
  const {
    hasServerError,
    loginRequired,
    isLoadingApplicationStatus: isSubmittingForm,
  } = useSelector(selectEnrollmentStatus);

  return (
    <div className="vads-u-margin-top--2p5">
      <SchemaForm
        name="Identity Form"
        title="Identity Form"
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        onChange={onChange}
        data={data}
      >
        {hasServerError && <ServerErrorAlert />}
        {loginRequired ? (
          <LoginRequiredAlert handleLogin={onLogin} />
        ) : (
          <>
            {isSubmittingForm ? (
              <va-loading-indicator
                message="Reviewing your information..."
                class="vads-u-margin-bottom--4 hca-idform-submit-loader"
                set-focus
              />
            ) : (
              <ProgressButton
                buttonClass="vads-u-width--auto hca-idform-submit-button"
                buttonText="Continue to the application"
                afterText="»"
                submitButton
              />
            )}
          </>
        )}
      </SchemaForm>
    </div>
  );
};

IdentityVerificationForm.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
  onLogin: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default IdentityVerificationForm;
