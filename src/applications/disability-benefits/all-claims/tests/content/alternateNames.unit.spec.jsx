import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import merge from 'lodash/merge';
import { AlternateNameViewField } from '../../content/alternateNames';

describe('alternateNames', () => {
  describe('AlternateNameViewField', () => {
    const defaultProps = {
      formData: {
        firstName: 'Sam',
        lastName: 'Am'
      }
    };

    it('should render', () => {
      const wrapper = shallow(<AlternateNameViewField {...defaultProps}/>);
      expect(wrapper.length).to.equal(1);
      expect(wrapper.type()).to.equal('div');
    });

    it('should render a first and last name', () => {
      const wrapper = shallow(<AlternateNameViewField {...defaultProps}/>);
      expect(wrapper.render().text()).to.contain('Sam Am');
    });

    it('should render full name with middle name when one is provided', () => {
      const middleNameData = {
        formData: {
          middleName: 'I'
        }
      };

      const props = merge({}, defaultProps, middleNameData);
      const wrapper = shallow(<AlternateNameViewField {...props}/>);
      expect(wrapper.render().text()).to.contain('Sam I Am');
    });
  });
});
