import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Insurance from '../Insurance';

describe('health care check in -- Insurance component -- ', () => {
  it('has a header', () => {
    const component = mount(<Insurance />);

    expect(component.find('h1').exists()).to.be.true;

    component.unmount();
  });
});
