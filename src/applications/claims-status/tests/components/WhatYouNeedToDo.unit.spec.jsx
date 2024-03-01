import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import WhatYouNeedToDo from '../../components/claim-status-tab/WhatYouNeedToDo';

describe('<WhatYouNeedToDo>', () => {
  context('when useLighthouse true', () => {
    const useLighthouse = true;
    it('should render no-documents description when there are no flies needed', () => {
      const claim = {
        attributes: {
          open: false,
          trackedItems: [],
        },
      };
      const { container, getByText } = render(
        <WhatYouNeedToDo claim={claim} useLighthouse={useLighthouse} />,
      );
      const expectedText =
        "There's nothing we need from you right now. We'll let you know when there's an update.";
      getByText(expectedText);
      expect($('va-alert', container)).not.to.exist;
    });

    it('should FilesNeeded', () => {
      const claim = {
        attributes: {
          open: true,
          trackedItems: [
            {
              status: 'NEEDED_FROM_YOU',
            },
          ],
        },
      };
      const { container, queryByText } = render(
        <WhatYouNeedToDo claim={claim} useLighthouse={useLighthouse} />,
      );
      const expectedText =
        "There's nothing we need from you right now. We'll let you know when there's an update.";
      expect(queryByText(expectedText)).not.to.exist;
      expect($('va-alert', container)).to.exist;
    });
  });

  context('when useLighthouse false', () => {
    const useLighthouse = false;
    it('should render no-documents description when there are no flies needed', () => {
      const claim = {
        attributes: {
          open: false,
          eventsTimeline: [],
        },
      };
      const { container, getByText } = render(
        <WhatYouNeedToDo claim={claim} useLighthouse={useLighthouse} />,
      );
      const expectedText =
        "There's nothing we need from you right now. We'll let you know when there's an update.";
      expect(getByText(expectedText)).to.exist;
      expect($('va-alert', container)).not.to.exist;
    });

    it('should FilesNeeded', () => {
      const claim = {
        attributes: {
          open: true,
          eventsTimeline: [
            {
              type: 'still_need_from_you_list',
              status: 'NEEDED',
            },
          ],
        },
      };
      const { container, queryByText } = render(
        <WhatYouNeedToDo claim={claim} useLighthouse={useLighthouse} />,
      );
      const expectedText =
        "There's nothing we need from you right now. We'll let you know when there's an update.";
      expect(queryByText(expectedText)).not.to.exist;
      expect($('va-alert', container)).to.exist;
    });
  });
});
