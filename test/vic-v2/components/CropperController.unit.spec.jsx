import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import CropperController from '../../../src/js/vic-v2/components/CropperController';

describe.only('<CropperController>', () => {
  it('should render', () => {
    const tree = shallow(
      <CropperController src="test"/>
    );

    expect(tree.find('MoveRotateButton').length).to.equal(6);
    expect(tree.find('.cropper-control').length).to.equal(4);
    expect(tree.find('Cropper').exists()).to.be.true;
  });
  it('should rotate left', () => {
    const tree = shallow(
      <CropperController src="test"/>
    );

    tree.instance().cropper = {
      rotate: sinon.spy(),
      getCanvasData: sinon.spy(),
      getContainerData: sinon.spy(),
      getCropBoxData: sinon.spy()
    };

    tree.find('MoveRotateButton').at(4).props().onClick();
  });
});
