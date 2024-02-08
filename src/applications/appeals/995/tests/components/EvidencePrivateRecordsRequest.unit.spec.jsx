import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import EvidencePrivateRecordsRequest from '../../components/EvidencePrivateRecordsRequest';
import { privateRecordsRequestTitle } from '../../content/evidencePrivateRecordsRequest';
import {
  errorMessages,
  EVIDENCE_PRIVATE,
  EVIDENCE_VA,
  EVIDENCE_VA_PATH,
} from '../../constants';

describe('<EvidencePrivateRecordsRequest>', () => {
  it('should render', () => {
    const { container } = render(
      <div>
        <EvidencePrivateRecordsRequest />
      </div>,
    );

    expect($('va-radio', container)).to.exist;
    expect($('va-additional-info', container)).to.exist;
    expect($$('button', container).length).to.eq(2);
  });

  it('should capture google analytics', () => {
    const { container } = render(
      <div>
        <EvidencePrivateRecordsRequest setFormData={() => {}} />
      </div>,
    );

    const changeEvent = new CustomEvent('selected', {
      detail: { value: 'y' },
    });
    $('va-radio', container).__events.vaValueChange(changeEvent);

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'int-radio-button-option-click',
      'radio-button-label': privateRecordsRequestTitle,
      'radio-button-optionLabel': 'Yes',
      'radio-button-required': true,
    });
  });

  it('should submit page with error (required question)', () => {
    const goSpy = sinon.spy();
    const { container } = render(
      <div>
        <EvidencePrivateRecordsRequest goForward={goSpy} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    const radio = $('va-radio', container);
    expect(radio.getAttribute('error')).to.eq(errorMessages.requiredYesNo);
    expect(goSpy.called).to.be.false;
  });

  it('should submit page', () => {
    const goSpy = sinon.spy();
    const data = { [EVIDENCE_PRIVATE]: true };
    const { container } = render(
      <div>
        <EvidencePrivateRecordsRequest data={data} goForward={goSpy} />
      </div>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    const radio = $('va-radio', container);
    expect(radio.getAttribute('error')).to.be.null;
    expect(goSpy.called).to.be.true;
  });

  it('should allow setting va-radio-option', () => {
    const setFormDataSpy = sinon.spy();
    const data = { [EVIDENCE_PRIVATE]: true };
    const changeEvent = new MouseEvent('vaValueChange', {
      detail: { value: 'n' },
    });
    const { container } = render(
      <div>
        <EvidencePrivateRecordsRequest
          data={data}
          setFormData={setFormDataSpy}
        />
      </div>,
    );

    fireEvent($('va-radio', container), changeEvent);
    expect(setFormDataSpy.calledWith({ [EVIDENCE_PRIVATE]: false })).to.be.true;
  });

  it('should call goBack to get to the VA record request page', () => {
    const goSpy = sinon.spy();
    const data = { [EVIDENCE_VA]: false };
    const { container } = render(
      <div>
        <EvidencePrivateRecordsRequest data={data} goBack={goSpy} />
      </div>,
    );

    fireEvent.click($('button.usa-button-secondary', container));
    expect(goSpy.called).to.be.true;
  });

  it('should call goToPath to go to the last VA record location page', () => {
    const goSpy = sinon.spy();
    const data = { [EVIDENCE_VA]: true, locations: [{}, {}] };
    const { container } = render(
      <div>
        <EvidencePrivateRecordsRequest data={data} goToPath={goSpy} />
      </div>,
    );

    fireEvent.click($('button.usa-button-secondary', container));
    expect(
      goSpy.calledWith(
        `/${EVIDENCE_VA_PATH}?index=${data.locations.length - 1}`,
      ),
    ).to.be.true;
  });
});
