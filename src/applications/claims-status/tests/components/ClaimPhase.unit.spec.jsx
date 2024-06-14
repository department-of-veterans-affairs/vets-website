import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimPhase from '../../components/ClaimPhase';
import { renderWithRouter } from '../utils';

describe('<ClaimPhase>', () => {
  const activity = {
    1: [
      {
        type: 'filed',
        date: '2010-05-04',
      },
    ],
  };

  it('should render activity when on current phase', () => {
    const { container } = render(
      <ClaimPhase id="2" current={1} phase={1} activity={activity} />,
    );
    expect($('li', container)).to.exist;
    expect($('.claims-evidence', container)).to.exist;
  });

  it('should not render activity when on current phase', () => {
    const { container } = render(
      <ClaimPhase id="2" current={1} phase={3} activity={activity} />,
    );
    expect($('li', container)).to.exist;
    expect($('.claims-evidence', container)).not.to.exist;
  });

  it('should display filed message', () => {
    const { container, getByText } = render(
      <ClaimPhase id="2" current={1} phase={1} activity={activity} />,
    );
    expect($('.claims-evidence-item', container)).to.exist;
    getByText('Thank you. VA received your claim');
  });

  it('should display requested message', () => {
    const newActivity = {
      1: [
        {
          type: 'tracked_item',
          date: '2010-05-04',
          displayName: 'Needed file',
          status: 'NEEDED_FROM_YOU',
        },
      ],
    };

    const { container, getByText } = renderWithRouter(
      <ClaimPhase id="2" current={1} phase={1} activity={newActivity} />,
    );

    expect($('.claims-evidence-item', container)).to.exist;
    getByText('We added a notice for:');
    getByText(newActivity[1][0].displayName);
  });

  it('should display ’Show past updates’ button', () => {
    const newActivity = {
      1: [
        {
          type: 'tracked_item',
          date: '2010-05-04',
          displayName: 'Needed file',
          status: 'NEEDED_FROM_YOU',
        },
        {
          type: 'tracked_item',
          date: '2010-05-04',
          displayName: 'Needed file',
          status: 'NEEDED_FROM_YOU',
        },
        {
          type: 'tracked_item',
          date: '2010-05-04',
          displayName: 'Needed file',
          status: 'NEEDED_FROM_YOU',
        },
        {
          type: 'tracked_item',
          date: '2010-05-04',
          displayName: 'Needed file',
          status: 'NEEDED_FROM_YOU',
        },
        {
          type: 'tracked_item',
          date: '2010-05-04',
          displayName: 'Needed file',
          status: 'NEEDED_FROM_YOU',
        },
        {
          type: 'tracked_item',
          date: '2010-05-04',
          displayName: 'Needed file',
          status: 'NEEDED_FROM_YOU',
        },
      ],
    };

    const { getByText } = renderWithRouter(
      <ClaimPhase id="2" current={1} phase={1} activity={newActivity} />,
    );

    getByText('Show past updates');
  });

  it('should expand when the ’Show past updates’ button is clicked', async () => {
    const newActivity = {
      1: [
        {
          type: 'tracked_item',
          date: '2012-05-04',
          displayName: 'Tracked Item 3',
          status: 'NEEDED_FROM_YOU',
        },
        {
          type: 'tracked_item',
          date: '2011-05-04',
          displayName: 'Tracked Item 2',
          status: 'NEEDED_FROM_YOU',
        },
        {
          type: 'tracked_item',
          date: '2010-05-04',
          displayName: 'Tracked Item 1',
          status: 'NEEDED_FROM_YOU',
        },
      ],
    };

    const { container, getByText } = renderWithRouter(
      <ClaimPhase id="2" current={1} phase={1} activity={newActivity} />,
    );

    getByText('Show past updates');
    fireEvent.click($('.claim-older-updates', container));

    // Check that the past events are showing
    await waitFor(() => {
      getByText('Tracked Item 2');
      getByText('Hide past updates');
    });
  });

  it('should show/hide past events when button is clicked', async () => {
    const newActivity = {
      1: [
        {
          type: 'tracked_item',
          date: '2012-05-04',
          displayName: 'Tracked Item 3',
          status: 'NEEDED_FROM_YOU',
        },
        {
          type: 'tracked_item',
          date: '2011-05-04',
          displayName: 'Tracked Item 2',
          status: 'NEEDED_FROM_YOU',
        },
        {
          type: 'tracked_item',
          date: '2010-05-04',
          displayName: 'Tracked Item 1',
          status: 'NEEDED_FROM_YOU',
        },
      ],
    };

    const { container, getByText, queryByText } = renderWithRouter(
      <ClaimPhase id="2" current={1} phase={1} activity={newActivity} />,
    );

    // This component starts in the 'hidden' state, so we need to
    // click the button to show the past events
    getByText('Show past updates');
    fireEvent.click($('.claim-older-updates', container));

    // Check that the past events are showing and click the
    // button again to hide them
    await waitFor(() => {
      getByText('Tracked Item 2');
      getByText('Hide past updates');
      fireEvent.click($('.claim-older-updates', container));
    });

    // Check that the past events are hidden
    // NOTE: Not sure if having multiple waitFor s back-to-back like
    // this will cause an issue. If the test doesn't turn out to be flakey
    // then we can assume it's not an issue
    await waitFor(() => {
      getByText('Show past updates');
      expect(queryByText('Tracked Item 2')).to.not.exist;
    });
  });

  describe('event descriptions', () => {
    const tree = SkinDeep.shallowRender(
      <ClaimPhase id="2" current={1} phase={1} activity={activity} />,
    );
    const instance = tree.getMountedInstance();

    it('should show entered description', () => {
      const output = instance.getEventDescription({
        type: 'phase_entered',
        date: '2010-01-04',
      });

      const { container, getByText } = renderWithRouter(output);

      expect($('.claims-evidence-item', container)).to.exist;
      getByText('Your claim moved to Claim received');
    });

    it('should show file description', () => {
      const output = instance.getEventDescription({
        type: 'filed',
        date: '2010-01-04',
      });

      const { container, getByText } = renderWithRouter(output);

      expect($('.claims-evidence-item', container)).to.exist;
      getByText('Thank you. VA received your claim');
    });

    it('should show completed description', () => {
      const output = instance.getEventDescription({
        type: 'completed',
        date: '2010-01-04',
      });

      const { container, getByText } = renderWithRouter(output);

      expect($('.claims-evidence-item', container)).to.exist;
      getByText('Your claim is closed');
    });

    it('should show supporting_document description with no file name', () => {
      const output = instance.getEventDescription({
        type: 'supporting_document',
        date: '2010-01-04',
      });

      const { container, getByText } = renderWithRouter(output);

      expect($('.claims-evidence-item', container)).to.exist;
      getByText('You or someone else submitted a file.');
    });

    it('should show supporting_document description with file name', () => {
      const output = instance.getEventDescription({
        type: 'supporting_document',
        date: '2010-01-04',
        originalFileName: 'test-file.txt',
        documentTypeLabel: 'Test document label',
      });

      const { container, getByText } = renderWithRouter(output);

      expect($('.claims-evidence-item', container)).to.exist;
      getByText('You or someone else submitted "test-file.txt".');
    });

    it('should show no description when type null', () => {
      const output = instance.getEventDescription({
        type: null,
        date: '2010-01-04',
      });

      const { container } = renderWithRouter(output);

      expect($('.claims-evidence-item', container)).to.not.exist;
    });

    it('should show received from you reviewed description', () => {
      const output = instance.getEventDescription({
        type: 'tracked_item',
        displayName: 'Request 1',
        status: 'INITIAL_REVIEW_COMPLETE',
        date: '2010-01-04',
      });

      const { container, getByText } = renderWithRouter(output);

      expect($('.claims-evidence-item', container)).to.exist;
      getByText(
        'We have reviewed your submitted evidence for Request 1. We will notify you if we need additional information.',
      );
    });

    it('should show received from you not reviewed description', () => {
      const output = instance.getEventDescription({
        type: 'tracked_item',
        displayName: 'Request 1',
        status: 'SUBMITTED_AWAITING_REVIEW',
        date: '2010-01-04',
      });

      const { container, getByText } = renderWithRouter(output);

      expect($('.claims-evidence-item', container)).to.exist;
      getByText('You or someone else submitted Request 1.');
    });

    it('should show received from others reviewed description', () => {
      const output = instance.getEventDescription({
        type: 'tracked_item',
        displayName: 'Request 1',
        status: 'ACCEPTED',
        date: '2010-01-04',
      });

      const { container, getByText } = renderWithRouter(output);

      expect($('.claims-evidence-item', container)).to.exist;
      getByText(
        'We have reviewed your submitted evidence for Request 1. We will notify you if we need additional information.',
      );
    });

    it('should show still need from you reviewed description', () => {
      const output = instance.getEventDescription({
        type: 'tracked_item',
        displayName: 'Request 1',
        status: 'SUBMITTED_AWAITING_REVIEW',
        date: '2010-01-04',
      });

      const { container, getByText } = renderWithRouter(output);
      expect($('.claims-evidence-item', container)).to.exist;
      getByText('You or someone else submitted Request 1.');
    });

    it('should show still need from others not reviewed description', () => {
      const output = instance.getEventDescription({
        type: 'tracked_item',
        displayName: 'Request 1',
        status: 'NEEDED_FROM_OTHERS',
        date: '2010-01-04',
      });

      const { container, getByText } = renderWithRouter(output);

      expect($('.claims-evidence-item', container)).to.exist;
      getByText('We added a notice for:');
      getByText('Request 1');
    });

    it('should show never received from you description', () => {
      const output = instance.getEventDescription({
        type: 'tracked_item',
        displayName: 'Request 1',
        status: 'NO_LONGER_REQUIRED',
        date: '2010-01-04',
      });

      const { container, getByText } = renderWithRouter(output);

      expect($('.claims-evidence-item', container)).to.exist;
      getByText('We closed the notice for Request 1');
    });

    it('should show nothing when the tracked item has an unknown status', () => {
      const output = instance.getEventDescription({
        type: 'tracked_item',
        displayName: 'Request 1',
        status: 'UNKNOWN',
        date: '2010-01-04',
      });

      const { container } = renderWithRouter(output);

      expect($('.claims-evidence-item', container)).to.not.exist;
    });
  });

  it('should mask filenames in DataDog (no PII)', () => {
    const newActivity = {
      1: [
        {
          type: 'supporting_document',
          date: '2010-05-04',
          originalFileName: 'test.txt',
        },
      ],
    };

    const { container } = renderWithRouter(
      <ClaimPhase id="2" current={1} phase={1} activity={newActivity} />,
    );

    expect(
      $('.claims-evidence-item', container).getAttribute('data-dd-privacy'),
    ).to.equal('mask');
  });
});
