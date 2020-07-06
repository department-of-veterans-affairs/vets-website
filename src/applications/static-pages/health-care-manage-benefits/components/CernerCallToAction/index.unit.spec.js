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
      "According to our records, you are registered at a clinic within Example Facility 1, Example Facility 2. VA providers at this facility and its clinics are using the new My VA Health portal.You may need to sign in again to view your VA lab and test results. If you do, please sign in with the same account you used to sign in here on VA.gov. You also may need to disable your browser's pop-up blocker so that  tools are able to open.",
    );

    wrapper.unmount();
  });
});
