import { expect } from 'chai';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import ButtonDelete from '../../../../src/js/messaging/components/buttons/ButtonDelete';

describe('<ButtonDelete>', () => {
  it('should render correctly', () => {
    const tree = SkinDeep.shallowRender(<ButtonDelete/>);

    expect(tree.getRenderOutput()).to.exist;
  });

  it('should have the expected classname', () => {
    const tree = SkinDeep.shallowRender(<ButtonDelete/>);

    expect(tree.props.className).to.equal('msg-btn-delete');
  });

  it('should handle click action properly', () => {
    const onClickHandler = sinon.spy();
    const buttonDelete = ReactTestUtils.renderIntoDocument(
      <ButtonDelete
          onClickHandler={onClickHandler}/>
    );

    buttonDelete.handleClick();
    expect(onClickHandler.called).to.be.true;
  });
});
