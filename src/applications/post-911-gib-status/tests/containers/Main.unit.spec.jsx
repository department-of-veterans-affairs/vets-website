import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Main, mapStateToProps } from '../../containers/Main';

const defaultProps = {
  availability: 'available',
  enrollmentData: {},
};

describe('Main', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Main {...defaultProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should call getEnrollmentData in componentDidMount', () => {
    const props = {
      getEnrollmentData: sinon.spy(),
      apiVersion: 'some-api-version',
    };
    const wrapper = mount(<Main {...props} />);
    wrapper.instance().componentDidMount();
    expect(props.getEnrollmentData.calledWith(props.apiVersion)).to.be.true;
    wrapper.unmount();
  });

  it('should correctly map enrollmentData and availability from state', () => {
    const state = {
      post911GIBStatus: {
        enrollmentData: { firstName: 'Joe', lastName: 'Doe' },
        availability: 'available',
      },
    };

    const expectedProps = {
      enrollmentData: { firstName: 'Joe', lastName: 'Doe' },
      availability: 'available',
    };

    expect(mapStateToProps(state)).to.deep.equal(expectedProps);
  });

  it('should show loading spinner when waiting for response', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'awaitingResponse',
    });
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    expect(tree.subTree('va-loading-indicator')).to.be.ok;
  });

  it('should show system down message for backend service error', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'backendServiceError',
    });
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    expect(tree.subTree('#genericErrorMessage')).to.be.ok;
  });

  it('should show backend authentication error', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'backendAuthenticationError',
    });
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    expect(tree.subTree('#authenticationErrorMessage')).to.be.ok;
  });
  it('should show generic error message for service downtime', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'serviceDowntimeError',
    });
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    expect(tree.subTree('#appContent')).to.be.ok;
  });

  it('should show generic error message for unknown availability', () => {
    const props = _.merge({}, defaultProps, { availability: 'unknown' });
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    expect(tree.subTree('#appContent')).to.be.ok;
  });

  /*
    Temporarily switch out record not found and replace with System Down
    See: https://github.com/department-of-veterans-affairs/vets.gov-team/issues/7677
  */
  // it('should show record not found warning', () => {
  //   const props = _.merge({}, defaultProps, { availability: 'noChapter33Record' });
  //   const tree = SkinDeep.shallowRender(<Main {...props}/>);
  //   expect(tree.subTree('#noChapter33Benefits')).to.be.ok;
  // });

  it('should show the authentication warning when record not found', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'noChapter33Record',
    });
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    expect(tree.subTree('#authenticationErrorMessage')).to.be.ok;
  });

  it('should show system down message when fetching enrollment data fails', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'getEnrollmentDataFailure',
    });
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    expect(tree.subTree('#genericErrorMessage')).to.be.ok;
  });
});
