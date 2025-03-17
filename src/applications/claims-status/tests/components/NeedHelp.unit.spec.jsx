import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { NeedHelp } from '../../components/NeedHelp';

describe('<NeedHelp>', () => {
  it('should render', () => {
    const { container } = render(<NeedHelp />);
    expect($('va-need-help', container)).to.exist;
    expect($$('va-telephone', container).length).to.equal(2);
  });
  context('when cstFriendlyEvidenceRequests is true', () => {
    it('should render updated UI', () => {
      const item = {
        closedDate: null,
        description: '21-4142 text',
        displayName: '21-4142/21-4142a',
        friendlyName: 'Authorization to Disclose Information',
        friendlyDescription: 'good description',
        canUploadFile: true,
        supportAliases: ['VA Form 21-4142'],
        id: 14268,
        overdue: true,
        receivedDate: null,
        requestedDate: '2024-03-07',
        status: 'NEEDED_FROM_YOU',
        suspenseDate: '2024-04-07',
        uploadsAllowed: true,
        documents: '[]',
        date: '2024-03-07',
      };
      const { container } = render(<NeedHelp item={item} />);
      expect($('va-need-help', container)).to.exist;
      expect($$('va-telephone', container).length).to.equal(2);
      const alias = container.querySelector('.vads-u-font-weight--bold');
      expect(alias.textContent).to.include('VA Form 21-4142');
    });
    it('should render aliases with commas and "or" correctly', () => {
      const item = {
        supportAliases: ['Alias1', 'Alias2', 'Alias3', 'Alias4'],
      };

      const { queryAllByText } = render(<NeedHelp item={item} />);

      expect(queryAllByText('"Alias1", "Alias2", "Alias3" or "Alias4"'));
    });
  });
});
