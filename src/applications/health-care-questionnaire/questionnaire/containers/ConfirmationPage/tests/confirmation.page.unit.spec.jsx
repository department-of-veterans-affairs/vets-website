import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ConfirmationPage from '../index';

import { createFakeConfirmationStore } from './utils';

describe('health care questionnaire - confirmation page  -', () => {
  it('displays information -- has data', () => {
    const fakeStore = createFakeConfirmationStore({ hasData: true });
    const wrapper = mount(<ConfirmationPage store={fakeStore} />);
    expect(
      wrapper.find('[data-testid="appointment-type-header"]').text(),
    ).to.equal(
      'Your provider will discuss the information on your questionnaire during your appointment:',
    );
    expect(wrapper.find('PrintButton').text()).to.equal(
      'View and print questions',
    );
    expect(
      wrapper.find('PrintButton').props().questionnaireResponseId,
    ).to.equal('questionnaire-response-test-id');

    wrapper.unmount();
  });
});
