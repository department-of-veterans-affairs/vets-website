import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import PrintErrorMessage from '../PrintErrorMessage';

describe('health care questionnaire list - error with pdf download message', () => {
  it('renders', () => {
    const component = mount(<PrintErrorMessage CallToAction={() => <></>} />);
    expect(component.exists('[data-testid="service-down-message"]')).to.be.true;
    component.unmount();
  });
  it('renders call to action', () => {
    const Action = () => (
      <>
        <span className="test"> this should render</span>
      </>
    );
    const component = mount(<PrintErrorMessage CallToAction={Action} />);
    expect(component.exists('.test')).to.be.true;
    component.unmount();
  });
});
