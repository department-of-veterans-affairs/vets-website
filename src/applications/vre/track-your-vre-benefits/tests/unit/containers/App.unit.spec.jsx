import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import * as reactRedux from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';

import * as userSelectors from 'platform/user/selectors';
import * as RequiredLoginViewMod from 'platform/user/authorization/components/RequiredLoginView';
import * as DowntimeNotificationMod from '~/platform/monitoring/DowntimeNotification';

import Breadcrumbs from '../../../components/Breadcrumbs';
import App from '../../../containers/App';

const sandbox = sinon.createSandbox();

describe('<App>', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      login: {
        currentlyLoggedIn: true,
      },
    };

    sandbox.stub(reactRedux, 'useSelector').returns(mockUser);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('passes the expected wrapper configuration', () => {
    const wrapper = shallow(<App />);
    const requiredLoginView = wrapper.find(RequiredLoginViewMod.default);

    expect(reactRedux.useSelector.calledOnce).to.be.true;
    expect(reactRedux.useSelector.firstCall.args[0]).to.equal(
      userSelectors.selectUser,
    );
    expect(requiredLoginView).to.have.lengthOf(1);
    expect(requiredLoginView.prop('user')).to.equal(mockUser);

    const row = requiredLoginView.prop('children');
    expect(row.props.className).to.equal('row');

    const rowChildren = React.Children.toArray(row.props.children);
    expect(rowChildren[0].type).to.equal(Breadcrumbs);
    expect(rowChildren[1].type).to.equal(DowntimeNotificationMod.default);
    expect(rowChildren[1].props.appTitle).to.equal('Track your VR&E benefits');
    expect(rowChildren[1].props.dependencies).to.deep.equal([
      DowntimeNotificationMod.externalServices.vreCh31Eligibility,
    ]);
    expect(rowChildren[1].props.children.type).to.equal(Outlet);

    wrapper.unmount();
  });
});
