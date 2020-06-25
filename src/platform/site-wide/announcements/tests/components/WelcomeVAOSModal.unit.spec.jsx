import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import WelcomeVAOSModal from '../../components/WelcomeVAOSModal';

describe('Announcements <WelcomeVAOSModal>', () => {
  it('renders', () => {
    const dismiss = sinon.spy();

    const tree = mount(<WelcomeVAOSModal dismiss={dismiss} />);

    expect(tree.text()).to.contain(
      'Welcome to the new VA online scheduling tool',
    );

    tree
      .find('button')
      .at(1)
      .props()
      .onClick();
    expect(dismiss.called).to.be.true;

    tree.unmount();
  });
});
