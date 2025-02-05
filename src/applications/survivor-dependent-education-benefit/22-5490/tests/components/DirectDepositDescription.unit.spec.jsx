import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DirectDepositDescription from '../../components/DirectDepositDescription';

describe('DirectDepositDescription component', () => {
  it('returns null when formContext.onReviewPage is true', () => {
    const wrapper = shallow(
      <DirectDepositDescription formContext={{ onReviewPage: true }} />,
    );
    expect(wrapper.isEmptyRender()).to.be.true;
    wrapper.unmount();
  });

  it('renders correctly when formContext.onReviewPage is false', () => {
    const wrapper = shallow(
      <DirectDepositDescription formContext={{ onReviewPage: false }} />,
    );
    expect(wrapper.text()).to.include(
      'We make payments only through direct deposit',
    );
    wrapper.unmount();
  });
});
