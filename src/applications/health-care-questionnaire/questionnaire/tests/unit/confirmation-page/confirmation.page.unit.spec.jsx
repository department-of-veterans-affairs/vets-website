import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ConfirmationPage from '../../../containers/ConfirmationPage';

import { createFakeConfirmationStore } from '../utils/createFakeStores';

describe('health care questionnaire - confirmation page  -', () => {
  it('displays information -- has data', () => {
    const fakeStore = createFakeConfirmationStore({ hasData: true });
    const wrapper = mount(<ConfirmationPage store={fakeStore} />);
    expect(wrapper.find('[data-testid="veterans-full-name"]').text()).to.equal(
      'Mickey Mouse',
    );
    expect(wrapper.find('[data-testid="facility-name"]').text()).to.equal(
      'Magic Kingdom',
    );
    wrapper.unmount();
  });
  it('displays information -- no data', () => {
    const fakeStore = createFakeConfirmationStore({ hasData: false });
    const wrapper = mount(<ConfirmationPage store={fakeStore} />);
    expect(wrapper.find('[data-testid="veterans-full-name"]').exists()).to.be
      .false;
    expect(wrapper.find('[data-testid="facility-name"]').exists()).to.be.false;
    wrapper.unmount();
  });
});
