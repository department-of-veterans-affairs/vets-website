import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import Vet360EditModalActionButtons from '../../components/base/EditModalActionButtons';

describe('<Vet360EditModalActionButtons/>', () => {
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
      <Vet360EditModalActionButtons {...props}>
        <p>Children</p>
      </Vet360EditModalActionButtons>,
    );

    expect(component.html(), 'renders children components').to.contain(
      'Children',
    );

    expect(component.find('.fa-trash'), 'renders delete icon').to.have.lengthOf(
      1,
    );

    expect(
      component.find('.usa-button-secondary.button-link'),
      'renders delete button',
    ).to.have.lengthOf(1);
  });

  it('renders correctly when delete triggered', () => {
    const component = enzyme.shallow(
      <Vet360EditModalActionButtons {...props}>
        <p>Children</p>
      </Vet360EditModalActionButtons>,
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
      component.find('.fa-trash'),
      'hides delete icon correctly',
    ).to.have.lengthOf(0);

    expect(
      component.find('.usa-button-secondary.button-link'),
      'hide delete button',
    ).to.have.lengthOf(0);
  });

  it('renders correctly when delete disabled', () => {
    const component = enzyme.shallow(
      <Vet360EditModalActionButtons {...props}>
        <p>Children</p>
      </Vet360EditModalActionButtons>,
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
  });
});
