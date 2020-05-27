import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  VAPProfileField,
  mapStateToProps,
} from '../../containers/VAPProfileField';
import { TRANSACTION_STATUS } from '../../constants';

function ContentView() {
  return <h1>Content</h1>;
}

function EditView() {
  return <span>EditView</span>;
}

function ValidationView() {
  return <span>ValidationView</span>;
}

describe('<VAPProfileField/>', () => {
  let props = null;
  let component = null;

  beforeEach(() => {
    props = {
      analyticsSectionName: 'some-field',
      clearErrors() {},
      ContentView: () => <ContentView />,
      data: { someField: 'someFieldValue' },
      EditView: () => <EditView />,
      field: null,
      fieldName: 'someField',
      showEditView: false,
      showValidationView: false,
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

  it('renders the ContentView prop', () => {
    component = enzyme.shallow(<VAPProfileField {...props} />);
    expect(
      component.find('ContentView'),
      'the ContentView was rendered',
    ).to.have.lengthOf(1);
    component.unmount();
  });

  it('conditional render based on existence of data', () => {
    const isEmptyProps = {
      ...props,
      isEmpty: true,
    };

    component = enzyme.shallow(<VAPProfileField {...isEmptyProps} />);
    expect(
      component.find('ContentView'),
      'the ContentView was NOT rendered',
    ).to.have.lengthOf(0);
    expect(
      component.html(),
      'the add-button was rendered instead of the Content',
    ).to.contain('button');
    component.unmount();
  });

  it('renders the EditView prop', () => {
    props.showEditView = true;
    sinon.spy(props, 'EditView');

    component = enzyme.shallow(<VAPProfileField {...props} />);

    expect(
      component.find('EditView'),
      'the EditView was rendered',
    ).to.have.lengthOf(1);

    component.find('EditView').dive();
    expect(props.EditView.called).to.be.true;

    const args = props.EditView.getCall(0).args[0];
    expect(
      args,
      'All props were passed to the EditView constructor',
    ).to.have.all.keys(Object.keys(props));
    component.unmount();
  });

  it('renders the ValidationView prop', () => {
    props.showValidationView = true;
    props.ValidationView = () => <ValidationView />;
    const expectedProps = {
      transaction: props.transaction,
      title: props.title,
      transactionRequest: props.transactionRequest,
      clearErrors: props.clearErrors,
    };
    sinon.spy(props, 'ValidationView');

    component = enzyme.shallow(<VAPProfileField {...props} />);

    expect(
      component.find('ValidationView'),
      'the ValidationView was rendered',
    ).to.have.lengthOf(1);

    component.find('ValidationView').dive();
    expect(props.ValidationView.called).to.be.true;

    const args = props.ValidationView.getCall(0).args[0];
    expect(
      args,
      'No props were passed to the ValidationView constructor',
    ).to.have.all.keys(expectedProps);
    component.unmount();
  });

  it('renders the edit link', () => {
    component = enzyme.shallow(<VAPProfileField {...props} />);

    let onEditClick = component.find('VAPEditButton').props().onEditClick;
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

    onEditClick = component.find('VAPEditButton').props().onEditClick;
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
  describe('#showValidationView', () => {
    describe('when all the correct conditions are met', () => {
      it('sets `showValidationView` to `true`', () => {
        const state = showValidationModalState();
        const mappedProps = mapStateToProps(state, {
          fieldName: 'mailingAddress',
          ValidationView: () => {},
        });
        expect(mappedProps.showValidationView).to.be.true;
      });
    });
    describe('when the address validation modal is not open', () => {
      it('sets `showValidationView` to `false`', () => {
        const state = showValidationModalState();
        state.vet360.modal = 'notTheValidationModal';
        const mappedProps = mapStateToProps(state, {
          fieldName: 'mailingAddress',
          ValidationView: () => {},
        });
        expect(mappedProps.showValidationView).to.be.false;
      });
    });
    describe('when no ValidationView was passed to the VAPProfileField component', () => {
      it('sets `showValidationView` to `false`', () => {
        const state = showValidationModalState();
        const mappedProps = mapStateToProps(state, {
          fieldName: 'mailingAddress',
        });
        expect(mappedProps.showValidationView).to.be.false;
      });
    });
    describe("when this VAPProfileField's `fieldName` does not match address validation type", () => {
      it('sets `showValidationView` to `false`', () => {
        const state = showValidationModalState();
        const mappedProps = mapStateToProps(state, {
          fieldName: 'residentialAddress',
          ValidationView: () => {},
        });
        expect(mappedProps.showValidationView).to.be.false;
      });
    });
  });
});
