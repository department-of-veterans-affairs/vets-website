# VAP-SVC Dead Code Analysis

**Analysis Date:** October 25, 2025  
**Branch:** vap-svc-docs

## Summary

This document identifies potential dead code within the `src/platform/user/profile/vap-svc` library. These files are not imported by any code in `src/applications` (via `@@vap-svc` alias) and have no internal usage within the vap-svc library itself.

## Confirmed Dead Code (4 files, ~650+ lines)

These files appear to be completely unused and are candidates for removal:

### 1. `components/base/VAPServiceEditModalActionButtons.jsx`

- **Lines:** 143
- **Status:** ❌ NOT imported by src/applications code
- **Internal Usage:** 0 uses within vap-svc
- **External References:** Only in `platform/user/exportsFile.js` (legacy export file)
- **Test Coverage:** 62.06% lines, 57.14% functions ⚠️
- **Test Files:** Has unit tests but NO production usage
- **Description:** Action buttons component for edit modals
- **Recommendation:** **REMOVE** - Tests exist but component never used in production

### 2. `components/ResidentialAddress.jsx`

- **Lines:** 15
- **Status:** ❌ NOT imported by src/applications code via @@vap-svc
- **Internal Usage:** 0 uses within vap-svc
- **External References:** Only in `platform/user/exportsFile.js`
- **Test Coverage:** 0% - Not in coverage report at all ✅
- **Test Files:** None
- **Description:** Wrapper component for residential address field
- **Note:** The `selectVAPResidentialAddress` selector IS used by VAOS, but this component wrapper is not
- **Recommendation:** **REMOVE** - Completely unused, zero coverage confirms dead code

### 3. `containers/AddressValidationModal.jsx`

- **Lines:** 387 (LARGEST dead code file)
- **Status:** ❌ NOT imported by src/applications code
- **Internal Usage:** 0 uses within vap-svc
- **External References:** Only in `platform/user/exportsFile.js`
- **Test Coverage:** 69.64% lines, 66.66% functions ⚠️
- **Test Files:** Has unit tests but NO production usage
- **Description:** Modal component for address validation UI
- **Note:** The utility function `showAddressValidationModal()` IS used, but this modal component itself is not
- **Recommendation:** **REMOVE** - Large unused modal with tests but no production usage

### 4. `containers/VAPServiceTransactionReporter.jsx`

- **Lines:** 67
- **Status:** ❌ NOT imported by src/applications code
- **Internal Usage:** 0 uses within vap-svc
- **External References:** Only in `platform/user/exportsFile.js`
- **Test Coverage:** 100% lines, 66.66% functions ⚠️
- **Test Files:** Has unit tests but NO production usage
- **Description:** Component for reporting transaction errors
- **Recommendation:** **REMOVE** - Well-tested but never used in production

## Total Impact

- **Files to Remove:** 4
- **Lines of Code Saved:** ~650+ lines
- **Test Files to Remove:** 3 corresponding unit test files (ResidentialAddress has no tests)
- **Coverage Impact:** Will improve overall coverage metrics by removing untested/unused code

## Coverage Analysis Results

**Overall vap-svc Library Coverage:** 49.32% lines, 41.92% functions (46 files analyzed)

### Key Finding: "Zombie Code"

3 out of 4 dead code files have active test suites (62-100% coverage), creating a false sense of code health. This is **"zombie code"** - tested but never used in production:

- ✅ **VAPServiceEditModalActionButtons.jsx**: 62% line coverage
- ✅ **AddressValidationModal.jsx**: 70% line coverage  
- ✅ **VAPServiceTransactionReporter.jsx**: 100% line coverage
- ❌ **ResidentialAddress.jsx**: 0% coverage (truly dead)

**Why remove well-tested code?**
1. Tests without production usage create maintenance burden
2. False confidence in code quality metrics
3. Confusion for developers about which components to use
4. Wasted CI/CD resources running unused test suites

## Files That Are NOT Dead Code

The following files are **internal-only** (not imported by src/applications) but ARE actively used within vap-svc itself:

### Components (Internal Use)
- `components/base/VAPServiceEditModalErrorMessage.jsx` - 4 internal uses
- `components/base/VAPServiceProfileFieldHeading.jsx` - 1 internal use
- `components/base/VAPServiceTransactionErrorBanner.jsx` - 1 internal use
- `components/base/VAPServiceTransaction.jsx` - 5 internal uses
- `components/base/VAPServiceTransactionPending.jsx` - 2 internal uses
- `components/ContactInfoForm.jsx` - 1 external use in applications
- `components/ContactInformationFieldInfo/CannotEditModal.jsx` - 1 internal use
- `components/ContactInformationFieldInfo/ConfirmCancelModal.jsx` - 1 internal use
- `components/ContactInformationFieldInfo/ConfirmRemoveModal.jsx` - 1 internal use
- `components/ContactInformationFieldInfo/IntlMobileConfirmModal.jsx` - 1 internal use
- `components/GenericErrorAlert.jsx` - 1 internal use
- `components/OtherTextField.jsx` - 1 internal use
- `components/ProfileInformationActionButtons.jsx` - 2 internal uses
- `components/ProfileInformationEditViewFc.jsx` - 1 internal use
- `components/ProfileInformationView.jsx` - 1 internal use
- `components/AddressField/AddressField.jsx` - 1 internal use

