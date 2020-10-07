import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import App from './App';
import MultiQuestionForm from '../components/MultiQuestionForm';

describe('coronavirus-screener', () => {
  let mockParams = {};

  beforeEach(() => {
    mockParams = {};
  });

  describe('App', () => {
    it('outputs introduction text', () => {
      const wrapper = shallow(<App params={mockParams} />);
      expect(wrapper.hasClass('covid-screener')).to.equal(true);
      expect(wrapper.find('h1').text()).to.equal('COVID-19 screening tool');
      wrapper.unmount();
    });

    it('passes id param only if it exists', () => {
      const wrapper = shallow(<App params={mockParams} />);
      expect(wrapper.find(MultiQuestionForm).prop('customId')).to.be.undefined;
      wrapper.unmount();
    });

    it('uppercases id param', () => {
      mockParams.id = 'abc';
      const wrapper = shallow(<App params={mockParams} />);
      expect(wrapper.find(MultiQuestionForm).prop('customId')).to.equal('ABC');
      wrapper.unmount();
    });
  });
});
