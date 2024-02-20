import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ListItemView from '../../../components/ListItemView';

describe('ListItemView Component', () => {
  let wrapper;

  it('renders without crashing', () => {
    wrapper = shallow(<ListItemView title="Test title" />);
    expect(wrapper.exists()).to.equal(true);
    wrapper.unmount();
  });

  it('displays the correct title', () => {
    const title = 'Software Engineer';
    wrapper = shallow(<ListItemView title={title} />);

    expect(wrapper.text()).to.equal('Software Engineer');
    wrapper.unmount();
  });

  it('handles missing title gracefully', () => {
    wrapper = shallow(<ListItemView />);

    expect(wrapper.text()).to.equal('');
    wrapper.unmount();
  });
});
