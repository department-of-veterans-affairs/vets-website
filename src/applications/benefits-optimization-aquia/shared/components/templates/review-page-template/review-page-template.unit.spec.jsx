import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ReviewPageTemplate } from './review-page-template';

describe('ReviewPageTemplate', () => {
  const mockEditPage = () => {};
  const mockData = {
    testSection: {
      field1: 'value1',
      field2: 'value2',
    },
  };

  it('should render with title', () => {
    const { container } = render(
      <ReviewPageTemplate
        title="Test Title"
        data={mockData}
        editPage={mockEditPage}
        sectionName="testSection"
      >
        <div>Test Content</div>
      </ReviewPageTemplate>,
    );

    expect(container.textContent).to.include('Test Title');
  });

  it('should render edit button by default', () => {
    const { container } = render(
      <ReviewPageTemplate
        title="Test Title"
        data={mockData}
        editPage={mockEditPage}
        sectionName="testSection"
      >
        <div>Test Content</div>
      </ReviewPageTemplate>,
    );

    const editButton = container.querySelector('va-button');
    expect(editButton).to.exist;
    expect(editButton.getAttribute('text')).to.equal('Edit');
  });

  it('should hide edit button when hideEditButton is true', () => {
    const { container } = render(
      <ReviewPageTemplate
        title="Test Title"
        data={mockData}
        editPage={mockEditPage}
        sectionName="testSection"
        hideEditButton
      >
        <div>Test Content</div>
      </ReviewPageTemplate>,
    );

    const editButton = container.querySelector('va-button');
    expect(editButton).to.not.exist;
  });

  it('should render children content', () => {
    const { container } = render(
      <ReviewPageTemplate
        title="Test Title"
        data={mockData}
        editPage={mockEditPage}
        sectionName="testSection"
      >
        <div>Test Content</div>
      </ReviewPageTemplate>,
    );

    expect(container.textContent).to.include('Test Content');
  });

  it('should render with custom className', () => {
    const { container } = render(
      <ReviewPageTemplate
        title="Test Title"
        data={mockData}
        editPage={mockEditPage}
        sectionName="testSection"
        className="custom-class"
      >
        <div>Test Content</div>
      </ReviewPageTemplate>,
    );

    expect(container.querySelector('.custom-class')).to.exist;
  });

  it('should extract section data when sectionName is provided', () => {
    const { container } = render(
      <ReviewPageTemplate
        title="Test Title"
        data={mockData}
        editPage={mockEditPage}
        sectionName="testSection"
      >
        {sectionData => (
          <div data-testid="section-data">{JSON.stringify(sectionData)}</div>
        )}
      </ReviewPageTemplate>,
    );

    const sectionDataElement = container.querySelector(
      '[data-testid="section-data"]',
    );
    expect(sectionDataElement.textContent).to.contain('value1');
    expect(sectionDataElement.textContent).to.contain('value2');
  });

  it('should use full data when sectionName is not provided', () => {
    const { container } = render(
      <ReviewPageTemplate
        title="Test Title"
        data={mockData}
        editPage={mockEditPage}
      >
        {data => <div data-testid="full-data">{JSON.stringify(data)}</div>}
      </ReviewPageTemplate>,
    );

    const fullDataElement = container.querySelector(
      '[data-testid="full-data"]',
    );
    expect(fullDataElement.textContent).to.contain('testSection');
  });

  it('should use custom aria label for edit button', () => {
    const { container } = render(
      <ReviewPageTemplate
        title="Test Title"
        data={mockData}
        editPage={mockEditPage}
        sectionName="testSection"
        editButtonAriaLabel="Custom Edit Label"
      >
        <div>Test Content</div>
      </ReviewPageTemplate>,
    );

    const editButton = container.querySelector('va-button');
    expect(editButton).to.exist;
    expect(editButton.getAttribute('aria-label')).to.equal('Custom Edit Label');
  });

  it('should render with dl.review structure', () => {
    const { container } = render(
      <ReviewPageTemplate
        title="Test Title"
        data={mockData}
        editPage={mockEditPage}
        sectionName="testSection"
      >
        <div>Test Content</div>
      </ReviewPageTemplate>,
    );

    expect(container.querySelector('dl.review')).to.exist;
  });
});
