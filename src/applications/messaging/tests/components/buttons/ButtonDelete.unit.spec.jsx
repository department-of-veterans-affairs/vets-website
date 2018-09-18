import { expect } from 'chai';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import ButtonDelete from '../../../components/buttons/ButtonDelete';

const props = {
  onClick: () => {},
};

describe('<ButtonDelete>', () => {
  test('should render correctly', () => {
    const tree = SkinDeep.shallowRender(<ButtonDelete {...props}/>);

    expect(tree.getRenderOutput()).to.exist;
  });

  test('should have the expected classname', () => {
    const tree = SkinDeep.shallowRender(<ButtonDelete {...props}/>);

    expect(tree.props.className).to.equal('msg-btn-delete');
  });

  test('should handle click action properly', () => {
    const onClick = sinon.spy();
    const buttonDelete = ReactTestUtils.renderIntoDocument(
      <ButtonDelete
        onClick={onClick}/>
    );

    buttonDelete.handleClick();
    expect(onClick.called).to.be.true;
  });
});
