import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import {
  CaregiverCountyDescription,
  VeteranCountyDescription,
} from '../../../../components/FormDescriptions/AddressCountyDescriptions';

describe('CG <CaregiverCountyDescription>', () => {
  let onBlur;
  const subject = () => {
    const { container } = render(
      <div onBlur={onBlur}>
        <CaregiverCountyDescription />
      </div>,
    );
    const selectors = () => ({
      vaAddtlInfo: container.querySelector('va-additional-info'),
    });
    return { selectors };
  };

  beforeEach(() => {
    onBlur = sinon.spy();
  });

  afterEach(() => {
    onBlur.resetHistory();
  });

  it('should render `va-additional-info` component', () => {
    const { selectors } = subject();
    expect(selectors().vaAddtlInfo).to.exist;
  });

  it('should prevent an outside blur event from executing', () => {
    const { selectors } = subject();
    fireEvent.blur(selectors().vaAddtlInfo, new Event('blur'));
    sinon.assert.notCalled(onBlur);
  });
});

describe('CG <VeteranCountyDescription>', () => {
  const subject = () => {
    const { container } = render(<VeteranCountyDescription />);
    const selectors = () => ({
      vaAddtlInfo: container.querySelector('va-additional-info'),
    });
    return { selectors };
  };

  it('should render `va-additional-info` component with necessary attribute(s)', () => {
    const { selectors } = subject();
    expect(selectors().vaAddtlInfo).to.exist;
  });
});
