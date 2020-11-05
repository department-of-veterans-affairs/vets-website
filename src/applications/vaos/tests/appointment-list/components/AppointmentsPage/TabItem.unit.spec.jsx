import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import TabItem from '../../../../appointment-list/components/AppointmentsPage/TabItem';

describe('<TabItem>', () => {
  it('should render tab', () => {
    const tree = shallow(
      <TabItem id="id" title="Title Here" tabpath="upcoming" />,
    );
    expect(tree.find('NavLink').props()['aria-label']).to.equal(
      'id appointments',
    );
    expect(tree.find('NavLink').props().id).to.equal('tabid');
    expect(tree.find('NavLink').props().to).to.equal('upcoming');
    tree.unmount();
  });

  it('should remove hyphens from aria-label', () => {
    const tree = shallow(
      <TabItem id="id-with-hyphens" title="Title Here" tabpath="upcoming" />,
    );
    expect(tree.find('NavLink').props()['aria-label']).to.equal(
      'id with hyphens appointments',
    );
    expect(tree.find('NavLink').props().id).to.equal('tabid-with-hyphens');
    expect(tree.find('NavLink').props().to).to.equal('upcoming');
    tree.unmount();
  });

  it('should render active tab', () => {
    const tree = shallow(
      <TabItem id="id" isActive title="Title Here" tabpath="upcoming" />,
    );

    expect(tree.find('NavLink').props()['aria-controls']).to.equal(
      'tabpanelid',
    );
    expect(tree.find('NavLink').props()['aria-label']).to.equal(
      'id appointments',
    );
    expect(tree.find('NavLink').props()['aria-selected']).to.equal('true');
    expect(tree.find('NavLink').props().id).to.equal('tabid');
    expect(tree.find('NavLink').props().to).to.equal('upcoming');
    tree.unmount();
  });

  it('should call previous tab on arrow left', () => {
    const tree = shallow(
      <TabItem id="id" isActive title="Title Here" tabpath="upcoming" />,
    );

    expect(tree.find('NavLink').props()['aria-controls']).to.equal(
      'tabpanelid',
    );
    expect(tree.find('NavLink').props()['aria-label']).to.equal(
      'id appointments',
    );
    expect(tree.find('NavLink').props()['aria-selected']).to.equal('true');
    expect(tree.find('NavLink').props().id).to.equal('tabid');
    expect(tree.find('NavLink').props().to).to.equal('upcoming');
    tree.unmount();
  });

  it('should call next tab on arrow right', () => {
    const onNextTab = sinon.spy();
    const tree = shallow(
      <TabItem
        id="id"
        isActive
        title="Title Here"
        tabpath="upcoming"
        onNextTab={onNextTab}
      />,
    );

    tree.find('NavLink').simulate('keydown', { key: 'ArrowRight' });
    expect(onNextTab.called).to.be.true;
    tree.unmount();
  });

  it('should call previous tab on arrow left', () => {
    const onPreviousTab = sinon.spy();
    const tree = shallow(
      <TabItem
        id="id"
        isActive
        title="Title Here"
        tabpath="upcoming"
        onPreviousTab={onPreviousTab}
      />,
    );

    tree.find('NavLink').simulate('keydown', { key: 'ArrowLeft' });
    expect(onPreviousTab.called).to.be.true;
    tree.unmount();
  });

  it('should focus on tab panel on arrow down', () => {
    const tree = shallow(
      <TabItem id="id" isActive title="Title Here" tabpath="upcoming" />,
    );
    const panel = document.createElement('div');
    panel.id = 'tabpanelid';
    document.body.appendChild(panel);

    tree.find('NavLink').simulate('keydown', { key: 'ArrowDown' });
    expect(document.activeElement.id).to.equal('tabpanelid');
    tree.unmount();
  });

  it('should render flex css for tab', () => {
    const tree = shallow(
      <TabItem id="id" title="Title Here" tabpath="upcoming" />,
    );
    expect(tree.find('NavLink').props().className).to.contain(
      'vaos-appts__tab',
    );

    tree.unmount();
  });
});
