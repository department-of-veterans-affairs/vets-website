import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { TabNav } from '../../components/TabNav';

describe('<TabNav>', () => {
  it('should render two tabs', () => {
    const location = {
      pathname: '/',
    };

    const tree = shallow(<TabNav location={location} id={1} />);

    expect(tree.find('TabItem').length).to.equal(2);
    expect(
      tree
        .find('TabItem')
        .first()
        .props().isActive,
    ).to.be.true;
    tree.unmount();
  });

  it('should render Express Care tab', () => {
    const location = {
      pathname: '/',
    };

    const tree = shallow(
      <TabNav location={location} id={1} hasExpressCareRequests />,
    );

    expect(tree.find('TabItem').length).to.equal(3);
    tree.unmount();
  });

  it('should render Express Care tab when on EC page', () => {
    const location = {
      pathname: '/express-care',
    };

    const tree = shallow(<TabNav location={location} id={1} />);

    expect(tree.find('TabItem').length).to.equal(3);
    tree.unmount();
  });

  it('should open next tab', () => {
    const location = {
      pathname: '/',
    };
    const router = {
      push: sinon.spy(),
    };

    const tree = shallow(<TabNav router={router} location={location} id={1} />);

    tree
      .find('TabItem')
      .first()
      .props()
      .onNextTab();

    expect(router.push.firstCall.args[0]).to.equal('/past');
    tree.unmount();
  });

  it('should open previous tab', () => {
    const location = {
      pathname: '/past',
    };
    const router = {
      push: sinon.spy(),
    };

    const tree = shallow(<TabNav router={router} location={location} id={1} />);

    tree
      .find('TabItem')
      .last()
      .props()
      .onPreviousTab();

    expect(router.push.firstCall.args[0]).to.equal('/');
    tree.unmount();
  });

  it('should open EC tab', () => {
    const location = {
      pathname: '/past',
    };
    const router = {
      push: sinon.spy(),
    };

    const tree = shallow(
      <TabNav
        router={router}
        location={location}
        id={1}
        hasExpressCareRequests
      />,
    );

    tree
      .find('TabItem')
      .at(1)
      .props()
      .onNextTab();

    expect(router.push.firstCall.args[0]).to.equal('/express-care');
    tree.unmount();
  });

  it('should go back to past appt tab', () => {
    const location = {
      pathname: '/express-care',
    };
    const router = {
      push: sinon.spy(),
    };

    const tree = shallow(
      <TabNav
        router={router}
        location={location}
        id={1}
        hasExpressCareRequests
      />,
    );

    tree
      .find('TabItem')
      .at(2)
      .props()
      .onPreviousTab();

    expect(router.push.firstCall.args[0]).to.equal('/past');
    tree.unmount();
  });
});
