# Letters Application

## Architecture

- **Path**: `/records/download-va-letters/letters`
- **Staging URL**: `https://staging.va.gov/records/download-va-letters/letters`

### Benefit Summary and Service Verification Letter

The Benefit Summary letter has interactive checkboxes that let veterans select what to include on the generated PDF. The payload sent to the letter generator API includes these fields:

- `militaryService` - checkbox: "Military service"
- `serviceConnectedEvaluation` - checkbox: "Combined disability rating"
- `monthlyAward` - checkbox: "Monthly benefit amount"
- `serviceConnectedDisabilities` - checkbox: "Service-connected disabilities"
- `chapter35Eligibility` - checkbox: "Permanent or temporary disability status" (only shown when API indicates eligibility)

Two additional fields are included in the payload but are **not exposed in the UI**:
- `deathResultOfDisability` - forced to `false` in `actions/letters.js` before sending
- `survivorsAward` - forced to `false` in `actions/letters.js` before sending

These are survivor/dependent-specific concepts. The reducer (`reducers/index.js`) initializes them to `true` via the `optionsToAlwaysDisplay` list, but they are overridden to `false` at the serialization point in `getLetterPdf()`.

### Label Maps

There are two label maps in `utils/helpers.jsx`:
- **`benefitSummaryLetterLabels`** (new) - Used by `VeteranBenefitSummaryOptions` to render checkboxes. Veteran-only for now; all `dependent` keys are `undefined` placeholders for a future enhancement.
- **`benefitOptionText`** (legacy) - Has rich dependent-facing content but is NOT used by any production component (only referenced in unit tests). Likely holdover from an older letter implementation.

### Veteran vs Dependent Code Paths

- Veterans (`benefit_summary` letter type) get `<VeteranBenefitSummaryOptions />` with interactive checkboxes
- Dependents (`benefit_summary_dependent` letter type) get static descriptive content only, no checkboxes
- `VeteranBenefitSummaryOptions` hardcodes `isVeteran = true` on line 46

### Key Files

- `containers/VeteranBenefitSummaryOptions.jsx` - Renders benefit checkboxes
- `containers/LetterList.jsx` - Routes to veteran vs dependent components based on letter type
- `utils/helpers.jsx` - Label maps, `benefitOptionsMap`, `optionsToAlwaysDisplay`, `getFriendlyBenefitSummaryLabels()`
- `utils/constants.js` - `LETTER_TYPES`, `REQUEST_OPTIONS`, action types
- `reducers/index.js` - Initializes `requestOptions` from API response; options default to `true` when API value is truthy, `false` when API value is `false`
- `actions/letters.js` - `getLetterPdf()` assembles and sends the payload; overrides `deathResultOfDisability` and `survivorsAward` to `false`

## Development

### Running locally against staging

**Important:** `yarn watch` defaults to a 12 GB Node heap (`script/watch.js` line 12), and the `--env memory=N` flag is broken when combined with other `--env` flags (minimist parses multiple `--env` as an array, so `argv.env.memory` is always undefined). On a 16 GB machine this will freeze the system.

**Workaround:** Bypass `watch.js` and run webpack directly with OS-level memory limits:

```sh
# Create a helper script (one-time)
cat > /tmp/run-letters.sh << 'EOF'
#!/bin/bash
export NODE_OPTIONS='--max-old-space-size=4096 --openssl-legacy-provider'
npx webpack serve --config config/webpack.config.js --env scaffold --env entry=letters
EOF
chmod +x /tmp/run-letters.sh

# Run with a hard 6GB memory cap via cgroups
systemd-run --user --scope -p MemoryMax=6G /tmp/run-letters.sh
```

Note: `--max-old-space-size` only limits the V8 heap, not total process memory. Webpack can still exceed it via native allocations. The `systemd-run` cgroup limit is the only reliable cap — it will OOM-kill the process cleanly instead of freezing the machine.

To point at staging API, add `--env api=https://staging-api.va.gov` to the webpack command.
To open directly to the letters page, add `--env openTo=records/download-va-letters/letters`.

### Unit tests

```sh
yarn test:unit --app-folder letters
```
