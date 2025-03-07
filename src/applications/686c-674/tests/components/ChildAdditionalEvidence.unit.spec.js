import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { ChildAdditionalEvidence } from '../../components/ChildAdditionalEvidence';

describe('ChildAdditionalEvidence', () => {
  const generateStore = ({ formData = {} } = {}) => ({
    dispatch: sinon.spy(),
    subscribe: sinon.spy(),
    getState: () => ({ form: { data: formData } }),
  });

  const renderComponent = (formData = {}) => {
    const mockStore = generateStore({ formData });
    return render(
      <Provider store={mockStore}>
        <ChildAdditionalEvidence />
      </Provider>,
    );
  };

  it('should render the introductory text', () => {
    const { container } = renderComponent();
    const introText = container.querySelector('p');
    expect(introText).to.not.be.null;
    expect(introText.textContent).to.include(
      'Based on your answers, you’ll need to submit supporting evidence to add this child as your dependent.',
    );
  });

  it('should render the accordion with supporting evidence details', () => {
    const { container } = renderComponent();
    const evidenceAccordion = container.querySelector('#supporting-evidence');
    expect(evidenceAccordion).to.not.be.null;
    expect(evidenceAccordion.getAttribute('header')).to.equal(
      'Supporting evidence you need to submit',
    );
  });

  it('should render birth certificate requirement if the child lives outside the USA', () => {
    const { container } = renderComponent({
      veteranContactInformation: { veteranAddress: { country: 'Canada' } },
    });
    expect(container.textContent).to.include(
      'A copy of your child’s birth certificate',
    );
  });

  it('should render birth certificate requirement if there is a stepchild', () => {
    const { container } = renderComponent({
      childrenToAdd: [{ relationshipToChild: { stepchild: true } }],
    });
    expect(container.textContent).to.include(
      'A copy of your child’s birth certificate',
    );
  });

  it('should not render birth certificate requirement if conditions are not met', () => {
    const { container } = renderComponent({
      veteranContactInformation: { veteranAddress: { country: 'USA' } },
      childrenToAdd: [{ relationshipToChild: { stepchild: false } }],
    });
    expect(container.textContent).to.not.include(
      'A copy of your child’s birth certificate',
    );
  });

  it('should render medical records requirements for a disabled child', () => {
    const { container } = renderComponent({
      childrenToAdd: [
        {
          doesChildHaveDisability: true,
          doesChildHavePermanentDisability: true,
        },
      ],
    });
    expect(container.textContent).to.include(
      'Copies of medical records that document your child’s permanent physical or mental disability',
    );
    expect(container.textContent).to.include(
      'A statement from your child’s doctor that shows the type and severity of the child’s physical or mental disability',
    );
  });

  it('should render adoption document requirements for an adopted child', () => {
    const { container } = renderComponent({
      childrenToAdd: [{ relationshipToChild: { adopted: true } }],
    });
    expect(container.textContent).to.include(
      'A copy of one of these documents:',
    );
    expect(container.textContent).to.include('The final decree of adoption');
    expect(container.textContent).to.include(
      'The adoptive placement agreement',
    );
    expect(container.textContent).to.include(
      'The interlocutory decree of adoptions',
    );
    expect(container.textContent).to.include('The revised birth certificate');
  });

  it('should render the submit your files section with online submission details', () => {
    const { container } = renderComponent();
    const submitFilesHeader = container.querySelector('h3');
    expect(submitFilesHeader).to.not.be.null;
    expect(submitFilesHeader.textContent).to.include(
      'Submit your files online',
    );
  });

  it('should render the additional info component with upload instructions', () => {
    const { container } = renderComponent();
    const uploadInstructions = container.querySelector('va-additional-info');
    expect(uploadInstructions).to.not.be.null;
    expect(uploadInstructions.getAttribute('trigger')).to.equal(
      'Document upload instructions',
    );
  });

  it('should have a correct structure for supporting evidence and upload sections', () => {
    const { container } = renderComponent();
    const accordion = container.querySelector('va-accordion');
    const uploadSection = container.querySelector('va-additional-info');
    expect(accordion).to.not.be.null;
    expect(uploadSection).to.not.be.null;
  });
});
