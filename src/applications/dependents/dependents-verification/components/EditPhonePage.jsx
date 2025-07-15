import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { SchemaForm, setData } from 'platform/forms-system/exportsFile';
import { scrollTo } from 'platform/utilities/scroll';
import EditPageButtons from './EditPageButtons';

const EditPhonePage = ({
  schema,
  uiSchema,
  data,
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const dispatch = useDispatch();

  const setFormData = oData => {
    dispatch(setData(oData));
  };

  const returnPath = '/veteran-contact-information';
  const returnToPath = () => {
    goToPath(
      sessionStorage.getItem('onReviewPage')
        ? '/review-and-submit'
        : returnPath,
    );
  };

  const handlers = {
    onInput: inputData => {
      setFormData({
        ...data,
        phone: inputData.phone,
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
      <h3 className="vads-u-margin-bottom--4">Edit phone number</h3>
      <SchemaForm
        addNameAttribute
        name="Contact Info Form"
        title="Contact Info Form"
        idSchema={{}}
        schema={schema}
        data={data}
        uiSchema={uiSchema}
        onChange={handlers.onInput}
        onSubmit={handlers.onUpdate}
      >
        {contentBeforeButtons}
        <EditPageButtons handlers={handlers} pageName="Phone number" />
        {contentAfterButtons}
      </SchemaForm>
    </>
  );
};

EditPhonePage.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  uiSchema: PropTypes.object.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default EditPhonePage;
