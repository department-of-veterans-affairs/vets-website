// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { CernerCallToAction } from '.';
import widgetTypes from '../../../widgetTypes';

describe('<CernerCallToAction>', () => {
  it('renders what we expect on its initial render', () => {
    const wrapper = shallow(<CernerCallToAction />);

    expect(
      wrapper.contains(
        <va-loading-indicator message="Loading your information..." />,
      ),
    ).to.equal(true);

    wrapper.unmount();
  });

  it('renders what we expect on when there is an error', () => {
    const wrapper = shallow(<CernerCallToAction />);
    wrapper.setState({ fetching: false, error: 'Some error' });

    const text = wrapper.text();
    expect(text).to.include('Something went wrong');

    wrapper.unmount();
  });

  it('renders what we expect when it finished fetching facilities and there are none', () => {
    const wrapper = shallow(<CernerCallToAction />);
    wrapper.setState({ fetching: false });

    const text = wrapper.text();
    expect(text).to.include('Something went wrong');

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
      'Choose a health management portal, depending on your provider',
    );

    wrapper.unmount();
  });

  it('renders what we expect when it finished fetching facilities and there are facilities and feature flag is set', () => {
    const wrapper = shallow(
      <CernerCallToAction
        featureStaticLandingPage
        widgetType={widgetTypes.SCHEDULE_VIEW_VA_APPOINTMENTS_PAGE}
      />,
    );
    wrapper.setState({
      fetching: false,
      facilities: [
        { attributes: { name: 'Example Facility 1' } },
        { attributes: { name: 'Example Facility 2' } },
      ],
    });

    const text = wrapper.text();
    expect(text).to.include('Choose the right health portal');

    wrapper.unmount();
  });
});
