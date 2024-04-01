import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import WhatYouNeedToDo from '../../../components/claim-status-tab/WhatYouNeedToDo';
import { renderWithRouter } from '../../utils';

const nothingNeededText =
  'There’s nothing we need from you right now. We’ll let you know when there’s an update.';

describe('<WhatYouNeedToDo>', () => {
  it('should render no-documents description when there are no files needed', () => {
    const claim = {
      attributes: {
        trackedItems: [],
      },
    };

    const { container, getByText } = render(<WhatYouNeedToDo claim={claim} />);

    getByText(nothingNeededText);
    expect($('va-alert', container)).not.to.exist;
  });

  it('shouldn’t indicate that nothing is needed when files are needed', () => {
    const claim = {
      attributes: {
        trackedItems: [
          {
            status: 'NEEDED_FROM_YOU',
          },
        ],
      },
    };

    const { container, queryByText } = renderWithRouter(
      <WhatYouNeedToDo claim={claim} />,
    );

    expect(queryByText(nothingNeededText)).not.to.exist;
    expect($('va-alert', container)).to.exist;
  });
});
