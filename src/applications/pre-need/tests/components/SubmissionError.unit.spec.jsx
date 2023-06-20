// libs
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import SubmissionError from 'applications/pre-need/components/SubmissionError';

describe('SubmissionError component', () => {
  it('should render', () => {
    const tree = render(<SubmissionError />);

    expect(tree.getByText('Please mail it to the NCA Intake Center')).to.not.be
      .null;

    tree.unmount();
  });
});
