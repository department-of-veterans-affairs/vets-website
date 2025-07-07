import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { SchemaForm, setData } from 'platform/forms-system/exportsFile';
import { scrollTo } from 'platform/utilities/scroll';

const EditMailingAddress = ({
  schema,
  uiSchema,
  data,
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const fromReviewPage = sessionStorage.getItem('onReviewPage');
  const dispatch = useDispatch();

  const returnPath = '/veteran-contact-information';

  const returnToPath = () => {
    goToPath(fromReviewPage ? '/review-and-submit' : returnPath);
  };

  const setFormData = oData => {
    dispatch(setData(oData));
  };

  const handlers = {
    onInput: inputData => {
      setFormData({
        ...data,
        address: inputData.address,
      });
    },
    onUpdate: () => {
      returnToPath();
    },
    onCancel: () => {
      returnToPath();
    },
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollTo('topScrollElement');
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <va-alert status="info" slim class="vads-u-margin-y--3">
        <p className="vads-u-margin--0">
          <strong>Note:</strong> We’ve prefilled some of your information. If
          you need to make changes, you can edit on this screen. Your changes
          won’t affect your VA.gov profile.
        </p>
      </va-alert>
      <h3 className="vads-u-margin-bottom--4">Edit mailing address</h3>
      <SchemaForm
        addNameAttribute
        name="Contact Info Form"
        title="Contact Info Form"
        idSchema={{}}
        schema={schema}
        data={data}
        uiSchema={uiSchema}
        onChange={handlers.onInput}
        onSubmit={handlers.onSubmit}
      >
        {contentBeforeButtons}
        <div className="vads-u-margin-y--2">
          <VaButtonPair
            primaryLabel="Update mailing address"
            secondaryLabel="Cancel editing mailing address"
            onPrimaryClick={handlers.onUpdate}
            onSecondaryClick={handlers.onCancel}
            update
          />
        </div>
        {contentAfterButtons}
      </SchemaForm>
    </>
  );
};

EditMailingAddress.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  uiSchema: PropTypes.object.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default EditMailingAddress;
