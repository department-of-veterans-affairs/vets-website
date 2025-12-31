import React from 'react';
import { expect } from 'chai';
import _ from 'lodash';
import sinon from 'sinon';
import { render, cleanup } from '@testing-library/react';
import { Main, mapStateToProps } from '../../containers/Main';

const defaultProps = {
  availability: 'available',
  enrollmentData: {},
  apiVersion: 'some-api-version',
  getEnrollmentData: () => {},
  enableSobClaimantService: false,
  children: <div>Child content</div>,
};

describe('Main', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render', () => {
    const { container } = render(<Main {...defaultProps} />);
    const appContent = container.querySelector('#appContent');
    expect(appContent).to.exist;
  });

  it('should call getEnrollmentData in componentDidMount', () => {
    const getEnrollmentDataSpy = sinon.spy();

    const props = {
      ...defaultProps,
      getEnrollmentData: getEnrollmentDataSpy,
      apiVersion: 'some-api-version',
      enableSobClaimantService: true,
    };

    render(<Main {...props} />);

    expect(getEnrollmentDataSpy.calledWith('some-api-version', true)).to.be
      .true;
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
      enableSobClaimantService: false,
    };

    expect(mapStateToProps(state)).to.deep.equal(expectedProps);
  });

  it('should show loading spinner when waiting for response', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'awaitingResponse',
    });
    const { container } = render(<Main {...props} />);
    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  it('should show system down message for backend service error', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'backendServiceError',
    });
    const { container } = render(<Main {...props} />);
    expect(container.querySelector('#genericErrorMessage')).to.exist;
  });

  it('should show backend authentication error', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'backendAuthenticationError',
    });
    const { container } = render(<Main {...props} />);
    expect(container.querySelector('#authenticationErrorMessage')).to.exist;
  });

  it('should show generic error message for service downtime', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'serviceDowntimeError',
    });
    const { container } = render(<Main {...props} />);
    expect(container.querySelector('#appContent')).to.exist;
  });

  it('should show generic error message for unknown availability', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'unknown',
    });
    const { container } = render(<Main {...props} />);
    expect(container.querySelector('#appContent')).to.exist;
  });

  it('should show the authentication warning when record not found', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'noChapter33Record',
    });
    const { container } = render(<Main {...props} />);
    expect(container.querySelector('#authenticationErrorMessage')).to.exist;
  });

  it('should show system down message when fetching enrollment data fails', () => {
    const props = _.merge({}, defaultProps, {
      availability: 'getEnrollmentDataFailure',
    });
    const { container } = render(<Main {...props} />);
    expect(container.querySelector('#genericErrorMessage')).to.exist;
  });
});
