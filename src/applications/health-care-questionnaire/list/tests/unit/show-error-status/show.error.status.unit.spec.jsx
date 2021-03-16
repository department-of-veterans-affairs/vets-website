import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ShowErrorStatus from '../../../questionnaire-list/components/Messages/ShowErrorStatus';

describe('health care questionnaire list - showing the error status', () => {
  it('shows error message', () => {
    const component = mount(<ShowErrorStatus hasError />);
    expect(component.exists('ServiceDown')).to.be.true;

    component.unmount();
  });
  it('shows children', () => {
    const component = mount(
      <ShowErrorStatus>
        <p data-testid="children">Hello, There</p>
      </ShowErrorStatus>,
    );
    expect(component.exists('[data-testid="children"]')).to.be.true;

    component.unmount();
  });
});
