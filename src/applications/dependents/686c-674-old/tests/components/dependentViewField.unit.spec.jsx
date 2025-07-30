import { shallow } from 'enzyme';
import { expect } from 'chai';
import React from 'react';
import DependentViewField from '../../components/DependentViewField';

describe('Dependent View Field', () => {
  it('should render with all data', () => {
    const props = {
      formData: {
        fullName: {
          first: 'first',
          middle: 'middle',
          last: 'last',
          suffix: 'suffix',
        },
      },
    };
    const component = shallow(<DependentViewField {...props} />);
    expect(component.text()).to.eql('first middle last, suffix');
    component.unmount();
  });

  it('should render with no middle', () => {
    const props = {
      formData: {
        fullName: {
          first: 'first',
          last: 'last',
          suffix: 'suffix',
        },
      },
    };
    const component = shallow(<DependentViewField {...props} />);
    expect(component.text()).to.eql('first last, suffix');
    component.unmount();
  });

  it('should render with no suffix', () => {
    const props = {
      formData: {
        fullName: {
          first: 'first',
          middle: 'middle',
          last: 'last',
        },
      },
    };
    const component = shallow(<DependentViewField {...props} />);
    expect(component.text()).to.eql('first middle last');
    component.unmount();
  });
});
