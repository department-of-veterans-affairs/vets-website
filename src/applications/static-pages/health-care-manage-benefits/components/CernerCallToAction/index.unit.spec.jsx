import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import widgetTypes from 'platform/site-wide/widgetTypes';
import { CernerCallToAction } from '.';

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

  it('should render new layout when feature flag is true and widget type is schedule_view_va_appointments_page', () => {
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

  it('should not render new layout when feature flag is false and widget type is schedule_view_va_appointments_page', () => {
    const wrapper = shallow(
      <CernerCallToAction
        featureStaticLandingPage={false}
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
    expect(text).to.include(
      'Your VA health care team may be using our My VA Health portal',
    );

    wrapper.unmount();
  });

  it('should not render new layout when feature flag is true and widget type is refill_track_prescriptions_page', () => {
    const wrapper = shallow(
      <CernerCallToAction
        featureStaticLandingPage
        widgetType={widgetTypes.REFILL_TRACK_PRESCRIPTIONS_PAGE}
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
    expect(text).to.include(
      'Your VA health care team may be using our My VA Health portal',
    );

    wrapper.unmount();
  });

  it('should not render new layout when feature flag is true and widget type is secure_messaging_page', () => {
    const wrapper = shallow(
      <CernerCallToAction
        featureStaticLandingPage
        widgetType={widgetTypes.SECURE_MESSAGING_PAGE}
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
    expect(text).to.include(
      'Your VA health care team may be using our My VA Health portal',
    );

    wrapper.unmount();
  });

  it('should not render new layout when feature flag is true and widget type is get_medical_records_page', () => {
    const wrapper = shallow(
      <CernerCallToAction
        featureStaticLandingPage
        widgetType={widgetTypes.GET_MEDICAL_RECORDS_PAGE}
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
    expect(text).to.include(
      'Your VA health care team may be using our My VA Health portal',
    );

    wrapper.unmount();
  });

  it('should not render new layout when feature flag is true and widget type is view_test_and_lab_results_page', () => {
    const wrapper = shallow(
      <CernerCallToAction
        featureStaticLandingPage
        widgetType={widgetTypes.VIEW_TEST_AND_LAB_RESULTS_PAGE}
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
    expect(text).to.include(
      'Your VA health care team may be using our My VA Health portal',
    );

    wrapper.unmount();
  });
});
