import React from 'react';
import { expect } from 'chai';

import App from '../../containers/App';
import formConfig from '../../config/form';

describe('21P-601 App', () => {
  it('renders App component', () => {
    const props = {
      location: { pathname: '/introduction' },
      children: <div>Test Child</div>,
    };

    const component = App(props);
    expect(component).to.exist;
  });

  it('uses correct form config', () => {
    expect(formConfig.formId).to.include('21P-601');
    expect(formConfig.title).to.exist;
  });

  it('has form configuration with required properties', () => {
    expect(formConfig).to.have.property('formId');
    expect(formConfig).to.have.property('chapters');
    expect(formConfig).to.have.property('title');
    expect(formConfig).to.have.property('prefillEnabled');
  });

  it('passes location prop correctly', () => {
    const location = { pathname: '/veteran-name' };
    const props = {
      location,
      children: <div>Form Content</div>,
    };

    const component = App(props);
    expect(component).to.exist;
    // Account for Toggler wrapper
    const routedApp = component.props.children[0].props.children;
    expect(routedApp.props.currentLocation).to.include(location);
  });

  it('renders with children', () => {
    const props = {
      location: { pathname: '/introduction' },
      children: <div className="test-child">Test Child Content</div>,
    };

    const component = App(props);
    expect(component).to.exist;
    expect(component.props.children[0].props.children).to.exist;
  });

  it('has correct app title in DowntimeNotification', () => {
    const props = {
      location: { pathname: '/introduction' },
      children: <div>Test</div>,
    };

    const component = App(props);
    // Account for Toggler wrapper - get Toggler.Enabled child, then RoutedSavableApp child, then DowntimeNotification
    const routedApp = component.props.children[0].props.children;
    const downtimeNotification = routedApp.props.children;
    expect(downtimeNotification.props.appTitle).to.equal(
      'Application for Accrued Amounts Due a Deceased Beneficiary',
    );
  });

  it('configures lighthouse benefits intake dependency', () => {
    const props = {
      location: { pathname: '/introduction' },
      children: <div>Test</div>,
    };

    const component = App(props);
    // Account for Toggler wrapper - get Toggler.Enabled child, then RoutedSavableApp child, then DowntimeNotification
    const routedApp = component.props.children[0].props.children;
    const downtimeNotification = routedApp.props.children;
    expect(downtimeNotification.props.dependencies).to.exist;
    expect(downtimeNotification.props.dependencies).to.be.an('array');
  });
});
