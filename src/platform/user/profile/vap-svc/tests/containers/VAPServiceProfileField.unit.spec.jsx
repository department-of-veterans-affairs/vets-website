import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  VAPServiceProfileField,
  mapStateToProps,
} from '../../containers/VAPServiceProfileField';
import { TRANSACTION_STATUS } from '../../constants';

function Content() {
  return <h1>Content</h1>;
}

function EditModal() {
  return <span>EditModal</span>;
}

describe('<VAPServiceProfileField/>', () => {
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
    component = enzyme.shallow(<VAPServiceProfileField {...props} />);
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

    component = enzyme.shallow(<VAPServiceProfileField {...isEmptyProps} />);
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

  it('renders the edit link', () => {
    component = enzyme.shallow(<VAPServiceProfileField {...props} />);

    const { onEditClick } = component
      .find('VAPServiceProfileFieldHeading')
      .props();
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

    const editClickThatShouldBeNull = component
      .find('VAPServiceProfileFieldHeading')
      .props().onEditClick;
    expect(
      editClickThatShouldBeNull,
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
        vapContactInfo: {
          mailingAddress: '',
        },
      },
    },
    vapService: {
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
    describe('when the address validation modal is not open', () => {
      it('sets `showValidationModal` to `false`', () => {
        const state = showValidationModalState();
        state.vapService.modal = 'notTheValidationModal';
        const mappedProps = mapStateToProps(state, {
          fieldName: 'mailingAddress',
          ValidationModal: () => {},
        });
        expect(mappedProps.showValidationModal).to.be.false;
      });
    });

    describe("when this VAPServiceProfileField's `fieldName` does not match address validation type", () => {
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
