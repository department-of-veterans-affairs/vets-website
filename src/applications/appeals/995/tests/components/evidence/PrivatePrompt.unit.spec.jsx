import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import PrivatePrompt, {
  privateRecordsPromptError,
  privateRecordsPromptTitle,
} from '../../../components/evidence/PrivatePrompt';
import {
  HAS_PRIVATE_EVIDENCE,
  HAS_VA_EVIDENCE,
  EVIDENCE_VA_DETAILS_URL,
} from '../../../constants';

describe('PrivatePrompt', () => {
  it('should render', () => {
    const { container } = render(
      <div>
        <PrivatePrompt />
      </div>,
    );

    expect($('va-radio', container)).to.exist;
    expect($$('va-button', container).length).to.eq(2);
  });

  it('should capture google analytics', () => {
    const { container } = render(
      <div>
        <PrivatePrompt setFormData={() => {}} />
      </div>,
    );

    const changeEvent = new CustomEvent('selected', {
      detail: { value: 'y' },
    });
    $('va-radio', container).__events.vaValueChange(changeEvent);

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'int-radio-button-option-click',
      'radio-button-label': privateRecordsPromptTitle,
      'radio-button-optionLabel': 'Yes',
      'radio-button-required': true,
    });
  });

  it('should submit page with error (required question)', () => {
    const goSpy = sinon.spy();
    const { container } = render(
      <div>
        <PrivatePrompt goForward={goSpy} />
      </div>,
    );

    fireEvent.click($('va-button[continue]', container));
    const radio = $('va-radio', container);
    expect(radio.getAttribute('error')).to.eq(privateRecordsPromptError);
    expect(goSpy.called).to.be.false;
  });

  it('should submit page', () => {
    const goSpy = sinon.spy();
    const data = { [HAS_PRIVATE_EVIDENCE]: true };
    const { container } = render(
      <div>
        <PrivatePrompt data={data} goForward={goSpy} />
      </div>,
    );

    fireEvent.click($('va-button[continue]', container));
    const radio = $('va-radio', container);
    expect(radio.getAttribute('error')).to.be.null;
    expect(goSpy.called).to.be.true;
  });

  it('should allow setting va-radio-option', () => {
    const setFormDataSpy = sinon.spy();
    const data = { [HAS_PRIVATE_EVIDENCE]: true };
    const changeEvent = new MouseEvent('vaValueChange', {
      detail: { value: 'n' },
    });
    const { container } = render(
      <div>
        <PrivatePrompt data={data} setFormData={setFormDataSpy} />
      </div>,
    );

    fireEvent($('va-radio', container), changeEvent);
    expect(setFormDataSpy.calledWith({ [HAS_PRIVATE_EVIDENCE]: false })).to.be
      .true;
  });

  it('should call goBack to get to the VA record request page', () => {
    const goSpy = sinon.spy();
    const data = { [HAS_VA_EVIDENCE]: false };
    const { container } = render(
      <div>
        <PrivatePrompt data={data} goBack={goSpy} />
      </div>,
    );

    fireEvent.click($('va-button[back]', container));
    expect(goSpy.called).to.be.true;
  });

  it('should call goToPath to go to the last VA record location page', () => {
    const goSpy = sinon.spy();
    const data = { [HAS_VA_EVIDENCE]: true, locations: [{}, {}] };
    const { container } = render(
      <div>
        <PrivatePrompt data={data} goToPath={goSpy} />
      </div>,
    );

    fireEvent.click($('va-button[back]', container));
    expect(
      goSpy.calledWith(
        `/${EVIDENCE_VA_DETAILS_URL}?index=${data.locations.length - 1}`,
      ),
    ).to.be.true;
  });
});
