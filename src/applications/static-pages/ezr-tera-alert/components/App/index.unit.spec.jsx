import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { App } from '.';

describe('ezr tera alert', () => {
  it('should not render ezr tera alert to the static page when feature toggle is false', () => {
    const wrapper = shallow(<App isEzrEnabled={false} />);
    const selectors = {
      headings: wrapper.find('h2'),
      ezrAlertNotEnabled: wrapper.find('[data-testid="ezr-tera-alert"]'),
    };
    expect(selectors.ezrAlertNotEnabled).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('renders ezr tera alert to the static page when feature toggle is true', () => {
    const wrapper = shallow(<App isEzrEnabled />);
    const selectors = {
      headings: wrapper.find('h2'),
      ezrAlertEnabled: wrapper.find('[data-testid="ezr-tera-alert-enabled"]'),
    };
    expect(selectors.ezrAlertEnabled).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
