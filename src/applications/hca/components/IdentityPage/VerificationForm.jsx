import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import ServerErrorAlert from '../FormAlerts/ServerErrorAlert';
import LoginRequiredAlert from '../FormAlerts/LoginRequiredAlert';
import { selectEnrollmentStatus } from '../../utils/selectors';
import { idFormSchema, idFormUiSchema } from '../../definitions/idForm';
import content from '../../locales/en/content.json';

const IdentityVerificationForm = ({ data, onChange, onLogin, onSubmit }) => {
  const {
    vesRecordFound,
    hasServerError,
    hasRateLimitError,
    loading: isSubmittingForm,
  } = useSelector(selectEnrollmentStatus);

  const loginRequired = useMemo(() => vesRecordFound || hasRateLimitError, [
    hasRateLimitError,
    vesRecordFound,
  ]);

  const schemaFormFooter = useMemo(
    () => {
      if (hasServerError) return <ServerErrorAlert />;
      if (loginRequired) return <LoginRequiredAlert handleLogin={onLogin} />;
      return isSubmittingForm ? (
        <va-loading-indicator
          message={content['identity-verification--loading-message']}
          class="vads-u-margin-bottom--4 hca-idform-submit-loader"
          set-focus
        />
      ) : (
        <ProgressButton
          buttonClass="vads-u-width--auto hca-idform-submit-button"
          buttonText={content['identity-verification--submit-button-text']}
          afterText="»"
          submitButton
        />
      );
    },
    [hasServerError, isSubmittingForm, loginRequired, onLogin],
  );

  return (
    <div className="vads-u-margin-top--2p5">
      <SchemaForm
        name="Identity Form"
        title="Identity Form"
        schema={idFormSchema}
        uiSchema={idFormUiSchema}
        onSubmit={onSubmit}
        onChange={onChange}
        data={data}
      >
        {schemaFormFooter}
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
