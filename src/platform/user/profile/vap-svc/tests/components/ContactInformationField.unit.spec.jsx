import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  ProfileInformationFieldController,
  mapStateToProps,
} from '~/platform/user/profile/vap-svc/components/ProfileInformationFieldController';
import { FIELD_NAMES } from '~/platform/user/profile/vap-svc/constants';

describe('<ProfileInformationFieldController/>', () => {
  let props = null;
  let component = null;

  beforeEach(() => {
    props = {
      analyticsSectionName: 'home-telephone',
      clearErrors() {},
      data: { someField: 'someFieldValue' },
      field: null,
      fieldName: FIELD_NAMES.HOME_PHONE,
      showEditView: false,
      showValidationView: false,
      showConfirmCancelModal: false,
      hasUnsavedEdits: false,
      isEmpty: false,
      onAdd() {},
      onEdit() {},
      onCancel() {},
      onChange() {},
      onChangeFormDataAndSchemas() {},
      onDelete() {},
      onSubmit() {},
      openModal: sinon.spy(),
      refreshTransaction() {},
      title: 'Some field',
      transaction: null,
      transactionRequest: null,
    };
  });

  it('conditional render based on existence of data', () => {
    const isEmptyProps = {
      ...props,
      isEmpty: true,
    };

    component = enzyme.shallow(
      <ProfileInformationFieldController {...isEmptyProps} />,
    );
    expect(
      component.find('ProfileInformationView'),
      'the ProfileInformationView was rendered',
    ).to.have.lengthOf(1);

    expect(
      component.html(),
      'the add-button was rendered instead of the Content',
    ).to.contain('button');
    component.unmount();
  });

  it('renders the ProfileInformationEditView', () => {
    props.showEditView = true;
    component = enzyme.shallow(
      <ProfileInformationFieldController {...props} />,
    );

    expect(
      component.find('Connect(ProfileInformationEditView)'),
      'the ProfileInformationEditView was rendered',
    ).to.have.lengthOf(1);

    component.unmount();
  });
  it('renders the ProfileInformationEditView when forceEditView is set', () => {
    props.forceEditView = true;
    component = enzyme.shallow(
      <ProfileInformationFieldController {...props} />,
    );

    expect(
      component.find('Connect(ProfileInformationEditView)'),
      'the ProfileInformationEditView was rendered',
    ).to.have.lengthOf(1);

    component.unmount();
  });

  it('renders the ProfileInformationView', () => {
    component = enzyme.shallow(
      <ProfileInformationFieldController {...props} />,
    );

    expect(
      component.find('ProfileInformationView'),
      'the ProfileInformationView was rendered',
    ).to.have.lengthOf(1);

    component.unmount();
  });

  it('hides the remove button', () => {
    component = enzyme.shallow(
      <ProfileInformationFieldController {...props} isDeleteDisabled />,
    );

    expect(
      component.find('.usa-button-secondary'),
      'the remove button was not rendered',
    ).to.have.lengthOf(0);

    component.unmount();
  });

  it('calls the cancelCallback', () => {
    const cancelCallbackSpy = sinon.spy();
    props.forceEditView = true;
    component = enzyme.shallow(
      <ProfileInformationFieldController
        {...props}
        cancelCallback={cancelCallbackSpy}
      />,
    );

    expect(
      component.find('Connect(ProfileInformationEditView)'),
      'the ProfileInformationEditView was rendered',
    ).to.have.lengthOf(1);

    component
      .find('Connect(ProfileInformationEditView)')
      .props()
      .onCancel();

    expect(cancelCallbackSpy.calledOnce, 'cancelCallback called').to.be.true;

    component.unmount();
  });
  it('calls the successCallback (non-address changes)', () => {
    const successCallbackSpy = sinon.spy();
    const data = {
      ...props,
      forceEditView: true,
      transactionRequest: { isPending: true },
      successCallback: successCallbackSpy,
    };
    component = enzyme.shallow(<ProfileInformationFieldController {...data} />);

    expect(
      component.find('Connect(ProfileInformationEditView)'),
      'the ProfileInformationEditView was rendered',
    ).to.have.lengthOf(1);

    data.transactionRequest = null; // non-address success
    component.setProps(data);

    expect(successCallbackSpy.calledOnce, 'successCallback called').to.be.true;

    component.unmount();
  });
  it('calls the successCallback (address changes)', () => {
    const successCallbackSpy = sinon.spy();
    const data = {
      ...props,
      showEditView: true,
      forceEditView: true,
      fieldName: FIELD_NAMES.MAILING_ADDRESS,
      transaction: { data: { attributes: { transactionStatus: '' } } },
      successCallback: successCallbackSpy,
    };
    component = enzyme.shallow(<ProfileInformationFieldController {...data} />);

    expect(
      component.find('Connect(ProfileInformationEditView)'),
      'the ProfileInformationEditView was rendered',
    ).to.have.lengthOf(1);

    const newData = {
      ...data,
      showEditView: false, // justClosedModal check
      transaction: null,
      showUpdateSuccessAlert: true, // success check
    };
    // Address success callback
    component.setProps(newData);

    expect(successCallbackSpy.calledOnce, 'successCallback called').to.be.true;

    component.unmount();
  });

  it('calls successCallback when success alert appears in forceEditView flow', () => {
    const successCallbackSpy = sinon.spy();

    const initialProps = {
      ...props,
      forceEditView: true,
      successCallback: successCallbackSpy,
      showUpdateSuccessAlert: false,
      showEditView: false,
      showRemoveModal: false,
      showValidationView: false,
      transactionRequest: null,
    };

    component = enzyme.shallow(
      <ProfileInformationFieldController {...initialProps} />,
    );

    const updatedProps = {
      ...initialProps,
      showUpdateSuccessAlert: true,
    };

    component.setProps(updatedProps);

    expect(successCallbackSpy.calledOnce, 'successCallback called').to.be.true;

    component.unmount();
  });
});

