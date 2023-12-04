import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ReapplyFAQs from '../../../../../../components/IntroductionPage/EnrollmentStatus/ContentBlocks/ReapplyFAQs';

describe('hca <reapplyBlock1>', () => {
  const { reapplyBlock1 } = ReapplyFAQs;
  it('should render', () => {
    const { container } = render(<reapplyBlock1 />);
    expect(container).to.not.be.empty;
  });
});

describe('hca <reapplyBlock2>', () => {
  const { reapplyBlock2 } = ReapplyFAQs;
  it('should render', () => {
    const { container } = render(<reapplyBlock2 />);
    expect(container).to.not.be.empty;
  });
});

describe('hca <reapplyBlock3>', () => {
  const { reapplyBlock3 } = ReapplyFAQs;
  it('should render', () => {
    const { container } = render(<reapplyBlock3 />);
    expect(container).to.not.be.empty;
  });
});

describe('hca <reapplyBlock4>', () => {
  const { reapplyBlock4 } = ReapplyFAQs;
  it('should render', () => {
    const { container } = render(<reapplyBlock4 />);
    expect(container).to.not.be.empty;
  });
});

describe('hca <reapplyBlock5>', () => {
  const { reapplyBlock5 } = ReapplyFAQs;
  it('should render', () => {
    const { container } = render(<reapplyBlock5 />);
    expect(container).to.not.be.empty;
  });
});

describe('hca <reapplyBlock6>', () => {
  const { reapplyBlock6 } = ReapplyFAQs;
  it('should render', () => {
    const { container } = render(<reapplyBlock6 />);
    expect(container).to.not.be.empty;
  });
});
