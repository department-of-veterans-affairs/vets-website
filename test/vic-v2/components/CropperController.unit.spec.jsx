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
  });
  it('should rotate', () => {
    const tree = shallow(
      <CropperController src="test"/>
    );

    const cropper = {
      rotate: sinon.spy(),
      getData: () => {
        return {
          width: 100
        };
      },
      getCanvasData: () => {
        return {
          width: 200,
          naturalWidth: 100
        };
      },
      getContainerData: () => {
        return {
          width: 100
        };
      },
      getCropBoxData: () => {
        return {
          width: 100,
          height: 100
        };
      },
      setCanvasData: sinon.spy()
    };
    tree.instance().cropper = cropper;

    tree.find('MoveRotateButton').at(4).props().onClick();

    const state = tree.state();

    expect(cropper.rotate.calledWith(-90)).to.be.true;
    expect(cropper.setCanvasData.called).to.be.true;
    expect(state.zoomMin).to.eql(2);
    expect(state.zoomValue).to.eql(2);

    cropper.rotate.reset();
    tree.find('MoveRotateButton').at(5).props().onClick();
    expect(cropper.rotate.calledWith(90)).to.be.true;
  });
  it('should zoom on button click', () => {
    const tree = shallow(
      <CropperController src="test"/>
    );

    const cropper = {
      rotate: sinon.spy(),
      getData: () => {
        return {
          width: 100
        };
      },
      getCanvasData: () => {
        return {
          width: 200,
          naturalWidth: 100
        };
      },
      getContainerData: () => {
        return {
          width: 100
        };
      },
      getCropBoxData: () => {
        return {
          width: 100,
          height: 100
        };
      },
      setCanvasData: sinon.spy(),
      zoom: sinon.spy()
    };
    tree.instance().cropper = cropper;

    tree.setState({
      zoomValue: 2,
      zoomMax: 3,
      zoomMin: 1
    });

    tree.find('.cropper-control').at(0).props().onClick();

    expect(cropper.zoom.calledWith(-0.1)).to.be.true;

    tree.find('.cropper-control').at(1).props().onClick();
    expect(cropper.zoom.calledWith(0.1)).to.be.true;
  });
  it('should update instance after zooming', () => {
    const tree = shallow(
      <CropperController src="test"/>
    );

    const cropper = {
      rotate: sinon.spy(),
      getData: () => {
        return {
          width: 100
        };
      },
      getCanvasData: () => {
        return {
          width: 200,
          naturalWidth: 100
        };
      },
      getContainerData: () => {
        return {
          width: 100
        };
      },
      getCropBoxData: () => {
        return {
          width: 100,
          height: 100
        };
      },
      setCanvasData: sinon.spy(),
      zoom: sinon.spy()
    };
    tree.instance().cropper = cropper;

    tree.setState({
      zoomValue: 2,
      zoomMax: 3,
      zoomMin: 1
    });

    tree.instance().onZoom({
      detail: {
        ratio: 1.5
      }
    });

    const state = tree.state();

    expect(state.zoomValue).to.eql(1.5);
  });
  describe('should move', () => {
    let cropper;
    let tree;
    beforeEach(() => {
      tree = shallow(
        <CropperController src="test"/>
      );

      cropper = {
        rotate: sinon.spy(),
        getData: () => {
          return {
            width: 400
          };
        },
        getCanvasData: () => {
          return {
            top: 10,
            left: 10,
            width: 200,
            naturalWidth: 100
          };
        },
        getContainerData: () => {
          return {
            width: 100
          };
        },
        getCropBoxData: () => {
          return {
            width: 100,
            height: 100
          };
        },
        setCanvasData: sinon.spy(),
        zoom: sinon.spy()
      };
      tree.instance().cropper = cropper;

      tree.setState({
        zoomValue: 1,
        zoomMax: 3,
        zoomMin: 0.5
      });
    });
    it('up without warning', () => {
      tree.find('MoveRotateButton').at(0).props().onClick();

      const state = tree.state();

      expect(state.warningMessage).to.eql('');
      expect(cropper.setCanvasData.firstCall.args[0].top).to.eql(5);
    });
    it('down without warning', () => {
      tree.find('MoveRotateButton').at(1).props().onClick();

      const state = tree.state();

      expect(state.warningMessage).to.eql('');
      expect(cropper.setCanvasData.firstCall.args[0].top).to.eql(15);
    });
    it('left without warning', () => {
      tree.find('MoveRotateButton').at(2).props().onClick();

      const state = tree.state();

      expect(state.warningMessage).to.eql('');
      expect(cropper.setCanvasData.firstCall.args[0].left).to.eql(5);
    });
    it('right without warning', () => {
      tree.find('MoveRotateButton').at(3).props().onClick();

      const state = tree.state();

      expect(state.warningMessage).to.eql('');
      expect(cropper.setCanvasData.firstCall.args[0].left).to.eql(15);
    });
    it.only('up with warning', () => {
      cropper.getCanvasData = () => {
        return {
          top: -400,
          left: 10,
          width: 500,
          height: 500
        };
      };
      cropper.getCropBoxData = () => {
        return {
          top: -400,
          left: 10,
          width: 100,
          height: 100
        };
      };

      tree.find('MoveRotateButton').at(0).props().onClick();

      const state = tree.state();

      expect(state.warningMessage).to.contain('farther up');
      expect(cropper.setCanvasData.firstCall.args[0].top).to.eql(1);
    });
    it('down with warning', () => {
      tree.find('MoveRotateButton').at(1).props().onClick();

      const state = tree.state();

      expect(state.warningMessage).to.contain('farther down');
      expect(cropper.setCanvasData.firstCall.args[0].top).to.eql(15);
    });
    it('left with warning', () => {
      tree.find('MoveRotateButton').at(2).props().onClick();

      const state = tree.state();

      expect(state.warningMessage).to.contain('farther left');
      expect(cropper.setCanvasData.firstCall.args[0].left).to.eql(5);
    });
    it('right with warning', () => {
      tree.find('MoveRotateButton').at(3).props().onClick();

      const state = tree.state();

      expect(state.warningMessage).to.contain('farther right');
      expect(cropper.setCanvasData.firstCall.args[0].left).to.eql(15);
    });
  });
});
