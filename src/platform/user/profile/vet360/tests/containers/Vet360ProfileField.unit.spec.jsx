import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  Vet360ProfileField,
  mapStateToProps,
} from '../../containers/Vet360ProfileField';
import { TRANSACTION_STATUS } from '../../constants';

function Content() {
  return <h1>Content</h1>;
}

function EditModal() {
  return <span>EditModal</span>;
}

function ValidationModal() {
  return <span>ValidationModal</span>;
}

describe('<Vet360ProfileField/>', () => {
  let props = null;
  let component = null;

  beforeEach(() => {
    props = {
      analyticsSectionName: 'some-field',
      clearErrors() {},
      Content: () => <Content />,
      data: { someField: 'someFieldValue' },
      EditModal: () => <EditModal />,
      field: null,
      fieldName: 'someField',
      isEditing: false,
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

  it('renders the Content prop', () => {
    component = enzyme.shallow(<Vet360ProfileField {...props} />);
    expect(
      component.find('Content'),
      'the Content was rendered',
    ).to.have.lengthOf(1);
    component.unmount();
  });

  it('conditional render based on existence of data', () => {
    const isEmptyProps = {
      ...props,
      isEmpty: true,
    };

    component = enzyme.shallow(<Vet360ProfileField {...isEmptyProps} />);
    expect(
      component.find('Content'),
      'the Content was NOT rendered',
    ).to.have.lengthOf(0);
    expect(
      component.html(),
      'the add-button was rendered instead of the Content',
    ).to.contain('button');
    component.unmount();
  });

  it('renders the EditModal prop', () => {
    props.isEditing = true;
    sinon.spy(props, 'EditModal');

    component = enzyme.shallow(<Vet360ProfileField {...props} />);

    expect(
      component.find('EditModal'),
      'the EditModal was rendered',
    ).to.have.lengthOf(1);

    component.find('EditModal').dive();
    expect(props.EditModal.called).to.be.true;

    const args = props.EditModal.getCall(0).args[0];
    expect(
      args,
      'All props were passed to the EditModal constructor',
    ).to.have.all.keys(Object.keys(props));
    component.unmount();
  });

  it('renders the ValidationModal prop', () => {
    props.showValidationModal = true;
    props.ValidationModal = () => <ValidationModal />;
    const expectedProps = {
      transaction: props.transaction,
      title: props.title,
      transactionRequest: props.transactionRequest,
      clearErrors: props.clearErrors,
    };
    sinon.spy(props, 'ValidationModal');

    component = enzyme.shallow(<Vet360ProfileField {...props} />);

    expect(
      component.find('ValidationModal'),
      'the ValidationModal was rendered',
    ).to.have.lengthOf(1);

    component.find('ValidationModal').dive();
    expect(props.ValidationModal.called).to.be.true;

    const args = props.ValidationModal.getCall(0).args[0];
    expect(
      args,
      'No props were passed to the ValidationModal constructor',
    ).to.have.all.keys(expectedProps);
    component.unmount();
  });

  it('renders the edit link', () => {
    component = enzyme.shallow(<Vet360ProfileField {...props} />);

    let onEditClick = component.find('Vet360ProfileFieldHeading').props()
      .onEditClick;
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

    onEditClick = component.find('Vet360ProfileFieldHeading').props()
      .onEditClick;
    expect(
      onEditClick,
      'Should pass a null onEditClick prop if there is a transaction processing',
    ).to.be.null;
    component.unmount();
  });
});

describe('mapStateToProps', () => {
  const showValidationModalState = () => ({
    featureToggles: { vaProfileAddressValidation: true },
    user: {
      profile: {
        vet360: {
          mailingAddress: '',
        },
      },
    },
    vet360: {
      addressValidation: {
        addressValidationType: 'mailingAddress',
      },
      formFields: {
        mailingAddress: {},
      },
      modal: 'addressValidation',
      transactions: [],
      fieldTransactionMap: {},
    },
  });
  describe('#showValidationModal', () => {
    describe('when all the correct conditions are met', () => {
      it('sets `showValidationModal` to `true`', () => {
        const state = showValidationModalState();
        const mappedProps = mapStateToProps(state, {
          fieldName: 'mailingAddress',
          ValidationModal: () => {},
        });
        expect(mappedProps.showValidationModal).to.be.true;
      });
    });
    describe('when the feature flag is not set', () => {
      it('sets `showValidationModal` to `false`', () => {
        const state = showValidationModalState();
        state.featureToggles = {};
        const mappedProps = mapStateToProps(state, {
          fieldName: 'mailingAddress',
          ValidationModal: () => {},
        });
        expect(mappedProps.showValidationModal).to.be.false;
      });
    });
    describe('when the address validation modal is not open', () => {
      it('sets `showValidationModal` to `false`', () => {
        const state = showValidationModalState();
        state.vet360.modal = 'notTheValidationModal';
        const mappedProps = mapStateToProps(state, {
          fieldName: 'mailingAddress',
          ValidationModal: () => {},
        });
        expect(mappedProps.showValidationModal).to.be.false;
      });
    });
    describe('when no ValidationModal was passed to the Vet360ProfileField component', () => {
      it('sets `showValidationModal` to `false`', () => {
        const state = showValidationModalState();
        const mappedProps = mapStateToProps(state, {
          fieldName: 'mailingAddress',
        });
        expect(mappedProps.showValidationModal).to.be.false;
      });
    });
    describe("when this Vet360ProfileField's `fieldName` does not match address validation type", () => {
      it('sets `showValidationModal` to `false`', () => {
        const state = showValidationModalState();
        const mappedProps = mapStateToProps(state, {
          fieldName: 'residentialAddress',
          ValidationModal: () => {},
        });
        expect(mappedProps.showValidationModal).to.be.false;
      });
    });
  });
});
