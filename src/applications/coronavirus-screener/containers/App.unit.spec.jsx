import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import App from './App';

describe('coronavirus-screener', () => {
  describe('App', () => {
    const mockParams = {};
    it('outputs introduction text', () => {
      const wrapper = shallow(<App params={mockParams} />);

      expect(wrapper.hasClass('covid-screener')).to.equal(true);

      expect(wrapper.find('h1').text()).to.equal('COVID-19 screening tool');

      wrapper.unmount();
    });
  });
});
