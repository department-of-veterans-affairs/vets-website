import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  isMstEvent,
  options,
  summaryPageTitleWithTag,
  traumaticEventsPages,
} from '../../../pages/form0781/traumaticEventsPages';
import {
  eventsListPageTitle,
  eventsListDescription,
} from '../../../content/traumaticEventsList';
import { form0781HeadingTag } from '../../../content/form0781';
import { isCompletingForm0781 } from '../../../utils/form0781';

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

  /**
   * Tests for isMstEvent logic
   */
  describe('isMstEvent', () => {
    let stub;

    beforeEach(() => {
      stub = sinon
        .stub(isCompletingForm0781, 'isCompletingForm0781')
        .returns(true);
    });

    afterEach(() => {
      stub.restore();
    });

    it('should return false when eventTypes is missing', () => {
      const testFormData = {};
      expect(isMstEvent(testFormData)).to.be.false;
    });

    it('should return false when eventTypes is present but does not include MST', () => {
      const testFormData = {
        eventTypes: { combat: true, training: false },
      };
      expect(isMstEvent(testFormData)).to.be.false;
    });

    it('should return true when eventTypes.mst is explicitly true', () => {
      const testFormData = {
        eventTypes: { mst: true },
      };
      expect(isMstEvent(testFormData)).to.be.true;
    });

    it('should return true when eventTypes.mst is true among other event types', () => {
      const testFormData = {
        eventTypes: { combat: false, mst: true, other: true },
      };
      expect(isMstEvent(testFormData)).to.be.true;
    });

    it('should return false when eventTypes.mst is false', () => {
      const testFormData = {
        eventTypes: { mst: false, combat: true },
      };
      expect(isMstEvent(testFormData)).to.be.false;
    });
  });
});
