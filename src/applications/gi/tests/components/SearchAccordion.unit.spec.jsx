import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import SearchAccordion from '../../components/SearchAccordion';

describe('<SearchAccordion/>', () => {
  it('should render', () => {
    const wrapper = shallow(<SearchAccordion />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should toggle isExpanded state when toggle is called', () => {
    const props = {
      expanded: false,
      onClick: () => {},
    };
    const wrapper = mount(<SearchAccordion {...props} />);
    wrapper
      .find('[data-testid="update-tuition-housing"]')
      .at(0)
      .simulate('click');
    expect(props.expanded).to.be.false;
    wrapper.unmount();
  });

  it('should rerurn children if its true', () => {
    const props = {
      expanded: true,
      onClick: () => {},
    };
    const wrapper = shallow(
      <SearchAccordion {...props}>
        <h1 className="test">Hello Testing</h1>
      </SearchAccordion>,
    );

    expect(wrapper.find('.test-child').exists()).to.equal(false);
    wrapper.unmount();
  });

  it('should update isExpanded state when expanded prop changes', () => {
    const props = {
      expanded: false,
    };
    const wrapper = mount(<SearchAccordion {...props} />);
    expect(props.expanded).to.be.false;
    wrapper.setProps({ expanded: false });
    expect(props.expanded).to.be.false;
    wrapper.unmount();
  });
});
