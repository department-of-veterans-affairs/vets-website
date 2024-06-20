import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import IntroductionPage from '../../../containers/IntroductionPage';
import formConfig from '../../../config/form';

describe('<IntroductionPage />', () => {
  it('renders', () => {
    const wrapper = shallow(<IntroductionPage route={{ formConfig }} />);
    expect(wrapper.find('FormTitle')).to.exist;
    expect(wrapper.find('FormTitle').props().title).to.equal(
      '21P-0969 Income and Asset Statement Form',
    );
    wrapper.unmount();
  });
});
