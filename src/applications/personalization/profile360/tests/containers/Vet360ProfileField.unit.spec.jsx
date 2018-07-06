import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { Vet360ProfileField } from '../../containers/Vet360ProfileField';

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
      Content: () => <Content/>,
      data: { someField: 'someFieldValue' },
      EditModal: () => <EditModal/>,
      field: null,
      fieldName: 'someField',
      isEditing: false,
      isEmpty: null,
      onAdd() {},
      onCancel() {},
      onChange() {},
      onDelete() {},
      onEdit() {},
      onSubmit() {},
      refreshTransaction() {},
      title: 'Some field',
      transaction: null,
      transactionRequest: null
    };
  });

  it('renders the Content prop', () => {
    component = enzyme.shallow(<Vet360ProfileField {...props}/>);
    expect(component.find('Content'), 'the Content was rendered').to.have.lengthOf(1);
  });

  it('calls isEmpty', () => {
    props.data = null;
    component = enzyme.shallow(<Vet360ProfileField {...props}/>);
    expect(component.find('Content'), 'the Content was NOT rendered').to.have.lengthOf(0);
    expect(component.html(), 'the add-button was rendered instead of the Content').to.contain('button');

    props.isEmpty = sinon.stub().returns(true);
    component.setProps(props);
    expect(component.html(), 'the custom isEmpty prop worked').to.contain('button');
    expect(props.isEmpty.calledWith(props), 'component props was passed to isEmpty').to.be.true;

    props.isEmpty = sinon.stub().returns(false);
    props.data = {};
    component.setProps(props);
    expect(component.find('Content'), 'the custom isEmpty prop worked').to.have.lengthOf(1);
  });

  it('renders the EditModal prop', () => {
    props.isEditing = true;
    sinon.spy(props, 'EditModal');

    component = enzyme.shallow(<Vet360ProfileField {...props}/>);

    expect(component.find('EditModal'), 'the EditModal was rendered').to.have.lengthOf(1);

    component.find('EditModal').dive();
    expect(props.EditModal.called).to.be.true;

    const args = props.EditModal.getCall(0).args[0];
    expect(args, 'All props were passed to the EditModal constructor').to.have.all.keys(Object.keys(props));
  });
});
