import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RefillAlert from '../../../components/RefillPrescriptions/RefillAlert';

describe('RefillAlert component', () => {
  const defaultConfig = {
    id: 'refill-alert',
    testId: 'refill-alert',
    status: 'info',
    className: 'refill-alert',
    title: 'Refill Alert',
  };

  const setup = (config = defaultConfig, children = null) => {
    return shallow(<RefillAlert config={config}>{children}</RefillAlert>);
  };

  it('renders without errors', () => {
    const wrapper = setup();
    expect(wrapper.exists()).to.be.true;
  });

  it('renders children correctly', () => {
    const defaultChildren = <div>Test Child</div>;
    const wrapper = setup(defaultConfig, defaultChildren);
    expect(wrapper.find('div').text()).to.equal('Test Child');
  });
});
