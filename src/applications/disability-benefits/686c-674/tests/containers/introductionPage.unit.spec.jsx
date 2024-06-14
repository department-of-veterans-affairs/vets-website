import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { IntroductionPage } from '../../containers/IntroductionPage';

function getProps(dependentsToggle, errorCode, validVaFileNumber, isLoading) {
  const errors = errorCode
    ? [
        {
          code: errorCode,
        },
      ]
    : undefined;

  return {
    vaFileNumber: {
      hasVaFileNumber: {
        errors,
        VALIDVAFILENUMBER: validVaFileNumber,
      },
      isLoading,
    },
    user: {
      login: {
        currentlyLoggedIn: true,
      },
    },
    dependentsToggle,
    route: {
      formConfig: {
        prefillEnabled: false,
        savedFormMessages: undefined,
        downtime: undefined,
        pageList: [],
      },
    },
    verifyVaFileNumber: () => {},
  };
}

describe('Introduction Page', () => {
  it('should render with undefined dependents toggle', () => {
    const props = getProps(undefined, null);
    const component = shallow(<IntroductionPage {...props} />);
    const loadingIndicators = component.find('va-loading-indicator');
    expect(loadingIndicators.length).to.eql(1);
    component.unmount();
  });

  it('should render with falsy dependents toggle', () => {
    const props = getProps(false, null);
    const component = shallow(<IntroductionPage {...props} />);
    const [subheader] = component.find('h2');
    expect(subheader.props.children).to.eql(
      'We’re still working on this feature',
    );
    component.unmount();
  });

  it('should render with server errors', () => {
    const props = getProps(true, 500);
    const component = shallow(<IntroductionPage {...props} />);
    const [alert] = component.find('h2');
    expect(alert.props.children).to.eql(
      'We’re sorry. Something went wrong on our end',
    );
    component.unmount();
  });

  it('should render with client errors', () => {
    const props = getProps(true, 400);
    const component = shallow(<IntroductionPage {...props} />);
    const [alert] = component.find('h2');
    expect(alert.props.children).to.eql(
      'Your profile is missing some required information',
    );
    component.unmount();
  });

  it('should render with missing va file number', () => {
    const props = getProps(true, 400);
    const component = shallow(<IntroductionPage {...props} />);
    const [alert] = component.find('h2');
    expect(alert.props.children).to.eql(
      'Your profile is missing some required information',
    );
    component.unmount();
  });

  it('should render with missing va file number', () => {
    const props = getProps(true, 400);
    const component = shallow(<IntroductionPage {...props} />);
    const [alert] = component.find('h2');
    expect(alert.props.children).to.eql(
      'Your profile is missing some required information',
    );
    component.unmount();
  });

  it('should render with isLoading', () => {
    const props = getProps(true, undefined, 1, true);
    const component = shallow(<IntroductionPage {...props} />);
    const loadingIndicators = component.find('va-loading-indicator');
    expect(loadingIndicators.length).to.eql(1);
    component.unmount();
  });

  it('should render without isLoading', () => {
    const props = getProps(true, undefined, 1, false);
    const component = shallow(<IntroductionPage {...props} />);
    const loadingIndicators = component.find('va-loading-indicator');
    expect(loadingIndicators.length).to.eql(0);
    component.unmount();
  });
});
