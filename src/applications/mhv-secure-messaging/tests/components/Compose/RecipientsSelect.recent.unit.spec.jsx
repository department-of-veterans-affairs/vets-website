import React from 'react';
import { expect } from 'chai';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';
import RecipientsSelect from '../../../components/ComposeForm/RecipientsSelect';

// This test suite focuses on the "Recent care teams" section added to the curated
// combo box flow. It validates ordering, de-duplication, maximum recent count,
// absence of the section when conditions are not met, and presence of accessible headings.

const buildInitialState = ({
  curated = true,
  recentFlag = true,
  ehrMap = {},
} = {}) => {
  return {
    featureToggles: {
      [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: curated,
      [FEATURE_FLAG_NAMES.mhvSecureMessagingRecentRecipients]: recentFlag,
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: ehrMap,
        },
      },
    },
  };
};

const recipientsList = [
  { id: 1, name: 'Alpha Team', stationNumber: '552', signatureRequired: false },
  { id: 2, name: 'Bravo Team', stationNumber: '552', signatureRequired: false },
  {
    id: 3,
    name: 'Charlie Team',
    stationNumber: '402',
    signatureRequired: false,
  },
  { id: 4, name: 'Delta Team', stationNumber: '402', signatureRequired: false },
  { id: 5, name: 'Echo Team', stationNumber: '552', signatureRequired: false },
];

