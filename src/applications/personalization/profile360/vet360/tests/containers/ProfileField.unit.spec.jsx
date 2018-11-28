import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { Vet360ProfileField } from '../../containers/ProfileField';
import { TRANSACTION_STATUS } from '../../constants';

function Content() {
  return <h1>Content</h1>;
}

function EditModal() {
  return <span>EditModal</span>;
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
      'No onEditClick prop should be passed if there is a transaction processing',
    ).to.be.false;
  });
});
