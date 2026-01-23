# Rx Export Module

This module provides a unified API for exporting prescription (Rx) data in PDF and TXT formats. It consolidates logic that was previously duplicated across containers and util files.

## Architecture (Composition Pattern)

```
createExportService({ userName, dob, options })
├── pdfBuilder (from createPdfDocumentBuilder)
│   ├── buildDocument()
│   ├── buildRxDetailsPdf()
│   └── buildRxListPdf()
├── txtBuilder (from createTxtDocumentBuilder)
│   ├── buildDocument()
│   ├── buildRxDetailsTxt()
│   └── buildRxListTxt()
└── export methods
    ├── exportRxDetailsPdf()
    ├── exportRxDetailsTxt()
    ├── exportRxListPdf()
    └── exportRxListTxt()
```

## Files

| File | Purpose |
|------|---------|
| `formatters.js` | Date formatting, field validation, user name formatting, list processing |
| `staticContent.js` | Crisis line content, allergies messages, preface text, error messages |
| `rxBuilders.js` | Field builders for PDF/TXT, allergy section builders |
| `documentBuilders.js` | PDF/TXT document builders, export service factory |
| `generators.js` | PDF/TXT file generation, filename generation |
| `index.js` | Public API exports |

## Usage

### Basic Usage with Export Service

```javascript
import { createExportService } from '../util/rxExport';

// Create the service (typically in a useMemo)
const exportService = useMemo(
  () => createExportService({
    userName,
    dob,
    options: { isCernerPilot, isV2StatusMapping }
  }),
  [userName, dob, isCernerPilot, isV2StatusMapping]
);

// Export single Rx details as PDF
await exportService.exportRxDetailsPdf({
  rxName: 'Aspirin 81mg',
  rxPdfList: [...],
  allergies: [...],
  isNonVA: false,
});

// Export single Rx details as TXT
exportService.exportRxDetailsTxt({
  rxContent: '...',
  allergies: [...],
  isNonVA: false,
});

// Export Rx list as PDF
await exportService.exportRxListPdf({
  rxPdfList: [...],
  allergies: [...],
  preface: '...',
  listHeader: 'All medications',
});

// Export Rx list as TXT
exportService.exportRxListTxt({
  rxContent: '...',
  allergies: [...],
  preface: '...',
  listHeader: 'All medications',
});
```

### Building Documents Manually

For more control over the document structure, use the builders directly:

```javascript
import { createExportService } from '../util/rxExport';

const exportService = createExportService({ userName, dob });

// Build PDF data without downloading
const pdfData = exportService.pdfBuilder.buildRxDetailsPdf({
  rxName: 'Aspirin 81mg',
  rxList: [...],
  allergies: [...],
});

// Build TXT content without downloading
const txtContent = exportService.txtBuilder.buildRxDetailsTxt({
  rxContent: '...',
  allergies: [...],
});
```

### Using Individual Formatters

```javascript
import {
  formatDate,
  formatProviderName,
  formatUserFullName,
  validateField,
  validateFieldWithName,
  formatList,
} from '../util/rxExport';

// Format a date
formatDate('2024-01-15'); // "January 15, 2024"
formatDate(null, undefined, 'Date not available'); // "Date not available"

// Format provider name
formatProviderName('Jane', 'Smith'); // "Jane Smith"
formatProviderName(null, null); // "Provider name not available"

// Format user name
formatUserFullName({ first: 'John', last: 'Doe' }); // "Doe, John"

// Validate fields
validateField('Active'); // "Active"
validateField(null); // "None noted"

validateFieldWithName('Status', null); // "Status not available"

// Format lists
formatList(['Rash', 'Hives']); // "Rash. Hives"
formatList([]); // "None noted"
```

### Using Static Content

```javascript
import {
  CRISIS_LINE_PDF,
  CRISIS_LINE_TXT,
  ALLERGIES_SECTION_HEADER,
  ALLERGIES_DESCRIPTION,
  ALLERGIES_EMPTY_MESSAGE,
  ALLERGIES_ERROR_MESSAGE,
  NON_VA_MEDICATION_DESCRIPTION,
  SINGLE_MEDICATION_PREFACE,
} from '../util/rxExport';
```

### Using Rx Builders

```javascript
import {
  createPdfField,
  createTxtField,
  buildAllergiesPdfSection,
  buildAllergiesTxtSection,
} from '../util/rxExport';

// Create a PDF field
createPdfField('Status', 'Active'); // { title: 'Status', value: 'Active', inline: true }

// Create a TXT field
createTxtField('Status', 'Active'); // "Status: Active"

// Build allergies section for PDF
buildAllergiesPdfSection(allergies); // { header: '...', preface: [...], list: [...] }

// Build allergies section for TXT
buildAllergiesTxtSection(allergies); // "Allergies and reactions\n..."
```

## Key Design Decisions

1. **Composition over inheritance** - Uses factory functions that return plain objects with methods, making the code easier to understand and test.

2. **Centralized static content** - All user-facing text (crisis line, error messages, etc.) is in one place (`staticContent.js`), making it easy to update and maintain consistency.

3. **Unified field builders** - `createPdfField()` and `createTxtField()` work with the same data, ensuring PDF and TXT outputs stay in sync.

4. **Separation of concerns**:
   - `formatters.js` - Pure data transformation functions
   - `staticContent.js` - Static text and messages
   - `rxBuilders.js` - Domain-specific field/section builders
   - `documentBuilders.js` - Document assembly and export service
   - `generators.js` - File generation (side effects)

## Testing

Tests are located in `src/applications/mhv-medications/tests/util/rxExport/`:

```bash
yarn test:unit src/applications/mhv-medications/tests/util/rxExport/formatters.unit.spec.js
yarn test:unit src/applications/mhv-medications/tests/util/rxExport/staticContent.unit.spec.js
yarn test:unit src/applications/mhv-medications/tests/util/rxExport/rxBuilders.unit.spec.js
yarn test:unit src/applications/mhv-medications/tests/util/rxExport/documentBuilders.unit.spec.js
```
