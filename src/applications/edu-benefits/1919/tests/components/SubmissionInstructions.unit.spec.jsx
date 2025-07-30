import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SubmissionInstructions from '../../components/SubmissionInstructions';

describe('<SubmissionInstructions />', () => {
  it('should render without crashing', () => {
    const { container } = render(<SubmissionInstructions />);

    expect(container).to.exist;
  });
});
