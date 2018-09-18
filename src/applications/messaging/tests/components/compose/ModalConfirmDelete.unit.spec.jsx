import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import ModalConfirmDelete from '../../../components/compose/ModalConfirmDelete';

const props = {
  onClose: () => {},
  onDelete: () => {},
  visible: true,
};

describe('<ModalConfirmDelete>', () => {
  test('should render correctly', () => {
    const tree = SkinDeep.shallowRender(<ModalConfirmDelete {...props}/>);

    expect(tree.getRenderOutput()).to.exist;
  });

  test('should render the expected child elements', () => {
    const tree = SkinDeep.shallowRender(<ModalConfirmDelete {...props}/>);

    expect(tree.subTree('Modal')).to.be.ok;
  });

  test('should handle deletion correctly', () => {
    const onDelete = sinon.spy();
    const modalConfirmDelete = ReactTestUtils.renderIntoDocument(
      <ModalConfirmDelete
        {...props }
        onDelete={onDelete}/>
    );

    modalConfirmDelete.handleDelete({ preventDefault: () => {} });

    expect(onDelete.called).to.be.true;
  });
});
