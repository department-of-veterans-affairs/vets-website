import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import EmptyMessage from '../../../questionnaire-list/components/Messages/EmptyMessage';

describe('health care questionnaire list - empty message', () => {
  it('displays text', () => {
    const text = 'this is a message';
    const component = mount(<EmptyMessage message={text} />);
    expect(component.exists('[data-testid="empty-message"]')).to.be.true;
    expect(component.find('[data-testid="empty-message"]>p').text()).to.equal(
      'this is a message',
    );
    component.unmount();
  });
});
