import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import EnrollmentVerificationPageWrapper from '../../components/EnrollmentVerificationPageWrapper';

describe('<EnrollmentVerificationPageWrapper>', () => {
  it('renders the children and required elements', () => {
    const wrapper = shallow(
      <EnrollmentVerificationPageWrapper>
        <div>Test Child</div>
      </EnrollmentVerificationPageWrapper>,
    );

    // Check if the children are rendered
    expect(wrapper.contains(<div>Test Child</div>)).to.be.true;

    // Check if the EnrollmentVerificationBreadcrumbs is rendered
    expect(wrapper.find('EnrollmentVerificationBreadcrumbs').length).to.equal(
      1,
    );

    wrapper.unmount();
  });
});
