import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import EvidencePrivateLimitation from '../../components/EvidencePrivateLimitation';
import { EVIDENCE_PRIVATE, EVIDENCE_PRIVATE_PATH } from '../../constants';

describe('<EvidencePrivateLimitation>', () => {
  it('should render', () => {
    const { container } = render(
      <div>
        <EvidencePrivateLimitation />
      </div>,
    );

    expect($('va-textarea', container)).to.exist;
    expect($('va-additional-info', container)).to.exist;
    expect($$('button', container).length).to.eq(2);
  });

  it('should submit page without error (optional textarea content)', () => {
    const goSpy = sinon.spy();
    const { container } = render(
      <div>
        <EvidencePrivateLimitation goForward={goSpy} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.true;
  });

  it('should submit with some textarea content', () => {
    const setFormDataSpy = sinon.spy();
    const data = { [EVIDENCE_PRIVATE]: true, limitedConsent: 'lorem ipsum' };
    const { container } = render(
      <div>
        <EvidencePrivateLimitation data={data} setFormData={setFormDataSpy} />
      </div>,
    );

    // Can't pass a value with event, we see an error:
    // "The given element does not have a value setter"
    fireEvent.input($('va-textarea', container));
    expect(setFormDataSpy.called).to.be.true;
  });

  it('should call goToPath to go to the last private record facility page', () => {
    const goSpy = sinon.spy();
    const data = { [EVIDENCE_PRIVATE]: true, providerFacility: [{}, {}] };
    const { container } = render(
      <div>
        <EvidencePrivateLimitation data={data} goToPath={goSpy} />
      </div>,
    );

    fireEvent.click($('button.usa-button-secondary', container));
    expect(goSpy.args[0][0]).to.eq(
      `/${EVIDENCE_PRIVATE_PATH}?index=${data.providerFacility.length - 1}`,
    );
  });

  it('should call goToPath to go to the first (empty) private record facility page', () => {
    const goSpy = sinon.spy();
    const data = { [EVIDENCE_PRIVATE]: true, providerFacility: null };
    const { container } = render(
      <div>
        <EvidencePrivateLimitation data={data} goToPath={goSpy} />
      </div>,
    );

    fireEvent.click($('button.usa-button-secondary', container));
    expect(goSpy.args[0][0]).to.eq(`/${EVIDENCE_PRIVATE_PATH}?index=0`);
  });

  it('should call goBack to go to the VA evidence page (no private evidence)', () => {
    const goSpy = sinon.spy();
    const data = { [EVIDENCE_PRIVATE]: false, providerFacility: [] };
    const { container } = render(
      <div>
        <EvidencePrivateLimitation data={data} goBack={goSpy} />
      </div>,
    );

    fireEvent.click($('button.usa-button-secondary', container));
    expect(goSpy.called).to.be.true;
  });
});
