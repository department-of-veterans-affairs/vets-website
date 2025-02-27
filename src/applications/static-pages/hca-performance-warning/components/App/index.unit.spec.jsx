import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { App } from '.';

describe('HCA Performance Warning <App>', () => {
  describe('when the feature toggle is falsy', () => {
    it('should not render the warning', () => {
      const wrapper = shallow(<App show={false} />);
      expect(wrapper.find('va-alert')).to.have.lengthOf(0);
      wrapper.unmount();
    });
  });

  describe('when the feature toggle is truthy', () => {
    it('should render the warning', () => {
      const wrapper = shallow(<App show />);
      expect(wrapper.find('va-alert')).to.have.lengthOf(1);
      wrapper.unmount();
    });
  });
});
