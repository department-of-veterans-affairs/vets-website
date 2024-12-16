import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  CaregiverCountyDescription,
  VeteranCountyDescription,
} from '../../../../components/FormDescriptions/AddressCountyDescriptions';

describe('CG <CaregiverCountyDescription>', () => {
  it('should render `va-additional-info` component with necessary attribute(s)', () => {
    const { container } = render(<CaregiverCountyDescription />);
    const selector = container.querySelector('va-additional-info');
    expect(selector).to.exist;
    expect(selector).to.have.attr('trigger');
  });

  it('should prevent an outside blur event from executing', () => {
    const externalBlur = sinon.spy();
    const { container } = render(
      <div onBlur={externalBlur}>
        <CaregiverCountyDescription />
      </div>,
    );
    const selector = container.querySelector('va-additional-info');
    const blurEvent = new Event('blur');

    fireEvent.blur(selector, blurEvent);

    expect(externalBlur.notCalled).to.be.true;
  });
});

describe('CG <VeteranCountyDescription>', () => {
  it('should render `va-additional-info` component with necessary attribute(s)', () => {
    const { container } = render(<VeteranCountyDescription />);
    const selector = container.querySelector('va-additional-info');
    expect(selector).to.exist;
    expect(selector).to.have.attr('trigger');
  });
});
