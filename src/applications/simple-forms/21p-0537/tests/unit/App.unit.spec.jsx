import React from 'react';
import { expect } from 'chai';

import App from '../../containers/App';
import formConfig from '../../config/form';

describe('21P-0537 App', () => {
  it('renders App component', () => {
    const props = {
      location: { pathname: '/introduction' },
      children: <div>Test Child</div>,
    };

    const component = App(props);
    expect(component).to.exist;
  });

  it('uses correct form config', () => {
    expect(formConfig.formId).to.include('21P-0537');
    expect(formConfig.title).to.exist;
  });

  it('has form configuration with required properties', () => {
    expect(formConfig).to.have.property('formId');
    expect(formConfig).to.have.property('chapters');
    expect(formConfig).to.have.property('title');
    expect(formConfig).to.have.property('prefillEnabled');
  });

  it('passes location prop correctly', () => {
    const location = { pathname: '/veteran-info/name' };
    const props = {
      location,
      children: <div>Form Content</div>,
    };

    const component = App(props);
    expect(component).to.exist;
    // Toggler wrapper obfuscating things - after we eventually remove
    // the feature toggle constraint this expectation could be changed to:
    // // expect(component.props.currentLocation).to.include(location);
    expect(
      component.props.children[0].props.children.props.currentLocation,
    ).to.include(location);
  });

  it('renders with children', () => {
    const props = {
      location: { pathname: '/introduction' },
      children: <div className="test-child">Test Child Content</div>,
    };

    const component = App(props);
    expect(component).to.exist;
    // Toggler wrapper obfuscating things - after we eventually remove
    // the feature toggle constraint this expectation could be changed to:
    // // expect(component.props.children.props.children).to.exist;
    expect(component.props.children[0].props.children).to.exist;
  });
});
