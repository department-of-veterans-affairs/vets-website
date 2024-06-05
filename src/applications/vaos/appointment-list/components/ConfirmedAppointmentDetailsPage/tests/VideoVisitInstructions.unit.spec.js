import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { VideoVisitInstructions } from '../VideoVisitInstructions';

describe('VAOS Component: VideoVisitInstructions', () => {
  it('renders instructions for medication review', () => {
    const instructionsType = 'Medication Review';
    const props = { instructionsType };
    const wrapper = render(<VideoVisitInstructions {...props} />);
    expect(wrapper.queryByText('Medication review')).to.exist;
  });
  it('renders instructions for Video Visit Preparation', () => {
    const instructionsType = 'Video Visit Preparation';
    const props = { instructionsType };
    const wrapper = render(<VideoVisitInstructions {...props} />);

    expect(wrapper.queryByText('VA Video Connect iOS app')).to.exist;
  });
  it('returns null if no instructionType is set', () => {
    const instructionsType = null;
    const props = { instructionsType };
    const wrapper = render(<VideoVisitInstructions {...props} />);
    expect(wrapper.queryByText('VA Video Connect iOS app')).to.not.exist;
    expect(wrapper.queryByText('Medication review')).to.not.exist;
  });
});
