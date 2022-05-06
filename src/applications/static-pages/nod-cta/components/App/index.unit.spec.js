// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from '.';

describe('Form 10182 NOD <App>', () => {
  it('does not render link to the online form when feature toggle is false', () => {
    const wrapper = shallow(<App show={false} />);
    expect(wrapper.text()).not.includes(
      'You can request a Board Appeal online right now.',
    );
    expect(
      wrapper.find(
        `a[href="/decision-reviews/board-appeal/request-board-appeal-form-10182"]`,
      ),
    ).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('renders link to the online form when feature toggle is true', () => {
    const wrapper = shallow(<App show />);
    expect(wrapper.text()).includes(
      'You can request a Board Appeal online right now.',
    );
    expect(
      wrapper.find(
        `a[href="/decision-reviews/board-appeal/request-board-appeal-form-10182"]`,
      ),
    ).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
