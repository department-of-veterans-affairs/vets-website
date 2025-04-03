import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';

const defaultStore = createCommonStore();

import SearchAccordion from '../../components/SearchAccordion';

describe('<SearchAccordion/>', () => {
  it('should render', () => {
    const wrapper = shallow(
      <Provider store={defaultStore}>
        <SearchAccordion />
      </Provider>,
    );
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should toggle isExpanded state when toggle is called', () => {
    const props = {
      expanded: false,
      onClick: () => {},
    };
    const wrapper = mount(
      <Provider store={defaultStore}>
        <SearchAccordion {...props} />
      </Provider>,
    );
    wrapper.find('va-accordion-item').simulate('click');
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
    const wrapper = mount(
      <Provider store={defaultStore}>
        <SearchAccordion {...props} />
      </Provider>,
    );
    expect(props.expanded).to.be.false;
    wrapper.setProps({ expanded: false });
    expect(props.expanded).to.be.false;
    wrapper.unmount();
  });
});
