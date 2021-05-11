import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import LoadingMessage from '../LoadingMessage';

describe('health care questionnaire list - pdf loading message', () => {
  it('renders', () => {
    const component = mount(<LoadingMessage />);
    expect(component.exists('[data-testid="loader-container"]')).to.be.true;
    component.unmount();
  });
});
