import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { App } from '../components/App';

describe('Dependents Verification Widget <App>', () => {
  it('renders the dependents verification widget app', () => {
    const wrapper = shallow(<App formEnabled />);
    expect(wrapper.find('.dependents-verification-widget').exists()).to.equal(
      true,
    );
    expect(wrapper.text()).to.include(
      'You can submit this form in 1 of these 2 ways:',
    );
    wrapper.unmount();
  });

  it('shows both online and mail options when form is enabled', () => {
    const wrapper = shallow(<App formEnabled />);

    // Check for both options
    expect(wrapper.text()).to.include('Option 1: Verify online');
    expect(wrapper.text()).to.include(
      'Option 2: Mail us the verification form',
    );

    // Check for online verification link
    expect(wrapper.find('va-link-action').exists()).to.equal(true);
    expect(wrapper.find('va-link-action').prop('text')).to.equal(
      'Verify your dependents on your disability benefits',
    );

    // Check for form download link
    expect(wrapper.find('va-link').exists()).to.equal(true);
    expect(wrapper.find('va-link').prop('text')).to.equal(
      'Get VA Form 21-0538 to download',
    );

    wrapper.unmount();
  });

  it('shows only mail option when form is disabled', () => {
    const wrapper = shallow(<App formEnabled={false} />);

    // Check that it shows mail-only content
    expect(wrapper.text()).to.include('You can submit this form by mail.');
    expect(wrapper.text()).to.not.include('Option 1: Verify online');
    expect(wrapper.text()).to.not.include(
      'Option 2: Mail us the verification form',
    );

    // Should not have online verification link
    expect(wrapper.find('va-link-action').exists()).to.equal(false);

    // Should still have form download link
    expect(wrapper.find('va-link').exists()).to.equal(true);
    expect(wrapper.find('va-link').prop('text')).to.equal(
      'Get VA Form 21-0538 to download',
    );

    wrapper.unmount();
  });

  it('displays correct mailing address in both states', () => {
    const expectedAddress = 'Department of Veterans Affairs';

    // Test enabled state
    const wrapperEnabled = shallow(<App formEnabled />);
    expect(wrapperEnabled.text()).to.include(expectedAddress);
    expect(wrapperEnabled.text()).to.include('PO Box 4444');
    expect(wrapperEnabled.text()).to.include('Janesville, WI 53547-4444');
    wrapperEnabled.unmount();

    // Test disabled state
    const wrapperDisabled = shallow(<App formEnabled={false} />);
    expect(wrapperDisabled.text()).to.include(expectedAddress);
    expect(wrapperDisabled.text()).to.include('PO Box 4444');
    expect(wrapperDisabled.text()).to.include('Janesville, WI 53547-4444');
    wrapperDisabled.unmount();
  });

  it('has correct form download link URL', () => {
    const wrapper = shallow(<App formEnabled />);
    expect(wrapper.find('va-link').prop('href')).to.equal(
      '/find-forms/about-form-21-0538/',
    );
    wrapper.unmount();
  });
});
