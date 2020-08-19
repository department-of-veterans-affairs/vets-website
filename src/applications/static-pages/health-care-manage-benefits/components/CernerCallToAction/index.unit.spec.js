// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { CernerCallToAction } from '.';

describe('<CernerCallToAction>', () => {
  it('renders what we expect on its initial render', () => {
    const wrapper = shallow(<CernerCallToAction />);

    const text = wrapper.text();
    expect(text).to.include('<LoadingIndicator />');

    wrapper.unmount();
  });

  it('renders what we expect on when there is an error', () => {
    const wrapper = shallow(<CernerCallToAction />);
    wrapper.setState({ fetching: false, error: 'Some error' });

    const text = wrapper.text();
    expect(text).to.include('<AlertBox />');

    wrapper.unmount();
  });

  it('renders what we expect when it finished fetching facilities and there are none', () => {
    const wrapper = shallow(<CernerCallToAction />);
    wrapper.setState({ fetching: false });

    const text = wrapper.text();
    expect(text).to.include('<AlertBox />');

    wrapper.unmount();
  });

  it('renders what we expect when it finished fetching facilities and there are facilities', () => {
    const wrapper = shallow(<CernerCallToAction />);
    wrapper.setState({
      fetching: false,
      facilities: [
        { attributes: { name: 'Example Facility 1' } },
        { attributes: { name: 'Example Facility 2' } },
      ],
    });

    const text = wrapper.text();
    expect(text).to.include(
      'Please choose a health management portal below, depending on your provider',
    );

    wrapper.unmount();
  });
});
