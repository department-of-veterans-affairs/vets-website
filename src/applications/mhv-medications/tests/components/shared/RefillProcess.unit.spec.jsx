import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import RefillProcess from '../../../components/shared/RefillProcess';
import { refillProcessStepGuide as refillProcessData } from '../../../util/refillProcessData';

describe('RefillProcess Component', () => {
  const setup = () => {
    return render(<RefillProcess />);
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByTestId('rx-refill-process-container')).to.exist;
  });

  it('displays the correct title', () => {
    const screen = setup();
    expect(screen.getByText('How the refill process works on VA.gov')).to.exist;
  });

  it('renders all three process steps', () => {
    const screen = setup();
    
    // Check for the process list items by their header attributes
    const processItems = screen.container.querySelectorAll('va-process-list-item');
    expect(processItems).to.have.length(3);
    
    // Verify headers are set correctly
    expect(processItems[0].getAttribute('header')).to.equal('You request a refill');
    expect(processItems[1].getAttribute('header')).to.equal('We process your refill request');
    expect(processItems[2].getAttribute('header')).to.equal('We ship your refill to you');
  });

  it('displays process step content correctly', () => {
    const screen = setup();
    
    // Check step content is present
    expect(screen.getByText(/After you request a refill/)).to.exist;
    expect(screen.getByText(/Once our pharmacy starts processing/)).to.exist;
    expect(screen.getByText(/Once we ship the prescription/)).to.exist;
    
    // Check specific status mentions
    expect(screen.getByText(/In progress/)).to.exist;
    expect(screen.getByText(/Shipped/)).to.exist;
  });

  it('uses VA design system components', () => {
    const screen = setup();
    const container = screen.getByTestId('rx-refill-process-container');
    
    // Check for va-process-list
    const processList = container.querySelector('va-process-list');
    expect(processList).to.exist;
    
    // Check for va-process-list-item components (should be 3)
    const processListItems = container.querySelectorAll('va-process-list-item');
    expect(processListItems).to.have.length(3);
  });

  it('applies correct CSS classes for styling', () => {
    const screen = setup();
    
    // Check container exists with test id
    const container = screen.getByTestId('rx-refill-process-container');
    expect(container).to.exist;
    
    // Check title has correct styling classes
    const title = screen.getByText('How the refill process works on VA.gov');
    expect(title.classList.contains('vads-u-border-bottom--2px')).to.be.true;
    expect(title.classList.contains('vads-u-border-color--primary')).to.be.true;
    expect(title.classList.contains('vads-u-line-height--5')).to.be.true;
  });

  describe('refillProcessData export', () => {
    it('exports the correct data structure', () => {
      expect(refillProcessData).to.exist;
      expect(refillProcessData.title).to.equal('How the refill process works on VA.gov');
      expect(refillProcessData.processSteps).to.have.length(3);
    });

    it('has correct process step structure', () => {
      refillProcessData.processSteps.forEach(step => {
        expect(step).to.have.property('header');
        expect(step).to.have.property('content');
        expect(typeof step.header).to.equal('string');
        expect(React.isValidElement(step.content)).to.be.true;
      });
    });
  });
});