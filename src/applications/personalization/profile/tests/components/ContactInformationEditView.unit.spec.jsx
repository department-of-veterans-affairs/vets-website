import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';

import { ContactInformationEditView } from '@@profile/components/personal-information/ContactInformationEditView';

describe('<ContactInformationEditView/>', () => {
  let props = null;
  let component = null;

  const formSchema = {
    type: 'object',
    properties: {
      emailAddress: {
        type: 'string',
        pattern: '^.*\\S.*',
      },
    },
    required: ['emailAddress'],
  };

  const uiSchema = {
    emailAddress: {
      'ui:title': 'Email Address',
      'ui:errorMessages': {
        required: 'Please enter your email address, using this format: X@X.com',
        pattern:
          'Please enter your email address again, using this format: X@X.com',
      },
    },
  };

  beforeEach(() => {
    props = {
      activeEditView: 'email',
      analyticsSectionName: 'some-field',
      apiRoute: 'string',
      clearErrors() {},
      convertCleanDataToPayload() {},
      data: null,
      editViewData: null,
      fieldName: 'email',
      formSchema: {},
      getInitialFormValues() {},
      field: {
        value: {},
        validations: {},
        formSchema,
        uiSchema,
      },
      hasUnsavedEdits: true,
      isEmpty() {},
      onBlur() {},
      onChangeFormDataAndSchemas() {},
      title: 'Edit Some Field',
      transaction: null,
      transactionRequest: null,
      uiSchema: {},

      // from mapDispatchToProps
      clearTransactionRequest() {},
      createTransaction() {},
      updateFormFieldWithSchema() {},
      validateAddress() {},
      refreshTransaction() {},
    };
  });

  it('renders with the correct props', () => {
    const initialFormValues = { someField: 'someFieldValue' };

    sinon.stub(props, 'getInitialFormValues').returns(initialFormValues);

    component = enzyme.shallow(<ContactInformationEditView {...props} />);

    component.setProps({ field: null });
    component.unmount();
  });

  describe('the `LoadingButton.isLoading`', () => {
    it('is `true` if the transactionRequest is pending', () => {
      props.transactionRequest = { isPending: true };
      component = enzyme.shallow(<ContactInformationEditView {...props} />);

      const loadingButton = component.find(LoadingButton);
      expect(loadingButton.prop('isLoading')).to.be.true;

      component.unmount();
    });

    it('is `true` if the transaction is pending', () => {
      props.transaction = {
        data: {
          attributes: {
            transactionStatus: 'RECEIVED',
          },
        },
      };
      component = enzyme.shallow(<ContactInformationEditView {...props} />);

      const loadingButton = component.find(LoadingButton);
      expect(loadingButton.prop('isLoading')).to.be.true;

      component.unmount();
    });

    it('is `false` if neither the transactionRequest or transaction are pending', () => {
      props.transactionRequest = { isPending: false };
      props.transaction = {
        data: {
          attributes: {
            transactionStatus: 'COMPLETED_SUCCESS',
          },
        },
      };
      component = enzyme.shallow(<ContactInformationEditView {...props} />);

      const loadingButton = component.find(LoadingButton);
      expect(loadingButton.prop('isLoading')).to.be.false;

      component.unmount();
    });

    it('sets the LoadingButton to isLoading if the transaction is pending', () => {});
  });

  describe('the cancel button', () => {
    it('is hidden when the transactionRequest is pending', () => {
      props.transactionRequest = { isPending: true };
      component = enzyme.mount(<ContactInformationEditView {...props} />);
      expect(component.text()).to.not.include('Cancel');
      component.unmount();
    });

    it('is visible when the transactionRequest is not pending', () => {
      props.transactionRequest = { isPending: false };
      component = enzyme.mount(<ContactInformationEditView {...props} />);
      expect(component.text()).to.include('Cancel');
      component.unmount();
    });
  });

  describe('VAPServiceEditModalErrorMessage', () => {
    it("is not shown if there isn't an error", () => {
      component = enzyme.shallow(<ContactInformationEditView {...props} />);

      const errorMessage = component.find('VAPServiceEditModalErrorMessage');
      expect(errorMessage).to.have.lengthOf(0);

      component.unmount();
    });
    it('is shown if there is a transactionRequest error', () => {
      props.transactionRequest = { error: true };
      component = enzyme.shallow(<ContactInformationEditView {...props} />);

      const errorMessage = component.find('VAPServiceEditModalErrorMessage');
      expect(errorMessage).to.have.lengthOf(1);

      component.unmount();
    });
    it('is shown if there is a transactionRequest error', () => {
      props.transactionRequest = { error: {} };
      component = enzyme.shallow(<ContactInformationEditView {...props} />);

      const errorMessage = component.find('VAPServiceEditModalErrorMessage');
      expect(errorMessage).to.have.lengthOf(1);

      component.unmount();
    });
    it('is shown if there is a transaction error', () => {
      props.transaction = {
        data: {
          attributes: {
            transactionStatus: 'COMPLETED_FAILURE',
          },
        },
      };
      component = enzyme.shallow(<ContactInformationEditView {...props} />);

      const errorMessage = component.find('VAPServiceEditModalErrorMessage');
      expect(errorMessage).to.have.lengthOf(1);

      component.unmount();
    });
  });
});
