import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ReasonForVisitReview from '../ReasonForVisitReview';

describe('health care questionnaire - reason for visit - review -', () => {
  it('reason for visit exists', () => {
    const wrapper = mount(
      <ReasonForVisitReview>
        <div formData={'hello'} />
      </ReasonForVisitReview>,
    );
    expect(wrapper.find('[data-testid="reason-for-visit"]').exists()).to.be
      .true;
    expect(
      wrapper.find('[data-testid="reason-for-visit"]').hasClass('review-row'),
    ).to.be.true;
    wrapper.unmount();
  });
  it('reason for visit does not exist', () => {
    const wrapper = mount(
      <ReasonForVisitReview>
        <div formData={''} />
      </ReasonForVisitReview>,
    );
    expect(wrapper.find('[data-testid="reason-for-visit"]').exists()).to.be
      .false;
    wrapper.unmount();
  });
});
