import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import OptIn from '../../components/OptIn';

describe('<OptIn>', () => {
  it('should render', () => {
    const { container } = render(
      <div>
        <OptIn />
      </div>,
    );

    const checkbox = $('va-checkbox', container);
    expect(checkbox).to.exist;
  });

  it('should submit page when unchecked', () => {
    const goSpy = sinon.spy();
    const { container } = render(
      <div>
        <OptIn goForward={goSpy} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.true;
  });

  it('should submit page when checked', () => {
    const goSpy = sinon.spy();
    const data = { socOptIn: true };
    const { container } = render(
      <div>
        <OptIn goForward={goSpy} data={data} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.true;
  });
});
