import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  CaregiverCountyDescription,
  VeteranCountyDescription,
} from '../../../../components/FormDescriptions/AddressCountyDescriptions';

describe('CG <CaregiverCountyDescription>', () => {
  it('should render `va-additional-info` with status of `error`', () => {
    const { container } = render(<CaregiverCountyDescription />);
    const selector = container.querySelector('va-additional-info');
    expect(selector).to.exist;
    expect(selector).to.have.attr('trigger');
  });
});

describe('CG <VeteranCountyDescription>', () => {
  it('should render `va-additional-info` comoponent', () => {
    const { container } = render(<VeteranCountyDescription />);
    const selector = container.querySelector('va-additional-info');
    expect(selector).to.exist;
    expect(selector).to.have.attr('trigger');
  });
});
