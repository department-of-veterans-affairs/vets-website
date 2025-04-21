import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  options,
  summaryPageTitleWithTag,
  traumaticEventsPages,
} from '../../../pages/form0781/traumaticEventsPages';
import {
  eventsListPageTitle,
  eventsListDescription,
} from '../../../content/traumaticEventsList';
import { form0781HeadingTag } from '../../../content/form0781';

describe('Traumatic Events Pages', () => {
  const formData = {
    events: [
      {
        details: 'Event details',
        location: 'Event location',
        timing: '2023-09-10',
        otherReports: { police: true },
        unlistedReport: 'Other report type',
      },
    ],
  };

  const { eventsList } = traumaticEventsPages;
  const { ContentBeforeButtons } = eventsList;
  const { text } = options;
  const {
    summaryTitle,
    summaryTitleWithoutItems,
    summaryDescription,
    summaryDescriptionWithoutItems,
    cardDescription,
  } = text;

  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('should define correct options metadata', () => {
    expect(options.maxItems).to.equal(20);
    expect(options.useButtonInsteadOfYesNo).to.be.true;
  });

  it('should return correct summaryTitle based on URL', () => {
    window.history.pushState({}, '', '/events-summary');
    expect(summaryTitle()).to.equal(summaryPageTitleWithTag);

    window.history.pushState({}, '', '/review-and-submit');
    expect(summaryTitle()).to.equal(eventsListPageTitle);
  });

  it('should return correct summaryDescription based on URL', () => {
    window.history.pushState({}, '', '/events-summary');

    const { container } = render(summaryDescription());
    expect(container.textContent).to.equal(
      render(eventsListDescription()).container.textContent,
    );

    window.history.pushState({}, '', '/review-and-submit');
    expect(summaryDescription()).to.equal(null);
  });

  it('should return correct summaryTitleWithoutItems', () => {
    expect(summaryTitleWithoutItems).to.equal(summaryPageTitleWithTag);
  });

  it('should return correct summaryDescriptionWithoutItems', () => {
    expect(summaryDescriptionWithoutItems).to.equal(eventsListDescription);
  });

  it('should render the correct summary title UI', () => {
    window.history.pushState({}, '', '/events-summary');
    const { container } = render(<div>{summaryTitle()}</div>);
    expect(container.textContent.trim()).to.equal(
      `${form0781HeadingTag} ${eventsListPageTitle}`,
    );
  });

  it('should return the correct card item name', () => {
    const index = 0;
    const event = formData.events[index];
    const itemName = text.getItemName(event, index);

    expect(itemName).to.equal('Event #1');
  });

  it('should render the card description with event details', () => {
    const index = 0;
    const event = formData.events[index];
    const { container } = render(cardDescription(event));
    const renderedCard = container.textContent;

    expect(renderedCard).to.include('Description: Event details');
    expect(renderedCard).to.include('Location: Event location');
    expect(renderedCard).to.include('Date: 2023-09-10');
    expect(renderedCard).to.include(
      'Official Report: Police report; Other report type',
    );
  });

  it('should render mentalHealthSupportAlert in ContentBeforeButtons', () => {
    const { container } = render(<div>{ContentBeforeButtons}</div>);
    const { textContent } = container;
    const expectedText =
      'We understand that some of the questions may be difficult to answer.';

    expect(textContent).to.include(expectedText);
  });
});
