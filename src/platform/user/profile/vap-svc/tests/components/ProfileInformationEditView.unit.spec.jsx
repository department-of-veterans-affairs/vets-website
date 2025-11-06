import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { ProfileInformationEditView } from '~/platform/user/profile/vap-svc/components/ProfileInformationEditView';
import { FIELD_NAMES } from '~/platform/user/profile/vap-svc/constants';
import * as selectors from '~/platform/mhv/components/MhvAlertConfirmEmail/selectors';

describe('<ProfileInformationEditView/> - Email Confirmation Alert Cookie', () => {
  let props;
  let dismissAlertViaCookieStub;
  let wrapper;
  let sandbox;

  beforeEach(() => {
    // Create a sandbox for stubs
    sandbox = sinon.createSandbox();

    // Stub the dismissAlertViaCookie function directly
    dismissAlertViaCookieStub = sandbox.stub(
      selectors,
      'dismissAlertViaCookie',
    );

    // Base props needed for the component
    props = {
      analyticsSectionName: 'email',
      apiRoute: '/profile/email_addresses',
      clearTransactionRequest: sandbox.spy(),
      convertCleanDataToPayload: sandbox.spy(),
      createPersonalInfoUpdate: sandbox.spy(),
      createTransaction: sandbox.spy(),
      fieldName: FIELD_NAMES.EMAIL,
      formSchema: {},
      getInitialFormValues: () => ({ emailAddress: 'test@example.com' }),
      openIntlMobileConfirmModal: sandbox.spy(),
      openModal: sandbox.spy(),
      recordCustomProfileEvent: sandbox.spy(),
      refreshTransaction: sandbox.spy(),
      uiSchema: {},
      updateFormFieldWithSchema: sandbox.spy(),
      validateAddress: sandbox.spy(),
      onCancel: sandbox.spy(),
      field: {
        value: { emailAddress: 'test@example.com' },
        formSchema: {},
        uiSchema: {},
      },
      transaction: null,
      transactionRequest: null,
    };
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    sandbox.restore();
  });

  describe('componentDidUpdate - Email transaction success', () => {
    it('should dismiss alert cookie when email transaction succeeds', () => {
      // Start with no transaction
      wrapper = shallow(<ProfileInformationEditView {...props} />);
      const instance = wrapper.instance();

      // Spy on componentDidUpdate to ensure it's called
      const componentDidUpdateSpy = sandbox.spy(instance, 'componentDidUpdate');

      // Simulate transaction becoming pending
      const pendingTransaction = {
        data: {
          attributes: {
            transactionId: '123',
            transactionStatus: 'RECEIVED',
          },
        },
      };

      wrapper.setProps({ transaction: pendingTransaction });

      // Simulate transaction completing successfully
      const successfulTransaction = {
        data: {
          attributes: {
            transactionId: '123',
            transactionStatus: 'COMPLETED_SUCCESS',
          },
        },
      };

      wrapper.setProps({ transaction: successfulTransaction });

      // Verify componentDidUpdate was called
      expect(componentDidUpdateSpy.called).to.be.true;

      // The cookie should have been set
      expect(dismissAlertViaCookieStub.called).to.be.true;

      wrapper.unmount();
    });

    it('should NOT dismiss alert cookie for non-email fields', () => {
      const phoneProps = {
        ...props,
        fieldName: FIELD_NAMES.MOBILE_PHONE,
      };

      wrapper = shallow(<ProfileInformationEditView {...phoneProps} />);

      const pendingTransaction = {
        data: {
          attributes: {
            transactionId: '123',
            transactionStatus: 'RECEIVED',
          },
        },
      };

      wrapper.setProps({ transaction: pendingTransaction });

      const successfulTransaction = {
        data: {
          attributes: {
            transactionId: '123',
            transactionStatus: 'COMPLETED_SUCCESS',
          },
        },
      };

      wrapper.setProps({ transaction: successfulTransaction });

      // Cookie should NOT be set for phone field
      expect(dismissAlertViaCookieStub.called).to.be.false;

      wrapper.unmount();
    });

    it('should NOT dismiss alert cookie when email transaction fails', () => {
      wrapper = shallow(<ProfileInformationEditView {...props} />);

      const pendingTransaction = {
        data: {
          attributes: {
            transactionId: '123',
            transactionStatus: 'RECEIVED',
          },
        },
      };

      wrapper.setProps({ transaction: pendingTransaction });

      const failedTransaction = {
        data: {
          attributes: {
            transactionId: '123',
            transactionStatus: 'COMPLETED_FAILURE',
          },
        },
      };

      wrapper.setProps({ transaction: failedTransaction });

      // Cookie should NOT be set on failure
      expect(dismissAlertViaCookieStub.called).to.be.false;

      wrapper.unmount();
    });
  });

  describe('componentWillUnmount - Email transaction success fallback', () => {
    it('should dismiss alert cookie on unmount if email transaction succeeded', () => {
      const successfulTransaction = {
        data: {
          attributes: {
            transactionId: '123',
            transactionStatus: 'COMPLETED_SUCCESS',
          },
        },
      };

      const propsWithSuccessfulTransaction = {
        ...props,
        transaction: successfulTransaction,
      };

      wrapper = shallow(
        <ProfileInformationEditView {...propsWithSuccessfulTransaction} />,
      );

      // Unmount the component
      wrapper.unmount();

      // Cookie should have been set
      expect(dismissAlertViaCookieStub.calledOnce).to.be.true;
    });

    it('should NOT dismiss alert cookie on unmount for non-email fields', () => {
      const successfulTransaction = {
        data: {
          attributes: {
            transactionId: '123',
            transactionStatus: 'COMPLETED_SUCCESS',
          },
        },
      };

      const phonePropsWithTransaction = {
        ...props,
        fieldName: FIELD_NAMES.MOBILE_PHONE,
        transaction: successfulTransaction,
      };

      wrapper = shallow(
        <ProfileInformationEditView {...phonePropsWithTransaction} />,
      );

      wrapper.unmount();

      // Cookie should NOT be set for phone field
      expect(dismissAlertViaCookieStub.called).to.be.false;
    });

    it('should NOT dismiss alert cookie on unmount if no transaction', () => {
      wrapper = shallow(<ProfileInformationEditView {...props} />);

      wrapper.unmount();

      // Cookie should NOT be set when no transaction exists
      expect(dismissAlertViaCookieStub.called).to.be.false;
    });

    it('should NOT dismiss alert cookie on unmount if transaction failed', () => {
      const failedTransaction = {
        data: {
          attributes: {
            transactionId: '123',
            transactionStatus: 'COMPLETED_FAILURE',
          },
        },
      };

      const propsWithFailedTransaction = {
        ...props,
        transaction: failedTransaction,
      };

      wrapper = shallow(
        <ProfileInformationEditView {...propsWithFailedTransaction} />,
      );

      wrapper.unmount();

      // Cookie should NOT be set on failure
      expect(dismissAlertViaCookieStub.called).to.be.false;
    });
  });
});
