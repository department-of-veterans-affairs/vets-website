## Start mock API

Open a terminal and start the the mock api

```bash
yarn mock-api --responses src/platform/mhv/api/mocks
```

## Start mock API in Codespaces

- In Github Profile settings, navigate to `Codespaces`, add a secret `VETS_WEBSITE_MHV_MOCK_SERVICE` with value `YES`.
- Create `Codespaces` instance. Once the build succeeds, the following commands will already be running:
  - `yarn mock-api --responses src/platform/mhv/api/mocks`
  - `yarn watch`
- Change both Ports visibility to `Public`.

## Testing Secure Messaging Recent Recipients Feature

The **Recent Recipients** feature displays care teams that a veteran has messaged within the last 6 months. To test this feature locally:

### Prerequisites

1. Start the mock API: `yarn mock-api --responses src/platform/mhv/api/mocks`
2. Start the dev server: `yarn watch --env entry=secure-messaging`
3. The feature flag `mhvSecureMessagingRecentRecipients` is enabled by default in mocks

### Expected Behavior

When you start composing a new message:

1. After the interstitial page, you'll see the **Recent Care Teams** page
2. The page displays up to 4 recent care teams from the sent messages in the last 6 months
3. The following recipients will appear (based on mock data):
   - **DETROIT: Primary Care, Lydon, John R. Md** (sent Dec 2025)
   - **DETROIT: Audiology, House, Gregory, Md** (sent Nov 2025)
   - **DETROIT: Audiology, Justice, French, MD** (sent Oct 2025)
   - **DETROIT: Cardiology, Yang, Christina, Md** (sent Sep 2025)
4. An option "A different care team" allows navigating to the full recipient list

### Mock Data Details

- **sentMessages.json** contains mock messages with dates updated to be within the last 6 months
- Recipients in the recent list must also exist in the `allRecipients` list (they are filtered for security)
- The feature searches the Sent folder (folder ID: `-1`) for messages within the date range

### Toggling the Feature

To disable the feature and test the traditional flow:

1. Edit `src/platform/mhv/api/mocks/feature-toggles/index.js`
2. Set `mhvSecureMessagingRecentRecipients: false`
3. Restart the mock API
4. The compose flow will skip Recent Care Teams and go directly to Select Care Team
