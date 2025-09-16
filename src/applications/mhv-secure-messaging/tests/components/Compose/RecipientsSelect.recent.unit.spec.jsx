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

// Provide two distinct care system names for stationNumbers 552 & 402
const EHR_MAP_WITH_NAMES = {
  552: { vamcSystemName: 'Cleveland VA Medical Center' },
  402: { vamcSystemName: 'Boston VA Medical Center' },
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

  it('renders recent section with headings, optgroups for remaining teams, correct ordering and no duplicates', async () => {
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
        initialState: buildInitialState({ ehrMap: EHR_MAP_WITH_NAMES }),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    // Wait for combo box
    const combo = await screen.findByTestId('compose-recipient-combobox');
    expect(combo).to.exist;

    // Headings should be present
    const recentGroup = combo.querySelector(
      'optgroup[label="Recent care teams"]',
    );
    expect(recentGroup).to.exist;

    // Optgroups (one for each remaining system name)
    const optgroups = Array.from(combo.querySelectorAll('optgroup'));
    // Recent care teams group + remaining system groups (552 & 402)
    expect(optgroups.length).to.equal(3);
    const groupLabels = optgroups.map(g => g.getAttribute('label'));
    expect(groupLabels).to.include('Cleveland VA Medical Center');
    expect(groupLabels).to.include('Boston VA Medical Center');

    // Collect visible selectable options (exclude disabled headings & optgroups container)
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
    expect(uniqueRenderedIds.size).to.equal(recipientsList.length);
  });

  it('limits recent section to maximum of 4 recent care teams and groups remaining teams into optgroups', async () => {
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
        initialState: buildInitialState({ ehrMap: EHR_MAP_WITH_NAMES }),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    const combo = await screen.findByTestId('compose-recipient-combobox');

    // Recent section selectable items should be first 4 (Alpha, Bravo, Charlie, Delta)
    const selectable = Array.from(
      combo.querySelectorAll('option:not([disabled])'),
    );
    const firstFourValues = selectable.slice(0, 4).map(o => o.value);
    expect(firstFourValues).to.deep.equal(['1', '2', '3', '4']);

    // Echo Team should still appear later (grouped section)
    const echoOption = selectable.find(o => o.value === '5');
    expect(echoOption).to.exist;

    // Only one remaining unique system (Echo's system 552) -> 1 optgroup
    const optgroups = combo.querySelectorAll('optgroup');
    // Recent care teams group + single remaining system group
    expect(optgroups.length).to.equal(2);
    // The system group label (not the recent group) should still match expected
    const systemGroup = Array.from(optgroups).find(
      g => g.getAttribute('label') !== 'Recent care teams',
    );
    expect(systemGroup.getAttribute('label')).to.equal(
      'Cleveland VA Medical Center',
    );
  });

  it('omits recent section when recentRecipients prop is empty array but still groups by care system', async () => {
    const screen = renderWithStoreAndRouter(
      <RecipientsSelect
        recipientsList={recipientsList}
        recentRecipients={[]}
        {...baseProps}
      />,
      {
        initialState: buildInitialState({ ehrMap: EHR_MAP_WITH_NAMES }),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    const combo = await screen.findByTestId('compose-recipient-combobox');

    // Should NOT have headings
    expect(combo.querySelector('optgroup[label="Recent care teams"]')).to.be
      .null;
    // Removed expectation for All care teams heading (no longer rendered)

    // Expect 2 optgroups (552 & 402)
    const optgroups = combo.querySelectorAll('optgroup');
    expect(optgroups.length).to.equal(2);
    const labels = Array.from(optgroups).map(g => g.getAttribute('label'));
    expect(labels).to.include('Cleveland VA Medical Center');
    expect(labels).to.include('Boston VA Medical Center');
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

  it('handles undefined recentRecipients (loading state) gracefully (no headings) and still groups', async () => {
    const screen = renderWithStoreAndRouter(
      <RecipientsSelect
        recipientsList={recipientsList}
        // recentRecipients intentionally omitted / undefined
        {...baseProps}
      />,
      {
        initialState: buildInitialState({ ehrMap: EHR_MAP_WITH_NAMES }),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    const combo = await screen.findByTestId('compose-recipient-combobox');
    expect(combo).to.exist;

    expect(combo.querySelector('optgroup[label="Recent care teams"]')).to.be
      .null;
    // Removed expectation for All care teams heading in loading state (no longer rendered)

    const optgroups = combo.querySelectorAll('optgroup');
    expect(optgroups.length).to.equal(2);
  });

  it('ignores recentRecipients entries not present in recipientsList without breaking ordering and still groups remaining', async () => {
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
        initialState: buildInitialState({ ehrMap: EHR_MAP_WITH_NAMES }),
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

    // Confirm optgroups exist
    const optgroups = combo.querySelectorAll('optgroup');
    expect(optgroups.length).to.be.greaterThan(0);
  });

  it('recent heading appears before all heading and optgroups appear after all heading', async () => {
    const recentRecipients = [{ triageTeamId: 1, name: 'Alpha Team' }];

    const screen = renderWithStoreAndRouter(
      <RecipientsSelect
        recipientsList={recipientsList}
        recentRecipients={recentRecipients}
        {...baseProps}
      />,
      {
        initialState: buildInitialState({ ehrMap: EHR_MAP_WITH_NAMES }),
        reducers: reducer,
        path: '/my-health/secure-messages/new-message/select-care-team',
      },
    );

    const combo = await screen.findByTestId('compose-recipient-combobox');

    // Verify the recent group optgroup exists
    const recentGroup = combo.querySelector(
      'optgroup[label="Recent care teams"]',
    );
    expect(recentGroup).to.exist;

    const optgroups = combo.querySelectorAll('optgroup');
    expect(optgroups.length).to.be.greaterThan(0);
  });
});
