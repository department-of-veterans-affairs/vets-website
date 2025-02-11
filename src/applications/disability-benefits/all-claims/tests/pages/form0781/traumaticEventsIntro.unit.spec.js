import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import eventsIntro from '../../../pages/form0781/traumaticEventsIntro';
import {
  eventsPageTitle,
  eventsIntroDescription,
} from '../../../content/traumaticEventsIntro';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../../content/form0781';

describe('Traumatic events intro page', () => {
  it('should define a uiSchema object', () => {
    expect(eventsIntro.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(eventsIntro.schema).to.be.an('object');
  });

  it('should have the correct title in uiSchema', () => {
    const { container: uiTitleContainer } = render(
      <div>{eventsIntro.uiSchema['ui:title']}</div>,
    );
    const renderedUITitleText = uiTitleContainer.textContent.trim();

    const { container: titleWithTagContainer } = render(
      <div>{titleWithTag(eventsPageTitle, form0781HeadingTag)}</div>,
    );
    const expectedTitleText = titleWithTagContainer.textContent.trim();

    expect(renderedUITitleText).to.equal(expectedTitleText);
  });

  it('should have the correct description in uiSchema', () => {
    expect(eventsIntro.uiSchema['ui:description']).to.equal(
      eventsIntroDescription,
    );
  });

  it('should render the mental health support alert description in uiSchema', () => {
    expect(
      eventsIntro.uiSchema['view:mentalHealthSupportAlert']['ui:description'],
    ).to.equal(mentalHealthSupportAlert);
  });

  it('should have correct schema structure', () => {
    expect(eventsIntro.schema)
      .to.have.property('type')
      .that.equals('object');
    expect(eventsIntro.schema)
      .to.have.property('properties')
      .that.is.an('object');
    expect(Object.keys(eventsIntro.schema.properties)).to.have.lengthOf(1);
    expect(eventsIntro.schema.properties).to.have.property(
      'view:mentalHealthSupportAlert',
    );
  });

  it('should not have additional properties in schema', () => {
    const properties = Object.keys(eventsIntro.schema.properties);
    expect(properties).to.have.lengthOf(1);
  });
});
