import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import PaymentViewObjectField, {
  paymentRows,
} from '../../components/PaymentViewObjectField';

const getProps = ({ onEdit, newValues = '12345', origValues = '9876' }) => {
  const props = {
    renderedProperties: <div />,
    defaultEditButton: () => <button onClick={onEdit}>Edit</button>,
    title: 'Faboo',
  };
  props.formData = Object.keys(paymentRows).reduce(
    (acc, key) => {
      acc['view:bankAccount'][key] = newValues;
      acc['view:originalBankAccount'][`view:${key}`] = origValues;
      return acc;
    },
    { 'view:bankAccount': {}, 'view:originalBankAccount': {} },
  );
  return props;
};

describe('PaymentViewObjectField', () => {
  it('should not render', () => {
    const tree = shallow(<PaymentViewObjectField />);
    expect(tree).to.be.empty;
    tree.unmount();
  });
  it('should render with empty fields', () => {
    const onEdit = sinon.spy();
    const props = getProps({ onEdit, newValues: '', origValues: '' });
    const tree = shallow(<PaymentViewObjectField {...props} />);
    const list = tree.find('dd');
    expect(list).to.have.lengthOf(4);
    list.forEach(entry => expect(entry).to.be.empty);
    tree.unmount();
  });
  it('should render with newly entered values', () => {
    const onEdit = sinon.spy();
    const props = getProps({ onEdit });
    const tree = shallow(<PaymentViewObjectField {...props} />);
    const list = tree.find('dd');
    expect(list).to.have.lengthOf(4);
    list.forEach(entry => expect(entry.text()).to.equal('12345'));
    tree.unmount();
  });
  it('should render with original values', () => {
    const onEdit = sinon.spy();
    const props = getProps({ onEdit, newValues: '' });
    const tree = shallow(<PaymentViewObjectField {...props} />);
    const list = tree.find('dd');
    expect(list).to.have.lengthOf(4);
    list.forEach(entry => expect(entry.text()).to.equal('9876'));
    tree.unmount();
  });
});
