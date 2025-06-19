import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SchemaForm, setData } from 'platform/forms-system/exportsFile';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
// import mergeWith from 'lodash/mergeWith';
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

  // Convert profile address data to address schema format
  // const mailingAddress = data?.veteranContactInformation?.address || {};
  // const address = {
  //   addressType: '',
  //   country: '',
  //   isMilitary: false,
  //   street: '',
  //   street2: '',
  //   street3: '',
  //   city: '',
  //   state: '',
  //   postalCode: '',
  //   internationalPostalCode: '',
  // };
  // console.log({ data, mailingAddress });

  const returnToPath = () => {
    goToPath(fromReviewPage ? '/review-and-submit' : returnPath);
  };

  const setFormData = oData => {
    dispatch(setData(oData));
  };

  const handlers = {
    onInput: inputData => {
      // console.log({ data, inputData });
      // console.log({ inputData, data });
      // let addressType = 'DOMESTIC';

      // const updatedData = mergeWith(data.mailingAddress, inputData.address);
      // if (updatedData.isMilitary === undefined) {
      //   updatedData.isMilitary = false;
      // } else if (updatedData.isMilitary === true) {
      //   addressType = 'MILITARY';
      // } else if (['USA']?.includes(updatedData.country)) {
      //   addressType = 'INTERNATIONAL';
      // }

      // setFormData({
      //   ...data,
      //   mailingAddress: {
      //     ...data.mailingAddress,
      //     isMilitary: false,
      //     addressType,
      //     ...updatedData,
      //   },
      // });
      setFormData({
        ...data,
        ...inputData,
        veteranContactInformation: {
          address: {
            ...inputData.address,
          },
        },
      });
    },
    onSubmit: () => {
      returnToPath();
    },
    onCancel: () => {
      returnToPath();
    },
  };

  // const handlers = {
  //   onInput: inputData => {
  //     // const isUSA =
  //     //   !inputData.address.country || inputData.address.country === 'USA';
  //     let addressType = 'DOMESTIC';
  //     // if (inputData.address.isMilitary) {
  //     //   addressType = 'MILITARY';
  //     // } else if (!isUSA) {
  //     //   addressType = 'INTERNATIONAL';
  //     // }

  //     const updatedData = mergeWith(address, inputData.address);
  //     if (updatedData.isMilitary === undefined) {
  //       updatedData.isMilitary = false;
  //     } else if (updatedData.isMilitary === true) {
  //       addressType = 'MILITARY';
  //     } else if (['USA']?.includes(updatedData.country)) {
  //       addressType = 'INTERNATIONAL';
  //     }

  //     setFormData({
  //       ...data,
  //       mailingAddress: {
  //         ...data.mailingAddress,
  //         isMilitary: false,
  //         addressType,
  //         ...updatedData,
  //       },
  //     });
  //   },
  //   onSubmit: () => {
  //     returnToPath();
  //   },
  //   onCancel: () => {
  //     returnToPath();
  //   },
  // };

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
        // `name` and `title` are required by SchemaForm, but are only used
        // internally by the SchemaForm component
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
          <VaButton text="Save" submit="prevent" />
          <VaButton text="Cancel" onClick={handlers.onCancel} secondary />
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
