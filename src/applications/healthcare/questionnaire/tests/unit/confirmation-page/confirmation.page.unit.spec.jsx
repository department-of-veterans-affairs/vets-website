import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ConfirmationPage from '../../../containers/ConfirmationPage';

import { createFakeConfirmationStore } from '../utils/createFakeStores';

describe('healthcare-questionnaire - confirmation page  -', () => {
  it('somethign or other???', () => {
    const fakeStore = createFakeConfirmationStore({
      reason: 'yes i have a reason',
    });
    const wrapper = mount(<ConfirmationPage store={fakeStore} />);
    expect(wrapper.find('[data-testid="reason-for-visit"]').exists()).to.be
      .true;
    wrapper.unmount();
  });
});
