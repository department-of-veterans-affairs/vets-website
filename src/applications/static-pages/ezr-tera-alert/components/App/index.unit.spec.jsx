import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { App } from '.';

describe('ezr submission options', () => {
  it('should not render link to the online form when feature toggle is false', () => {
    const wrapper = shallow(<App isEzrEnabled={false} />);
    const selectors = {
      headings: wrapper.find('h2'),
      link: wrapper.find('.vads-c-action-link--green'),
      alertNoAuth: wrapper.find('[data-testid="ezr-tera-alert-noauth"]'),
    };
    expect(selectors.headings).to.have.lengthOf(1);
    expect(selectors.link).to.have.lengthOf(0);
    expect(selectors.alertNoAuth).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('renders link to the online form when feature toggle is true', () => {
    const wrapper = shallow(<App isEzrEnabled />);
    const selectors = {
      headings: wrapper.find('h2'),
      link: wrapper.find('.vads-c-action-link--green'),
      alertAuth: wrapper.find('[data-testid="ezr-tera-alert-auth"]'),
    };
    expect(selectors.headings).to.have.lengthOf(1);
    expect(selectors.link).to.have.lengthOf(1);
    expect(selectors.alertAuth).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
