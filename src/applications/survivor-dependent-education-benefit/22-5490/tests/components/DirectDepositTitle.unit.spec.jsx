import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DirectDepositTitle from '../../components/DirectDepositTitle';

describe('DirectDepositTitle component', () => {
  it('renders the title when not on the review page', () => {
    const formContext = { onReviewPage: false };
    const title = 'Direct Deposit Information';
    const wrapper = shallow(
      <DirectDepositTitle formContext={formContext} title={title} />,
    );
    expect(wrapper.text()).to.equal(title);
    wrapper.unmount();
  });

  it('returns null when on the review page', () => {
    const formContext = { onReviewPage: true };
    const wrapper = shallow(
      <DirectDepositTitle
        formContext={formContext}
        title="Direct Deposit Information"
      />,
    );
    expect(wrapper.isEmptyRender()).to.be.true;
    wrapper.unmount();
  });

  it('returns null when formContext is not provided', () => {
    const wrapper = shallow(
      <DirectDepositTitle title="Direct Deposit Information" />,
    );
    expect(wrapper.isEmptyRender()).to.be.true;
    wrapper.unmount();
  });
});
