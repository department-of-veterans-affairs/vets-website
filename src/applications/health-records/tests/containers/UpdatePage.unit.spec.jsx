import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { UpdatePage } from '../../containers/UpdatePage';

const props = {
  refresh: {
    statuses: {
      succeeded: [],
      failed: [],
      incomplete: [],
    }
  },
  form: {
    ready: false,
  },
  submitForm: sinon.spy(),
  router: { push: sinon.spy() },
};

const mockSessionStorage = () => {
  global.sessionStorage = {
    getItem: () => {
      return null;
    },
  };
};

describe('<UpdatePage>', () => {
  beforeEach(mockSessionStorage);

  test('should render', () => {
    const tree = SkinDeep.shallowRender(<UpdatePage {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  test('should correctly redirect when update is complete', () => {
    const tree = SkinDeep.shallowRender(<UpdatePage {...props}/>);
    tree.getMountedInstance().componentDidUpdate();
    expect(props.submitForm.called).to.be.true;
  });

  test('should correctly redirect when skip update is clicked', () => {
    const tree = SkinDeep.shallowRender(<UpdatePage {...props}/>);
    tree.subTree('Link').props.onClick({ preventDefault: () => {} });
    expect(props.submitForm.called).to.be.true;
    expect(props.router.push.calledWith('/download')).to.be.true;
  });
});
