import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { NeedHelp } from '../../components/NeedHelp';
import * as dictionary from '../../utils/evidenceDictionary';

const getStore = (cstFriendlyEvidenceRequests = true) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_friendly_evidence_requests: cstFriendlyEvidenceRequests,
    },
  }));
describe('<NeedHelp>', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={getStore()}>
        <NeedHelp />
      </Provider>,
    );
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
      const { container } = render(
        <Provider store={getStore()}>
          <NeedHelp item={item} />
        </Provider>,
      );
      expect($('va-need-help', container)).to.exist;
      expect($$('va-telephone', container).length).to.equal(2);
      const alias = container.querySelector('.vads-u-font-weight--bold');
      expect(alias.textContent).to.include('VA Form 21-4142');
    });
    it('should render aliases with commas and "or" correctly', () => {
      const item = {
        supportAliases: ['Alias1', 'Alias2', 'Alias3', 'Alias4'],
        friendlyName: 'Friendly name',
      };

      const { container } = render(
        <Provider store={getStore()}>
          <NeedHelp item={item} />
        </Provider>,
      );

      expect(container.textContent).to.include(
        '“Alias1”, “Alias2”, “Alias3” or “Alias4.”',
      );
    });
    it('should preserve casing if friendlyName is a proper noun', () => {
      const item = {
        displayName: 'displayKey',
        supportAliases: ['Alias1'],
        friendlyName: 'Friendly Name',
      };

      dictionary.evidenceDictionary.displayKey = { isProperNoun: true };

      const { container } = render(
        <Provider store={getStore()}>
          <NeedHelp item={item} />
        </Provider>,
      );
      expect(container.textContent).to.include('Friendly Name');
    });
    it('should lowercase friendlyName if not a proper noun', () => {
      const item = {
        displayName: 'displayKey',
        supportAliases: ['Alias1'],
        friendlyName: 'Friendly Name',
      };

      dictionary.evidenceDictionary.displayKey = { isProperNoun: false };

      const { container } = render(
        <Provider store={getStore()}>
          <NeedHelp item={item} />
        </Provider>,
      );
      expect(container.textContent).to.include('friendly Name');
    });
  });
});
