import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import AppealHelpSidebar from '../../../components/appeals-v2/AppealHelpSidebar';

describe('<AppealHelpSidebar>', () => {
  it('should render', () => {
    const props = { aoj: 'vba' };
    const wrapper = mount(<AppealHelpSidebar {...props} />);

    expect(wrapper.find('AskVAQuestions')).to.not.be.false;
    wrapper.unmount();
  });

  it('should render the vba version', () => {
    const props = { aoj: 'vba' };
    const wrapper = mount(<AppealHelpSidebar {...props} />);

    expect(wrapper.find('AskVAQuestions').text()).to.contain(
      'Call Veterans Affairs Benefits and Services',
    );
    wrapper.unmount();
  });

  it('should render the vha version', () => {
    const props = { aoj: 'vha' };
    const wrapper = shallow(<AppealHelpSidebar {...props} />);

    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.equal('Call Health Care Benefits');
    wrapper.unmount();
  });

  it.skip('should render the nca version', () => {
    const props = { aoj: 'nca' };
    const wrapper = shallow(<AppealHelpSidebar {...props} />);

    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.equal();
    wrapper.unmount();
  });
});
