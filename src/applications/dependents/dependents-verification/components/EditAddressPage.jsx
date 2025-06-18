import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { Title } from '~/platform/forms-system/src/js/web-component-patterns';
import ProgressButton from '@department-of-veterans-affairs/platform-forms-system/ProgressButton';
import SchemaForm from '~/platform/forms-system/src/js/components/SchemaForm';

const EditAddressPage = ({
  formData = {},
  goToPath,
  setFormData,
  schema,
  uiSchema,
}) => {
  const returnPath = '/veteran-contact-information';
  const initialAddress = formData?.veteranContactInformation?.address || {};
  const [localAddress, setLocalAddress] = useState(initialAddress);

  const returnToPath = () => {
    goToPath(
      sessionStorage.getItem('onReviewPage')
        ? '/review-and-submit'
        : returnPath,
    );
  };

  const handlers = {
    onChange: newFormData => {
      setLocalAddress(newFormData?.address || {});
    },
    onUpdate: event => {
      event.preventDefault();
      if (!localAddress || typeof localAddress !== 'object') return;

      setFormData({
        ...formData,
        veteranContactInformation: {
          ...formData.veteranContactInformation,
          address: localAddress,
        },
      });
      returnToPath();
    },
    onCancel: () => {
      returnToPath();
    },
  };

  return (
    <form onSubmit={handlers.onUpdate} noValidate>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <Title title="Edit mailing address" />
        </legend>

        <SchemaForm
          name="editAddressPage"
          title="Edit mailing address"
          schema={schema}
          uiSchema={uiSchema}
          formData={{ address: localAddress }}
          onChange={handlers.onChange}
          onSubmit={handlers.onUpdate}
        >
          <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
            <div className="small-6 medium-5 columns">
              <ProgressButton
                onButtonClick={handlers.onCancel}
                buttonText="Cancel"
                buttonClass="usa-button-secondary"
              />
            </div>
            <div className="small-6 medium-5 end columns">
              <ProgressButton
                buttonText="Update"
                onButtonClick={handlers.onUpdate}
                buttonClass="usa-button-primary"
                ariaLabel="Update mailing address"
              />
            </div>
          </div>
        </SchemaForm>
      </fieldset>
    </form>
  );
};

EditAddressPage.propTypes = {
  formData: PropTypes.object,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(EditAddressPage));