describe('mapStateToProps', () => {
  const getBasicState = () => ({
    user: {
      profile: {
        vapContactInfo: {
          mobilePhone: '',
        },
      },
    },
    vapService: {
      addressValidation: {},
      formFields: {
        mobilePhone: {},
      },
      modal: null,
      transactions: [],
      fieldTransactionMap: {},
    },
  });
  describe('#blockEditMode', () => {
    it('should be false if no field is in edit mode', () => {
      const state = getBasicState();
      const mappedProps = mapStateToProps(state, {
        fieldName: FIELD_NAMES.MOBILE_PHONE,
      });
      expect(mappedProps.blockEditMode).to.be.false;
    });
    it('should be false if currently editing another field but no changes have been made yet', () => {
      const state = getBasicState();
      state.vapService.modal = 'homePhone';
      state.vapService.hasUnsavedEdits = false;
      const mappedProps = mapStateToProps(state, {
        fieldName: FIELD_NAMES.MOBILE_PHONE,
      });
      expect(mappedProps.blockEditMode).to.be.false;
    });
    it('should be true if currently editing another field and changes have been made', () => {
      const state = getBasicState();
      state.vapService.modal = 'homePhone';
      state.vapService.hasUnsavedEdits = true;
      const mappedProps = mapStateToProps(state, {
        fieldName: FIELD_NAMES.MOBILE_PHONE,
      });
      expect(mappedProps.blockEditMode).to.be.true;
    });
  });
  describe('#activeEditView', () => {
    it('should be the field name of the field that is being edited', () => {
      const state = getBasicState();
      state.vapService.modal = FIELD_NAMES.RESIDENTIAL_ADDRESS;
      const mappedProps = mapStateToProps(state, {
        fieldName: FIELD_NAMES.MOBILE_PHONE,
      });
      expect(mappedProps.activeEditView).to.equal(
        FIELD_NAMES.RESIDENTIAL_ADDRESS,
      );
    });
    it('should be the field name of the address field that is being validated', () => {
      const state = getBasicState();
      state.vapService.modal = 'addressValidation';
      state.vapService.addressValidation.addressValidationType =
        FIELD_NAMES.RESIDENTIAL_ADDRESS;
      const mappedProps = mapStateToProps(state, {
        fieldName: FIELD_NAMES.MOBILE_PHONE,
      });
      expect(mappedProps.activeEditView).to.equal(
        FIELD_NAMES.RESIDENTIAL_ADDRESS,
      );
    });
  });
  describe('#showValidationView', () => {
    const showValidationModalState = () => ({
      user: {
        profile: {
          vapContactInfo: {
            mailingAddress: '',
          },
        },
      },
      vapService: {
        addressValidation: {
          addressValidationType: FIELD_NAMES.MAILING_ADDRESS,
        },
        formFields: {
          mailingAddress: {},
        },
        modal: 'addressValidation',
        transactions: [],
        fieldTransactionMap: {},
      },
    });
    describe('when all the correct conditions are met', () => {
      it('sets `showValidationView` to `true`', () => {
        const state = showValidationModalState();
        const mappedProps = mapStateToProps(state, {
          fieldName: FIELD_NAMES.MAILING_ADDRESS,
        });
        expect(mappedProps.showValidationView).to.be.true;
      });
    });
    describe('when the address validation modal is not open', () => {
      it('sets `showValidationView` to `false`', () => {
        const state = showValidationModalState();
        state.vapService.modal = 'notTheValidationModal';
        const mappedProps = mapStateToProps(state, {
          fieldName: FIELD_NAMES.MAILING_ADDRESS,
        });
        expect(mappedProps.showValidationView).to.be.false;
      });
    });
    describe("when this ProfileInformationFieldController's `fieldName` does not match address validation type", () => {
      it('sets `showValidationView` to `false`', () => {
        const state = showValidationModalState();
        const mappedProps = mapStateToProps(state, {
          fieldName: FIELD_NAMES.RESIDENTIAL_ADDRESS,
        });
        expect(mappedProps.showValidationView).to.be.false;
      });
    });
  });
});
