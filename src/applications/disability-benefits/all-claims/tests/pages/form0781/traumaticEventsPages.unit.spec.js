import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  options,
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
        reports: { police: true },
        otherReports: 'Other report type',
      },
    ],
  };

  const { eventsList } = traumaticEventsPages;
  const { ContentBeforeButtons } = eventsList;
  const { text } = options;
  const { summaryTitle, summaryDescription, cardDescription } = text;

  it('should define correct options metadata', () => {
    expect(options.maxItems).to.equal(20);
    expect(options.useButtonInsteadOfYesNo).to.be.true;

    const { container } = render(<div>{summaryTitle}</div>);
    const renderedTitle = container.textContent.trim();

    expect(renderedTitle).to.equal(
      `${form0781HeadingTag} ${eventsListPageTitle}`,
    );
    expect(summaryDescription).to.equal(eventsListDescription);
  });

  it('should return the correct card item name', () => {
    const index = 0;
    const event = formData.events[index];
    const itemName = text.getItemName(event, index);

    expect(itemName).to.equal(
      'Event #1',
      'The item name should match the format "Event #<index + 1>"',
    );
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
      'Official Report: Police report, Other report type',
    );
  });

  it('should render mentalHealthSupportAlert in ContentBeforeButtons', () => {
    const { container } = render(<div>{ContentBeforeButtons}</div>);
    const { textContent } = container;
    const expectedText =
      'We understand that some of the questions may be difficult to answer.';

    expect(textContent).to.include(expectedText);
  });

  it('should enforce maxItems limit of 20', () => {
    const MockDefinitionTester = ({ data, onSubmit }) => (
      <div>
        {data.events.map((_, index) => (
          <div key={index} data-testid="event-item">
            Event {index + 1}
          </div>
        ))}
        {data.events.length < 20 && <button>Add an event</button>}
        <button onClick={onSubmit}>Submit</button>
      </div>
    );

    const events = Array.from({ length: 20 }, () => ({}));
    const onSubmit = sinon.spy();

    const { queryByText, queryAllByTestId } = render(
      <MockDefinitionTester data={{ events }} onSubmit={onSubmit} />,
    );

    const renderedEvents = queryAllByTestId('event-item');
    expect(renderedEvents.length).to.equal(20);

    const addButton = queryByText('Add an event');
    expect(addButton).to.be.null;
  });
});
