import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  ContactInformationField,
  mapStateToProps,
} from '@@profile/components/personal-information/ContactInformationField';
import { FIELD_NAMES, TRANSACTION_STATUS } from '@@vap-svc/constants';

describe('<ContactInformationField/>', () => {
  let props = null;
  let component = null;

  beforeEach(() => {
    props = {
      analyticsSectionName: 'some-field',
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

    component = enzyme.shallow(<ContactInformationField {...isEmptyProps} />);
    expect(
      component.find('ContactInformationView'),
      'the ContactInformationView was NOT rendered',
    ).to.have.lengthOf(0);

    expect(
      component.html(),
      'the add-button was rendered instead of the Content',
    ).to.contain('button');
    component.unmount();
  });

  it('renders the ContactInformationEditView', () => {
    props.showEditView = true;
    component = enzyme.shallow(<ContactInformationField {...props} />);

    expect(
      component.find('Connect(ContactInformationEditView)'),
      'the ContactInformationEditView was rendered',
    ).to.have.lengthOf(1);

    component.unmount();
  });

  it('renders the ContactInformationView', () => {
    component = enzyme.shallow(<ContactInformationField {...props} />);

    expect(
      component.find('ContactInformationView'),
      'the ContactInformationView was rendered',
    ).to.have.lengthOf(1);

    component.unmount();
  });

  it('renders the edit link', () => {
    component = enzyme.shallow(<ContactInformationField {...props} />);

    let editButton = component.find('[id="homePhone-edit-link"]');

    const onEditClick = editButton.props().onClick;
    onEditClick();
    props.openModal();
    expect(props.openModal.callCount, 'onEdit').to.be.equal(2);

    component.setProps({
      transaction: {
        data: {
          attributes: { transactionStatus: TRANSACTION_STATUS.RECEIVED },
        },
      },
    });

    editButton = component.find('ContactInformationEditButton');

    expect(
      editButton,
      'Edit button should be hidden when a transaction is pending',
    ).to.have.length(0);

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
    it('should be true if currently editing another field', () => {
      const state = getBasicState();
      state.vapService.modal = 'homePhone';
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
    describe("when this ContactInformationField's `fieldName` does not match address validation type", () => {
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
