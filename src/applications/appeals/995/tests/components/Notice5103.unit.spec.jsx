import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Notice5103 from '../../components/Notice5103';

describe('<Notice5103>', () => {
  it('should render', () => {
    const { container } = render(
      <div>
        <Notice5103 />
      </div>,
    );

    const alert = $('va-alert', container);
    const checkbox = $('va-checkbox', container);
    expect(alert).to.exist;
    expect(checkbox).to.exist;
  });

  it('should not submit page when unchecked', () => {
    const goSpy = sinon.spy();
    const { container } = render(
      <div>
        <Notice5103 goForward={goSpy} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.false;
  });

  it('should submit page when checked', () => {
    const goSpy = sinon.spy();
    const data = { form5103Acknowledged: true };
    const { container } = render(
      <div>
        <Notice5103 goForward={goSpy} data={data} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.true;
  });
});
