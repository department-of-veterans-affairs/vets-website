import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { ExitApplicationButton } from '../../components/ExitApplicationButton';
import formConfig from '../../config/form';
import * as saveInProgressApi from 'platform/forms/save-in-progress/api';
import captureEvents from '../../analytics-functions';

const props = {
  formId: formConfig.formId,
  isLoggedIn: false,
};

describe('<ExitApplicationButton>', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(function() {
    sandbox.stub(saveInProgressApi, 'removeFormApi');
    sandbox.stub(captureEvents, 'exitApplication');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should render', () => {
    const tree = shallow(<ExitApplicationButton {...props} />);
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should call captureEvents exitApplication', () => {
    const tree = shallow(<ExitApplicationButton {...props} />);

    tree.find('a').simulate('click');

    expect(captureEvents.exitApplication.calledOnce).to.be.true;
    tree.unmount();
  });

  it('should remove in progress when a user is logged in', () => {
    const tree = shallow(
      <ExitApplicationButton formId={formConfig.formId} isLoggedIn />,
    );

    tree.find('a').simulate('click');

    expect(saveInProgressApi.removeFormApi.calledOnce).to.be.true;
    tree.unmount();
  });

  it('should not attempt to remove an in progress form when not logged in', () => {
    const tree = shallow(<ExitApplicationButton {...props} />);

    tree.find('a').simulate('click');

    expect(saveInProgressApi.removeFormApi.notCalled).to.be.true;
    tree.unmount();
  });
});
