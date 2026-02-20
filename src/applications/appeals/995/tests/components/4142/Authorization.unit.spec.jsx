import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon-v20';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import Authorization from '../../../components/4142/Authorization';

describe('Authorization', () => {
  it('should render', () => {
    const { container } = render(<Authorization />);

    const checkbox = $('va-checkbox', container);
    expect(checkbox).to.exist;
  });

  it('should not submit page & show alert error when unchecked', () => {
    const goSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { container } = render(
      <Authorization
        goForward={goSpy}
        data={{}}
        setFormData={setFormDataSpy}
      />,
    );

    $('#privacy-agreement', container).__events.vaChange({
      target: { checked: false },
    });

    fireEvent.click($('va-button[continue]', container));
    fireEvent.submit($('form', container)); // testing prevent default on form

    // testing onAnchorClick callback - scrolls to & focus on alert
    fireEvent.click($('#checkbox-anchor', container));

    const alert = $('va-alert[status="error"]', container);
    expect(alert).to.exist;
    expect(goSpy.called).to.be.false;
  });

  it('should update data & submit page when checked', async () => {
    const goSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = { privacyAgreementAccepted: true };
    const { container, rerender } = render(
      <Authorization
        goForward={goSpy}
        data={{}}
        setFormData={setFormDataSpy}
      />,
    );

    $('#privacy-agreement', container).__events.vaChange({
      target: { checked: true },
    });

    rerender(
      <Authorization
        goForward={goSpy}
        data={data}
        setFormData={setFormDataSpy}
      />,
    );

    fireEvent.click($('va-button[continue]', container));

    await waitFor(() => {
      expect(goSpy.called).to.be.true;
    });
  });

  it('should submit page when checked', () => {
    const goSpy = sinon.spy();
    const data = {
      privacyAgreementAccepted: true,
    };
    const { container } = render(
      <Authorization goForward={goSpy} data={data} />,
    );

    fireEvent.click($('va-button[continue]', container));
    expect(goSpy.called).to.be.true;
  });

  describe('Authorization Checkbox Validation', () => {
    it('should NOT show error immediately when unchecking checkbox', () => {
      const setFormDataSpy = sinon.spy();
      const { container } = render(
        <div>
          <Authorization setFormData={setFormDataSpy} />
        </div>,
      );

      $('#privacy-agreement', container).__events.vaChange({
        target: { checked: true },
      });

      $('#privacy-agreement', container).__events.vaChange({
        target: { checked: false },
      });

      const alert = $('va-alert[status="error"]', container);
      expect(alert).to.not.exist;
    });

    it('should show error ONLY when clicking Continue without checkbox checked', () => {
      const goSpy = sinon.spy();
      const setFormDataSpy = sinon.spy();
      const { container } = render(
        <Authorization
          goForward={goSpy}
          setFormData={setFormDataSpy}
          data={{ privacyAgreementAccepted: false }}
        />,
      );

      const alert = $('va-alert[status="error"]', container);
      expect(alert).to.not.exist;

      // Click Continue button - this SHOULD trigger error
      fireEvent.click($('va-button[continue]', container));

      const errorAlert = $('va-alert[status="error"]', container);
      expect(errorAlert).to.exist;
      expect(goSpy.called).to.be.false;
    });

    it('should clear error when checkbox is checked after error is shown', () => {
      const goSpy = sinon.spy();
      const setFormDataSpy = sinon.spy();
      const { container } = render(
        <Authorization
          goForward={goSpy}
          setFormData={setFormDataSpy}
          data={{ privacyAgreementAccepted: false }}
        />,
      );

      fireEvent.click($('va-button[continue]', container));

      expect($('va-alert[status="error"]', container)).to.exist;

      $('#privacy-agreement', container).__events.vaChange({
        target: { checked: true },
      });

      expect($('va-alert[status="error"]', container)).to.not.exist;
    });

    it('should allow multiple check/uncheck cycles without showing errors', () => {
      const setFormDataSpy = sinon.spy();
      const { container } = render(
        <Authorization setFormData={setFormDataSpy} />,
      );

      $('#privacy-agreement', container).__events.vaChange({
        target: { checked: true },
      });

      $('#privacy-agreement', container).__events.vaChange({
        target: { checked: false },
      });

      $('#privacy-agreement', container).__events.vaChange({
        target: { checked: true },
      });

      $('#privacy-agreement', container).__events.vaChange({
        target: { checked: false },
      });

      const alert = $('va-alert[status="error"]', container);
      expect(alert).to.not.exist;
    });
  });
});
