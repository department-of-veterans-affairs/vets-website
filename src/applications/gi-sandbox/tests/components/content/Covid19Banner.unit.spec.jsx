import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Covid19Banner from '../../../components/content/Covid19Banner';

describe('<Covid19Banner>', () => {
  it('should render', () => {
    const wrapper = shallow(<Covid19Banner />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
