import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import EvidencePrivateLimitation from '../../components/EvidencePrivateLimitation';
import { EVIDENCE_PRIVATE, EVIDENCE_PRIVATE_PATH } from '../../constants';
import { $, $$ } from '../../utils/ui';

const mouseClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

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

    fireEvent($('button.usa-button-primary', container), mouseClick);
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

    fireEvent($('button.usa-button-secondary', container), mouseClick);
    expect(
      goSpy.calledWith(
        `/${EVIDENCE_PRIVATE_PATH}?index=${data.providerFacility.length - 1}`,
      ),
    ).to.be.true;
  });
});
