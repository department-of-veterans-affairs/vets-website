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
    const setFormDataSpy = sinon.spy();
    const { container } = render(
      <div>
        <Notice5103 goForward={goSpy} setFormData={setFormDataSpy} />
      </div>,
    );

    $('va-checkbox', container).__events.vaChange({
      detail: { checked: false },
    });

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.false;
  });

  it('should submit page when checked', () => {
    const goSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = { form5103Acknowledged: true };
    const { container, rerender } = render(
      <div>
        <Notice5103 goForward={goSpy} data={{}} setFormData={setFormDataSpy} />
      </div>,
    );

    $('va-checkbox', container).__events.vaChange({
      detail: { checked: true },
    });

    rerender(
      <div>
        <Notice5103
          goForward={goSpy}
          data={data}
          setFormData={setFormDataSpy}
        />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.true;
  });

  it('should update page', () => {
    const updateSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = { form5103Acknowledged: true };
    const { container } = render(
      <div>
        <Notice5103
          updatePage={updateSpy}
          data={data}
          setFormData={setFormDataSpy}
          onReviewPage
        />
      </div>,
    );

    fireEvent.click($(`va-button`, container));
    expect(updateSpy.called).to.be.true;
  });
});