### Containers (Internal Use)
- `containers/AddressValidationView.jsx` - 1 internal use
- `containers/CopyMailingAddress.jsx` - 2 internal uses
- `containers/VAPServiceProfileField.jsx` - 2 internal uses

### Utilities (Internal Use)
- `util/contact-information/emailUtils.js` - 1 internal use
- `util/contact-information/phoneUtils.js` - 1 internal use + 1 external use
- `util/id-factory.js` - 3 internal uses
- `util/local-vapsvc.js` - 2 internal uses
- `util/personal-information/MessagingSignatureDescription.jsx` - 1 internal use
- `util/transactions.js` - **16 internal uses** (heavily used!)

## Investigation Notes

### exportsFile.js Analysis

The file `src/platform/user/exportsFile.js` appears to be a legacy export aggregator. It exports many vap-svc components, but actual analysis shows:

- **No code imports** `VAPServiceEditModalActionButtons` from exportsFile
- **No code imports** `ResidentialAddress` from exportsFile
- **No code imports** `AddressValidationModal` from exportsFile
- **No code imports** `VAPServiceTransactionReporter` from exportsFile

This suggests these exports were added to exportsFile.js but never actually consumed by any application code.

### Verification Steps Taken

1. ✅ Searched all `src/applications` code for imports via `@@vap-svc` alias
2. ✅ Searched for internal usage within vap-svc directory
3. ✅ Checked for imports via legacy paths (`platform/user/profile/vap-svc`)
4. ✅ Verified exports in `exportsFile.js` are not being imported
5. ✅ Confirmed test files exist but production usage does not
6. ✅ **Ran test coverage analysis** (`yarn test:unit --coverage`)
   - Confirmed 3/4 files have test coverage but zero production usage
   - Confirmed ResidentialAddress.jsx has zero coverage (completely dead)

## Recommended Actions

### Before Deletion
1. [ ] Review git history for context on why these files were created
2. [ ] Confirm with team these weren't intended for future features
3. [ ] Check if any external packages/repos might reference these
4. [ ] Verify CI/CD pipelines won't break

### Deletion Steps
1. [ ] Remove the 4 dead code files listed above
2. [ ] Remove corresponding unit test files (3 total):
   - `tests/components/VAPServiceEditModalActionButtons.unit.spec.jsx`
   - `tests/containers/AddressValidationModal.unit.spec.jsx`
   - `tests/containers/VAPServiceTransactionReporter.unit.spec.jsx`
   - Note: ResidentialAddress.jsx has no test file
3. [ ] Remove exports from `platform/user/exportsFile.js`
4. [ ] Update this document with deletion details
5. [ ] Run full test suite to verify no breakage: `yarn test:unit src/platform/user/profile/vap-svc/**/*.unit.spec.js*`
6. [ ] Re-run coverage analysis to verify improvement: `yarn test:unit --coverage src/platform/user/profile/vap-svc/**/*.unit.spec.js*`
7. [ ] Update README.md if any removed files were documented

### Consideration: exportsFile.js Cleanup

Consider a broader investigation into `platform/user/exportsFile.js`:
- Is this file itself legacy code?
- Are there other unused exports in this file?
- Should we migrate away from this pattern entirely?

## Analysis Methodology

### Commands Used

```bash
# Find all exports in vap-svc
grep -r "^export" src/platform/user/profile/vap-svc --include="*.js" --include="*.jsx"

# Find all imports from @@vap-svc in applications
grep -r "from '@@vap-svc" src/applications --include="*.js" --include="*.jsx"

# Check internal usage within vap-svc
grep -r "from.*ComponentName" src/platform/user/profile/vap-svc --include="*.js" --include="*.jsx"

# Verify no imports via exportsFile
grep -r "ComponentName" src --include="*.js" --include="*.jsx" | grep "exportsFile"

# Run test coverage analysis
yarn test:unit --coverage src/platform/user/profile/vap-svc/**/*.unit.spec.js*

# Analyze coverage for specific files
python3 << 'EOF'
import json
with open('coverage/coverage-summary.json', 'r') as f:
    data = json.load(f)
for filepath, coverage in data.items():
    if 'DeadCodeFileName' in filepath:
        print(f"{filepath}: {coverage['lines']['pct']}% coverage")
EOF
```

### Criteria for "Dead Code"
- ❌ Not imported by any code in `src/applications/` via `@@vap-svc`
- ❌ Not imported internally within `src/platform/user/profile/vap-svc/`
- ❌ Not imported via legacy paths
- ❌ Only reference is in `exportsFile.js` (and not consumed from there)
- ⚠️ May have test files (but those don't count as "usage")

## Questions or Concerns?

If you have questions about this analysis or need to preserve any of these files, please document your reasoning in this file or reach out to the team.

---

**Next Review Date:** _Set date for follow-up after attempting removal_
