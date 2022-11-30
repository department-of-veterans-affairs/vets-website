import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import EvidencePrivateRecordsRequest from '../../components/EvidencePrivateRecordsRequest';
import {
  EVIDENCE_PRIVATE,
  EVIDENCE_VA,
  EVIDENCE_VA_PATH,
} from '../../constants';
import { $, $$ } from '../../utils/ui';

const mouseClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

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

  it('should submit page without error (optional question)', () => {
    const goSpy = sinon.spy();
    const { container } = render(
      <div>
        <EvidencePrivateRecordsRequest goForward={goSpy} />
      </div>,
    );

    fireEvent($('button.usa-button-primary', container), mouseClick);
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

    fireEvent.click($('button.usa-button-secondary', container), mouseClick);
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

    fireEvent($('button.usa-button-secondary', container), mouseClick);
    expect(
      goSpy.calledWith(
        `/${EVIDENCE_VA_PATH}?index=${data.locations.length - 1}`,
      ),
    ).to.be.true;
  });
});
