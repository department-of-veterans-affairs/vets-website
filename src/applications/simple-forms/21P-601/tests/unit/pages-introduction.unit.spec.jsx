import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import introduction from '../../pages/introduction';

describe('21P-601 introduction page configuration', () => {
  it('exports uiSchema and schema', () => {
    expect(introduction).to.have.property('uiSchema');
    expect(introduction).to.have.property('schema');
  });

  it('has correct schema structure', () => {
    expect(introduction.schema).to.have.property('type', 'object');
    expect(introduction.schema).to.have.property('properties');
    expect(introduction.schema.properties).to.be.an('object');
    expect(introduction.schema.properties).to.be.empty;
  });

  it('has ui:description in uiSchema', () => {
    expect(introduction.uiSchema).to.have.property('ui:description');
  });

  it('ui:description is a React component function', () => {
    expect(introduction.uiSchema['ui:description']).to.be.a('function');
  });

  it('renders IntroductionContent component', () => {
    const IntroductionContent = introduction.uiSchema['ui:description'];
    const { container } = render(<IntroductionContent />);

    expect(container).to.exist;
  });

  it('renders alert about already filed benefits', () => {
    const IntroductionContent = introduction.uiSchema['ui:description'];
    const { container } = render(<IntroductionContent />);

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
    expect(alert.getAttribute('uswds')).to.exist;
  });

  it('renders correct alert headline', () => {
    const IntroductionContent = introduction.uiSchema['ui:description'];
    const { getByText } = render(<IntroductionContent />);

    expect(getByText('Already filed for survivor benefits?')).to.exist;
  });

  it('renders warning about not completing form if already applied', () => {
    const IntroductionContent = introduction.uiSchema['ui:description'];
    const { container } = render(<IntroductionContent />);

    expect(container.textContent).to.include('Do NOT complete this form');
    expect(container.textContent).to.include('21P-534EZ');
    expect(container.textContent).to.include('21P-535');
    expect(container.textContent).to.include(
      'already include accrued benefits claims',
    );
  });

  it('renders save in progress message', () => {
    const IntroductionContent = introduction.uiSchema['ui:description'];
    const { container } = render(<IntroductionContent />);

    expect(container.textContent).to.include(
      'save this application in progress',
    );
    expect(container.textContent).to.include('come back later to finish');
  });

  it('has no required properties', () => {
    expect(introduction.schema.required).to.be.undefined;
  });

  it('renders all expected content blocks', () => {
    const IntroductionContent = introduction.uiSchema['ui:description'];
    const { container } = render(<IntroductionContent />);

    // Check for va-alert element
    const vaAlert = container.querySelector('va-alert');
    expect(vaAlert).to.exist;

    // Check for h3 slot
    const h3Element = container.querySelector('h3');
    expect(h3Element).to.exist;
    expect(h3Element.getAttribute('slot')).to.equal('headline');

    // Check for paragraph elements
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).to.be.at.least(2);
  });

  it('returns a valid React element from ui:description', () => {
    const IntroductionContent = introduction.uiSchema['ui:description'];
    const element = IntroductionContent();

    expect(React.isValidElement(element)).to.be.true;
  });

  it('has empty properties object in schema', () => {
    expect(Object.keys(introduction.schema.properties)).to.have.lengthOf(0);
  });
});
