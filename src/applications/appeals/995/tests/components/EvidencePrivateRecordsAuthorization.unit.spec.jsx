import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import EvidencePrivateRecordsAuthorization from '../../components/EvidencePrivateRecordsAuthorization';

describe('<EvidencePrivateRecordsAuthorization>', () => {
  it('should render', () => {
    const { container } = render(
      <div>
        <EvidencePrivateRecordsAuthorization />
      </div>,
    );

    const alert = $('va-alert', container);
    const checkbox = $('va-checkbox', container);
    expect(alert).to.exist;
    expect(alert.getAttribute('visible')).to.eq('false');
    expect(checkbox).to.exist;
  });

  it('should not submit page & show alert error when unchecked', () => {
    const goSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { container } = render(
      <div>
        <EvidencePrivateRecordsAuthorization
          goForward={goSpy}
          setFormData={setFormDataSpy}
        />
      </div>,
    );

    $('#privacy-agreement', container).__events.vaChange({
      target: { checked: false },
    });

    fireEvent.click($('button.usa-button-primary', container));
    fireEvent.submit($('form', container)); // testing prevent default on form

    // testing onAnchorClick callback - scrolls to & focus on alert
    fireEvent.click($('#checkbox-anchor', container));

    const alert = $('va-alert[visible="true"]', container);
    expect(alert).to.exist;
    expect(goSpy.called).to.be.false;
  });

  it('should update data & submit page when checked', async () => {
    const goSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = { privacyAgreementAccepted: true };
    const { container, rerender } = render(
      <div>
        <EvidencePrivateRecordsAuthorization
          goForward={goSpy}
          data={{}}
          setFormData={setFormDataSpy}
        />
      </div>,
    );

    $('#privacy-agreement', container).__events.vaChange({
      target: { checked: true },
    });

    rerender(
      <div>
        <EvidencePrivateRecordsAuthorization
          goForward={goSpy}
          data={data}
          setFormData={setFormDataSpy}
        />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));

    await waitFor(() => {
      expect($('va-alert[visible="false"]', container)).to.exist;
      expect(goSpy.called).to.be.true;
    });
  });

  it('should submit page when checked', () => {
    const goSpy = sinon.spy();
    const data = {
      privacyAgreementAccepted: true,
    };
    const { container } = render(
      <div>
        <EvidencePrivateRecordsAuthorization goForward={goSpy} data={data} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect($('va-alert[visible="false"]', container)).to.exist;
    expect(goSpy.called).to.be.true;
  });
});
