import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Sinon from 'sinon';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import SectionGuideButton from '../../components/SectionGuideButton';

describe('Section guide button component', () => {
  it('renders without errors', () => {
    const screen = render(<SectionGuideButton />);
    expect(screen).to.exist;
  });
  it('check in button passes axeCheck', () => {
    axeCheck(<SectionGuideButton />);
  });
  it('should display a section guide button', () => {
    const screen = render(<SectionGuideButton />);

    const sectionGuideButton = screen.getByText('In this section', {
      exact: true,
      selector: 'span',
    });
    expect(sectionGuideButton).to.exist;
  });

  it('should call the onMenuClick function when clicked', () => {
    const onMenuClick = Sinon.spy();
    const screen = render(<SectionGuideButton onMenuClick={onMenuClick} />);

    const sectionGuideButton = screen.getByTestId('section-guide-button');
    fireEvent.click(sectionGuideButton);
    expect(onMenuClick.calledOnce).to.be.true;
  });
});
