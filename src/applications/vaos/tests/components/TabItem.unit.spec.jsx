import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import TabItem from '../../components/TabItem';

describe('<TabItem>', () => {
  it('should render tab', () => {
    const tree = shallow(
      <TabItem id="title" title="Title Here" tabpath="upcoming" />,
    );

    expect(tree.find('IndexLink').props().id).to.equal('tabtitle');
    expect(tree.find('IndexLink').props().to).to.equal('upcoming');
    tree.unmount();
  });

  it('should render active tab', () => {
    const tree = shallow(
      <TabItem id="title" isActive title="Title Here" tabpath="upcoming" />,
    );

    expect(tree.find('IndexLink').props()['aria-controls']).to.equal(
      'tabpaneltitle',
    );
    expect(tree.find('IndexLink').props()['aria-selected']).to.equal('true');
    expect(tree.find('IndexLink').props().id).to.equal('tabtitle');
    expect(tree.find('IndexLink').props().to).to.equal('upcoming');
    tree.unmount();
  });

  it('should call previous tab on arrow left', () => {
    const tree = shallow(
      <TabItem id="title" isActive title="Title Here" tabpath="upcoming" />,
    );

    expect(tree.find('IndexLink').props()['aria-controls']).to.equal(
      'tabpaneltitle',
    );
    expect(tree.find('IndexLink').props()['aria-selected']).to.equal('true');
    expect(tree.find('IndexLink').props().id).to.equal('tabtitle');
    expect(tree.find('IndexLink').props().to).to.equal('upcoming');
    tree.unmount();
  });

  it('should call next tab on arrow right', () => {
    const onNextTab = sinon.spy();
    const tree = shallow(
      <TabItem
        id="title"
        isActive
        title="Title Here"
        tabpath="upcoming"
        onNextTab={onNextTab}
      />,
    );

    tree.find('IndexLink').simulate('keydown', { key: 'ArrowRight' });
    expect(onNextTab.called).to.be.true;
    tree.unmount();
  });

  it('should call previous tab on arrow left', () => {
    const onPreviousTab = sinon.spy();
    const tree = shallow(
      <TabItem
        id="title"
        isActive
        title="Title Here"
        tabpath="upcoming"
        onPreviousTab={onPreviousTab}
      />,
    );

    tree.find('IndexLink').simulate('keydown', { key: 'ArrowLeft' });
    expect(onPreviousTab.called).to.be.true;
    tree.unmount();
  });

  it('should focus on tab panel on arrow down', () => {
    const tree = shallow(
      <TabItem id="title" isActive title="Title Here" tabpath="upcoming" />,
    );
    const panel = document.createElement('div');
    panel.id = 'tabpaneltitle';
    document.body.appendChild(panel);

    tree.find('IndexLink').simulate('keydown', { key: 'ArrowDown' });
    expect(document.activeElement.id).to.equal('tabpaneltitle');
    tree.unmount();
  });

  it('should render flex css for tab', () => {
    const tree = shallow(
      <TabItem id="title" title="Title Here" tabpath="upcoming" />,
    );
    expect(tree.find('IndexLink').props().className).to.contain(
      'vaos-appts__tab',
    );

    tree.unmount();
  });
});
