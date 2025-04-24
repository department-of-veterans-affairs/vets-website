import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import * as reviewPage from '../../../pages/form0781/reviewPage';
import {
  reviewPageTitle,
  reviewPageDescription,
} from '../../../content/form0781/reviewPage';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../../content/form0781';

describe('Review page', () => {
  it('should define a uiSchema object', () => {
    expect(reviewPage.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(reviewPage.schema).to.be.an('object');
  });

  it('should have the correct title in uiSchema', () => {
    const { container: uiTitleContainer } = render(
      <div>{reviewPage.uiSchema['ui:title']}</div>,
    );
    const renderedUITitleText = uiTitleContainer.textContent.trim();

    const { container: titleWithTagContainer } = render(
      <div>{titleWithTag(reviewPageTitle, form0781HeadingTag)}</div>,
    );
    const expectedTitleText = titleWithTagContainer.textContent.trim();

    expect(renderedUITitleText).to.equal(expectedTitleText);
  });

  it('should have the correct description in uiSchema', () => {
    expect(reviewPage.uiSchema['ui:description']).to.equal(
      reviewPageDescription,
    );
  });

  it('should render the mental health support alert description in uiSchema', () => {
    expect(
      reviewPage.uiSchema['view:mentalHealthSupportAlert']['ui:description'],
    ).to.equal(mentalHealthSupportAlert);
  });
});
