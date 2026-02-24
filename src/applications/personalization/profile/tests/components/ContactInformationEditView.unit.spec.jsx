import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { ProfileInformationEditView } from '@@vap-svc/components/ProfileInformationEditView';

describe('<ProfileInformationEditView/> - Email Address', () => {
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
      'ui:title': 'Email address',
      'ui:errorMessages': {
        required:
          'You must enter your email address, using this format: X@X.com',
        pattern:
          'You must enter your email address again, using this format: X@X.com',
      },
    },
  };

  beforeEach(() => {
    props = {
      activeEditView: 'email',
      analyticsSectionName: 'email',
      apiRoute: 'string',
      clearErrors() {},
      convertCleanDataToPayload() {},
      data: null,
      editViewData: null,
      fieldName: 'email',
      forceEditView: false,
      formSchema,
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
      recordEvent: sinon.spy(),
    };
  });

  it('renders with the correct props', () => {
    const initialFormValues = { someField: 'someFieldValue' };

    sinon.stub(props, 'getInitialFormValues').returns(initialFormValues);

    component = enzyme.shallow(<ProfileInformationEditView {...props} />);

    component.setProps({ field: null });
    component.unmount();
  });

  describe('the save `va-button` loading state', () => {
    it('is `true` if the transactionRequest is pending', () => {
      props.transactionRequest = { isPending: true };
      component = enzyme.shallow(<ProfileInformationEditView {...props} />);

      const vaButton = component.find('[data-testid="save-edit-button"]');
      expect(vaButton.prop('loading')).to.be.true;

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
      component = enzyme.shallow(<ProfileInformationEditView {...props} />);

      const vaButton = component.find('[data-testid="save-edit-button"]');
      expect(vaButton.prop('loading')).to.be.true;

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
      component = enzyme.shallow(<ProfileInformationEditView {...props} />);

      const vaButton = component.find('[data-testid="save-edit-button"]');
      expect(vaButton.prop('loading')).to.be.false;

      component.unmount();
    });
  });

  describe('the cancel button', () => {
    it('is hidden when the transactionRequest is pending', () => {
      props.transactionRequest = { isPending: true };
      component = enzyme.mount(<ProfileInformationEditView {...props} />);
      expect(component.text()).to.not.include('Cancel');
      component.unmount();
    });

    it('is visible when the transactionRequest is not pending', () => {
      props.transactionRequest = { isPending: false };
      component = enzyme.mount(<ProfileInformationEditView {...props} />);
      expect(component.html()).to.include('Cancel');
      component.unmount();
    });
  });
});
