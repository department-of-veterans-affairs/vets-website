import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import VAPServiceEditModalActionButtons from '../../components/base/VAPServiceEditModalActionButtons';

describe('<VAPServiceEditModalActionButtons/>', () => {
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
      <VAPServiceEditModalActionButtons {...props}>
        <p>Children</p>
      </VAPServiceEditModalActionButtons>,
    );

    expect(component.html(), 'renders children components').to.contain(
      'Children',
    );

    expect(component.find('va-icon'), 'renders delete icon').to.have.lengthOf(
      1,
    );

    expect(
      component.find('.usa-button-secondary.button-link'),
      'renders delete button',
    ).to.have.lengthOf(1);
    component.unmount();
  });

  it('renders correctly when delete triggered', () => {
    const component = enzyme.shallow(
      <VAPServiceEditModalActionButtons {...props}>
        <p>Children</p>
      </VAPServiceEditModalActionButtons>,
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

    expect(
      component.find('va-icon'),
      'hides delete icon correctly',
    ).to.have.lengthOf(0);

    expect(
      component.find('.usa-button-secondary.button-link'),
      'hide delete button',
    ).to.have.lengthOf(0);
    component.unmount();
  });

  it('renders correctly when delete disabled', () => {
    const component = enzyme.shallow(
      <VAPServiceEditModalActionButtons {...props}>
        <p>Children</p>
      </VAPServiceEditModalActionButtons>,
    );

    expect(component.html(), 'renders children components').to.contain(
      'Children',
    );

    component.setProps({
      deleteEnabled: false,
    });

    expect(
      component.find('.usa-button-secondary.button-link'),
      'hide delete button',
    ).to.have.lengthOf(0);
    component.unmount();
  });
});