describe('RecipientsSelect recent care teams section (curated combo box)', () => {
  const baseProps = {
    isSignatureRequired: false,
    onValueChange: () => {},
  };

  it('renders recent section with headings and correct ordering (recent first) and no duplicates', async () => {
    // Provide 3 recent recipients (unordered, includes an id not in recipientsList to test filtering)
    const recentRecipients = [
      { triageTeamId: 3, name: 'Charlie Team' },
      { triageTeamId: 99, name: 'Ghost Team' }, // should be ignored (not in list)
      { triageTeamId: 1, name: 'Alpha Team' },
    ];

    const screen = renderWithStoreAndRouter(
      <RecipientsSelect
        recipientsList={recipientsList}
        recentRecipients={recentRecipients}
        {...baseProps}
      />,
      {
        initialState: buildInitialState(),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    // Wait for combo box
    const combo = await screen.findByTestId('compose-recipient-combobox');
    expect(combo).to.exist;

    // Headings should be present
    const recentHeading = combo.querySelector(
      'option[data-testid="recent-care-teams-heading"]',
    );
    const allHeading = combo.querySelector(
      'option[data-testid="all-care-teams-heading"]',
    );
    expect(recentHeading).to.exist;
    expect(allHeading).to.exist;
    expect(recentHeading.disabled).to.be.true;
    expect(allHeading.disabled).to.be.true;

    // Collect visible selectable options (exclude disabled headings)
    const optionNodes = Array.from(
      combo.querySelectorAll('option:not([disabled])'),
    );

    // Expected first selectable options are the recent (ids 3,1) in the order they appear after filtering & slicing
    expect(optionNodes[0].value).to.equal('3');
    expect(optionNodes[0].textContent).to.equal('Charlie Team');
    expect(optionNodes[1].value).to.equal('1');
    expect(optionNodes[1].textContent).to.equal('Alpha Team');

    // Ensure remaining options exclude duplicates of recent
    const remainingValues = optionNodes.slice(2).map(o => o.value);
    expect(remainingValues).to.not.include('3');
    expect(remainingValues).to.not.include('1');

    // All unique ids should equal original list length (since only 99 was ignored)
    const uniqueRenderedIds = new Set(optionNodes.map(o => o.value));
    // original list length (5) minus none (recent are part of original)
    expect(uniqueRenderedIds.size).to.equal(5 - 0);
  });

  it('limits recent section to maximum of 4 recent care teams', async () => {
    const recentRecipients = [
      { triageTeamId: 1, name: 'Alpha Team' },
      { triageTeamId: 2, name: 'Bravo Team' },
      { triageTeamId: 3, name: 'Charlie Team' },
      { triageTeamId: 4, name: 'Delta Team' },
      { triageTeamId: 5, name: 'Echo Team' }, // should be truncated out
    ];

    const screen = renderWithStoreAndRouter(
      <RecipientsSelect
        recipientsList={recipientsList}
        recentRecipients={recentRecipients}
        {...baseProps}
      />,
      {
        initialState: buildInitialState(),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    const combo = await screen.findByTestId('compose-recipient-combobox');

    // Recent section selectable items should be first 4 (Alpha, Bravo, Charlie, Delta) -> Echo appears only in "All care teams"
    const selectable = Array.from(
      combo.querySelectorAll('option:not([disabled])'),
    );
    const firstFourValues = selectable.slice(0, 4).map(o => o.value);
    expect(firstFourValues).to.deep.equal(['1', '2', '3', '4']);
    // Echo Team should still appear later
    const echoOption = selectable.find(o => o.value === '5');
    expect(echoOption).to.exist;
  });

  it('omits recent section when recentRecipients prop is empty array', async () => {
    const screen = renderWithStoreAndRouter(
      <RecipientsSelect
        recipientsList={recipientsList}
        recentRecipients={[]}
        {...baseProps}
      />,
      {
        initialState: buildInitialState(),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    const combo = await screen.findByTestId('compose-recipient-combobox');

    // Should NOT have headings
    expect(
      combo.querySelector('option[data-testid="recent-care-teams-heading"]'),
    ).to.be.null;
    expect(combo.querySelector('option[data-testid="all-care-teams-heading"]'))
      .to.be.null;

    // All options should just be the sorted base list (5)
    const selectable = Array.from(combo.querySelectorAll('option'));
    expect(selectable.length).to.equal(recipientsList.length);
  });

  it('omits recent section when curated flag off (even if recent provided)', async () => {
    const recentRecipients = [{ triageTeamId: 1, name: 'Alpha Team' }];

    const screen = renderWithStoreAndRouter(
      <RecipientsSelect
        recipientsList={recipientsList}
        recentRecipients={recentRecipients}
        {...baseProps}
      />,
      {
        initialState: buildInitialState({ curated: false, recentFlag: true }),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    // When curated is false and opt groups disabled (feature off), component returns VaSelect path (no combo box)
    // So ensure we rendered select, not combo
    const select = await screen.findByTestId('compose-recipient-select');
    expect(select).to.exist;
    expect(
      select.querySelector('option[data-testid="recent-care-teams-heading"]'),
    ).to.be.null;
  });

  it('omits recent section when recent feature flag off', async () => {
    const recentRecipients = [{ triageTeamId: 1, name: 'Alpha Team' }];

    const screen = renderWithStoreAndRouter(
      <RecipientsSelect
        recipientsList={recipientsList}
        recentRecipients={recentRecipients}
        {...baseProps}
      />,
      {
        initialState: buildInitialState({ curated: true, recentFlag: false }),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    const combo = await screen.findByTestId('compose-recipient-combobox');
    expect(combo).to.exist;
    expect(
      combo.querySelector('option[data-testid="recent-care-teams-heading"]'),
    ).to.be.null;
  });

  it('handles undefined recentRecipients (loading state) gracefully (no headings)', async () => {
    const screen = renderWithStoreAndRouter(
      <RecipientsSelect
        recipientsList={recipientsList}
        // recentRecipients intentionally omitted / undefined
        {...baseProps}
      />,
      {
        initialState: buildInitialState(),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    const combo = await screen.findByTestId('compose-recipient-combobox');
    expect(combo).to.exist;

    expect(
      combo.querySelector('option[data-testid="recent-care-teams-heading"]'),
    ).to.be.null;
  });

  it('ignores recentRecipients entries not present in recipientsList without breaking ordering', async () => {
    const recentRecipients = [
      { triageTeamId: 999, name: 'Missing Team' }, // not present
      { triageTeamId: 2, name: 'Bravo Team' },
    ];

    const screen = renderWithStoreAndRouter(
      <RecipientsSelect
        recipientsList={recipientsList}
        recentRecipients={recentRecipients}
        {...baseProps}
      />,
      {
        initialState: buildInitialState(),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    const combo = await screen.findByTestId('compose-recipient-combobox');
    const selectable = Array.from(
      combo.querySelectorAll('option:not([disabled])'),
    );

    // Bravo should be first (as only valid recent)
    expect(selectable[0].value).to.equal('2');
    expect(selectable[0].textContent).to.equal('Bravo Team');
  });

  it('recent heading appears before all heading', async () => {
    const recentRecipients = [{ triageTeamId: 1, name: 'Alpha Team' }];

    const screen = renderWithStoreAndRouter(
      <RecipientsSelect
        recipientsList={recipientsList}
        recentRecipients={recentRecipients}
        {...baseProps}
      />,
      {
        initialState: buildInitialState(),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    const combo = await screen.findByTestId('compose-recipient-combobox');

    const allOptions = Array.from(combo.querySelectorAll('option'));
    const recentIdx = allOptions.findIndex(
      o => o.getAttribute('data-testid') === 'recent-care-teams-heading',
    );
    const allIdx = allOptions.findIndex(
      o => o.getAttribute('data-testid') === 'all-care-teams-heading',
    );
    expect(recentIdx).to.be.lessThan(allIdx);
  });
});
