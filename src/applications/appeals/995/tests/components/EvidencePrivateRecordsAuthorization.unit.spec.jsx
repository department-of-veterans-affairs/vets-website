import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
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
    expect(alert.getAttribute('tabindex')).to.eq('-1');
    expect(checkbox).to.exist;
    expect(checkbox.getAttribute('tabindex')).to.eq('0');
  });

  it('should not submit page & show alert error when unchecked', () => {
    const goSpy = sinon.spy();
    const { container } = render(
      <div>
        <EvidencePrivateRecordsAuthorization goForward={goSpy} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    const alert = $('va-alert[visible="true"]', container);
    expect(alert).to.exist;
    expect(alert.getAttribute('tabindex')).to.eq('0');
    expect(goSpy.called).to.be.false;
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
