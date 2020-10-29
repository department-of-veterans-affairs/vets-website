import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import VAPEditModalActionButtons from 'applications/personalization/profile/components/personal-information/VAPEditModalActionButtons';

describe('<VAPEditModalActionButtons/>', () => {
  let props = null;

  beforeEach(() => {
    props = {
      transactionRequest: {},
      onCancel() {},
      onDelete() {},
      title: 'TITLE_ATTRIBUTE',
      deleteEnabled: true,
    };
  });

  it('renders correctly when delete enabled', () => {
    const component = enzyme.shallow(
      <VAPEditModalActionButtons {...props}>
        <p>Children</p>
      </VAPEditModalActionButtons>,
    );

    expect(component.html(), 'renders children components').to.contain(
      'Children',
    );

    expect(component.html(), 'renders a delete button').to.contain(
      'Remove title_attribute',
    );

    component.unmount();
  });

  it('renders correctly when delete triggered', () => {
    const component = enzyme.shallow(
      <VAPEditModalActionButtons {...props}>
        <p>Children</p>
      </VAPEditModalActionButtons>,
    );

    component.setState({
      deleteInitiated: true,
    });

    expect(component.html(), 'renders alert contents').to.contain(
      'Are you sure?',
    );

    expect(
      component.html(),
      'does not render children components after triggered',
    ).to.not.contain('Children');

    expect(component.html(), 'does not render a delete button').not.to.contain(
      'Remove title_attribute',
    );
    component.unmount();
  });

  it('renders correctly when delete disabled', () => {
    const component = enzyme.shallow(
      <VAPEditModalActionButtons {...props}>
        <p>Children</p>
      </VAPEditModalActionButtons>,
    );

    expect(component.html(), 'renders children components').to.contain(
      'Children',
    );

    component.setProps({
      deleteEnabled: false,
    });

    expect(component.html(), 'does not render a delete button').not.to.contain(
      'Remove title_attribute',
    );
    component.unmount();
  });
});
