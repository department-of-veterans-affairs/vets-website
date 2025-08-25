# VA.gov Form Pages Complete Guide

## Quick References
- **Web Component Patterns**: #file:web-component-patterns-catalog.json - All available UI/schema patterns
- **Application Examples**: #file:manifest-catalog.json - 130+ applications for folder, name, url, watch references

## Table of Contents
1. [Form Architecture Overview](#form-architecture-overview)
2. [File Structure & Naming](#file-structure--naming)
3. [Web Component Pattern Decision Tree](#web-component-pattern-decision-tree)
4. [Array vs Single Page Detection](#array-vs-single-page-detection)
5. [35+ Real-World Examples](#35-real-world-examples)
6. [Testing Requirements](#testing-requirements)
7. [Complete Checklist](#complete-checklist)

---

## Form Architecture Overview

### Complete Form Structure
```
VA.gov Form Structure:
┌─────────────────────────────────────────┐
│ Form (config/form.js)                   │
├─────────────────────────────────────────┤
│ ┌─ Chapter 1: Personal Info            │
│ │  ├─ Page: Name                       │
│ │  │  ├─ Title: "Your name"            │
│ │  │  ├─ Field: First name             │
│ │  │  └─ Field: Last name              │
│ │  └─ Page: Contact                    │
│ │     ├─ Title: "Contact information"  │
│ │     ├─ Field: Email                  │
│ │     └─ Field: Phone                  │
│ └─ Chapter 2: Employment (Array)       │
│    ├─ Summary: "Do you have employers?" │
│    └─ For each employer:               │
│       ├─ Page: Name                    │
│       ├─ Page: Dates                   │
│       └─ Page: Address                 │
└─────────────────────────────────────────┘

Stepper Navigation:
[1. Personal Info] → [2. Employment] → [3. Review]
    ↓ Current Chapter Pages ↓
[Name] → [Contact] → [Summary]
```

### What a Form Page Looks Like (Browser View)
```
┌─────────────────────────────────────────────────────────────┐
│ VA.gov Header with <h1>VA.gov</h1> (not part of form page)  │
├─────────────────────────────────────────────────────────────┤
│ Progress Bar: Step 1 of 6                                   │
│ <h2>1 of 6 Your personal information</h2>  ← CHAPTER (h2)   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ <h3>Name and date of birth</h3>  ← PAGE TITLE (h3, titleUI) │
│                                                             │
│ ┌─ PATTERN: fullNameUI() + fullNameSchema ────────────────┐ │
│ │                                                         │ │
│ │ First name (*Required)  ← FIELD LABEL (built into UI)   │ │
│ │ ┌─────────────────────┐                                 │ │
│ │ │                     │ ← INPUT FIELD                   │ │
│ │ └─────────────────────┘                                 │ │
│ │                                                         │ │
│ │ Middle name             ← FIELD LABEL (built into UI)   │ │
│ │ ┌─────────────────────┐                                 │ │
│ │ │                     │ ← INPUT FIELD                   │ │
│ │ └─────────────────────┘                                 │ │
│ │                                                         │ │
│ │ Last name (*Required)   ← FIELD LABEL (built into UI)   │ │
│ │ ┌─────────────────────┐                                 │ │
│ │ │                     │ ← INPUT FIELD                   │ │
│ │ └─────────────────────┘                                 │ │
│ │                                                         │ │
│ │ Suffix                  ← FIELD LABEL (built into UI)   │ │
│ │ ┌─ Select ─────────────▼                                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─ PATTERN: dateOfBirthUI() + dateOfBirthSchema ──────────┐ │
│ │                                                         │ │
│ │ Date of birth           ← FIELD LABEL (built into UI)   │ │
│ │ For example: January 19 2000  ← HINT (built into UI)    │ │
│ │                                                         │ │
│ │ Month       Day     Year ← SUB-LABELS (built into UI)   │ │
│ │ ┌─Select─▼ ┌───┐  ┌─────┐ ← INPUT FIELDS                │ │
│ │            │   │  │     │                               │ │
│ │            └───┘  └─────┘                               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ << Back                              Continue >>            │ ← AUTO-GENERATED (not in page code)
├─────────────────────────────────────────────────────────────┤
│ VA.gov Footer (not part of form page)                       │
└─────────────────────────────────────────────────────────────┘

NORMAL FORM HIERARCHY:  <h1>VA.gov</h1> → <h2>Chapter</h2> → <h3>Page Title</h3> → <h4>Field Titles</h4>
FORM PAGE CONTENT = Everything from "Name and date of birth" to before "Back/Continue"
CYPRESS TEST SEES = Everything in browser (header + progress + content + nav + footer)
NAVIGATION BUTTONS = Auto-generated by forms system (not coded in pages)
```

### Normal vs Minimal Form Flow Patterns

**📋 NORMAL FORM FLOW** (shown above):
- Full VA.gov header with navigation
- Progress bar showing chapter steps
- Chapter title and step indicator
- Form page content
- Back/Continue navigation
- Full VA.gov footer

**📋 MINIMAL FORM FLOW** (alternative pattern):
```
┌─────────────────────────────────────────────────────────────┐
│ Minimal VA Header (simplified, no <h1>)                     │
├─────────────────────────────────────────────────────────────┤
│ <div>Progress Bar: Step 1 of 6</div>  ← STEPPER (div only)  │
│ << Back to previous page   ← BACK LINK (at top)             │
│                                                             │
│ <h1>Name and date of birth</h1>  ← PAGE TITLE (h1, titleUI) │
│                                                             │
│ [Same form content as normal flow...]                       │
│                                                             │
│ ┌─ PATTERN: fullNameUI() + fullNameSchema ────────────────┐ │
│ │ First name (*Required)  ← FIELD LABEL (built into UI)   │ │
│ │ [input fields...]                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                      Continue >>            │ ← ONLY CONTINUE BUTTON
├─────────────────────────────────────────────────────────────┤
│ Minimal Footer                                              │
└─────────────────────────────────────────────────────────────┘

MINIMAL FORM HIERARCHY: (no h1 in header) → <h1>Page Title</h1> → <h2>Field Titles</h2>
MINIMAL FLOW DIFFERENCES:
- Simplified header/footer (no h1 in header)
- Stepper is <div> not <h2>
- Page title becomes <h1> instead of <h3>
- Field titles should be <h2> instead of <h4>
- Back link at top instead of back button at bottom
- Only continue button at bottom (no back button)
- Same page code works for both patterns with ifMinimalHeader
- Flow type configured in form config, not page code
```

### Code → Visual Mapping & Field Anatomy
```javascript
// FORM CONFIG (config/form.js) - Controls chapter info and navigation:
const formConfig = {
  chapters: {
    personalInfo: {                           // → Chapter key
      title: 'Your personal information',     // → "1 of 6 Your personal information"
      pages: {
        nameAndBirth: {                       // → Page key
          title: 'Name and date of birth',    // → Used for navigation
          path: 'name-and-birth',             // → URL path
          uiSchema: nameAndBirthPage.uiSchema,
          schema: nameAndBirthPage.schema,
        },
      },
    },
  },
};

// PAGE FILE (pages/nameAndBirth.js) - Only defines form content:
export default {
  uiSchema: {
    ...titleUI('Name and date of birth'),    // → PAGE TITLE (form content only)

    // ONE PATTERN = MULTIPLE VISUAL FIELDS WITH BUILT-IN LABELS
    name: fullNameUI(),                       // → Creates 4 labeled fields:
    //    ↑ NO "title" parameter needed!       //   "First name", "Middle name",
    //      Labels are built into the UI       //   "Last name", "Suffix"

    dateOfBirth: dateOfBirthUI(),            // → Creates 1 labeled group:
    //           ↑ NO "title" parameter!       //   "Date of birth" + 3 sub-fields
    //             Label is built into UI      //   "Month", "Day", "Year"
  },
  schema: {
    type: 'object',
    properties: {
      name: fullNameSchema,                   // → Validation for ALL name fields
      //    ↑ includes required: ['first', 'last'] internally

      dateOfBirth: dateOfBirthSchema,        // → Validation for ALL date fields
    },
    required: ['name', 'dateOfBirth'],       // → Makes entire patterns required
  },
};

// KEY CONCEPTS:
// - Chapter title (form config) ≠ Page title (titleUI in page)
// - "1 of 6" comes from chapter order in form config
// - Back/Continue buttons auto-generated by forms system
// - Page code only defines content between title and navigation
// - Same page code works for normal and minimal flow patterns

// EXAMPLES:
// textUI('Email address')           → Creates field with "Email address" label
// fullNameUI()                     → Creates fields with built-in labels
// yesNoUI('Are you married?')      → Creates field with "Are you married?" label
// dateOfBirthUI()                  → Creates field with built-in "Date of birth" label
```

### Understanding Fields vs Patterns
```
🔍 IMPORTANT CONCEPT: LABELS vs TITLES

📌 PAGE TITLE (titleUI):
   ...titleUI('Name and date of birth')     // → Big heading at top of page

📌 FIELD LABELS (built into patterns or passed as title parameter):

   SIMPLE PATTERNS (take a title parameter):
   textUI('Email address') + textSchema                  // → "Email address" label
   yesNoUI('Are you married?') + yesNoSchema             // → "Are you married?" label
   phoneUI('Phone number') + phoneSchema                 // → "Phone number" label

   COMPLEX PATTERNS (have built-in labels):
   fullNameUI() + fullNameSchema                         // → "First name", "Last name", etc.
   dateOfBirthUI() + dateOfBirthSchema                   // → "Date of birth" + sub-labels
   addressUI() + addressSchema()                         // → "Street address", "City", etc.

❌ Wrong thinking: "I need 4 separate fields for name"
   name: {
     first: textUI('First name') + textSchema,           // DON'T DO THIS
     middle: textUI('Middle name') + textSchema,         // DON'T DO THIS
     last: textUI('Last name') + textSchema,             // DON'T DO THIS
     suffix: selectUI('Suffix') + selectSchema([...]),   // DON'T DO THIS
   }

✅ Correct thinking: "I need the full name pattern"
   name: fullNameUI() + fullNameSchema,                  // ONE pattern = 4 labeled fields

💡 Key insights:
   - titleUI() = page heading
   - Simple patterns take title parameter for field label
   - Complex patterns have built-in field labels
   - Required validation typically in schema, unless conditional (then uiSchema)
   - Patterns handle layout, styling, accessibility automatically
```

### Advanced Pattern Configurations (Objects vs Strings)

Many patterns accept configuration objects instead of simple strings for advanced functionality:

```javascript
🔧 SIMPLE PATTERNS (string parameters):
textUI('Email address') + textSchema                    // Just a string label
yesNoUI('Are you married?') + yesNoSchema               // Just a string question
phoneUI('Phone number') + phoneSchema                   // Just a string label

🔧 COMPLEX PATTERNS (object configurations):

// selectUI with key/value labels and options
maritalStatus: selectUI({
  title: 'Marital status',
  hint: 'Select your current marital status',
  labels: {
    single: 'Single',
    married: 'Married',
    divorced: 'Divorced',
    widowed: 'Widowed'
  },
  errorMessages: {
    required: 'Please select your marital status'
  }
}),
// Schema: selectSchema(['single', 'married', 'divorced', 'widowed'])

// selectUI with simple array (labels become values)
education: selectUI('Education level'),
// Schema: selectSchema(['High school', 'Some college', 'Bachelor degree'])

// radioUI with complex configuration
disability: radioUI({
  title: 'Do you receive VA disability compensation?',
  description: 'This affects your eligibility for certain benefits',
  labels: {
    lowDisability: 'Yes, for a service-connected disability rating of up to 40%',
    highDisability: 'Yes, for a service-connected disability rating of 50% or higher',
    none: 'No'
  }
}),
// Schema: radioSchema(['lowDisability', 'highDisability', 'none'])

// radioUI with tile layout
compensationType: radioUI({
  title: 'Do you receive VA disability compensation?',
  tile: true,  // Creates tile-style radio buttons
  labels: {
    lowDisability: 'Yes, for a service-connected disability rating of up to 40%',
    highDisability: 'Yes, for a service-connected disability rating of 50% or higher',
    none: 'No'
  }
}),

// textUI with validation (correct approach - validation goes in schema)
phoneNumber: textUI({
  title: 'Phone number',
  hint: 'Enter your 10-digit phone number',
  errorMessages: {
    required: 'Phone number is required'
  }
}),
// Schema with validation:
schema: {
  type: 'object',
  properties: {
    phoneNumber: {
      type: 'string',
      pattern: '^[0-9\\-\\(\\)\\s]+$'  // Pattern validation in schema, not UI
    }
  },
  required: ['phoneNumber']  // Required validation in schema, not UI
},

// addressUI with custom configuration
address: addressUI({
  omit: ['street3'],                           // Hide optional address line 3
}) + addressSchema({
  omit: ['street3']
}),

// currentOrPastDateUI
graduationDate: currentOrPastDateUI({
  title: 'Graduation date',
  hint: 'Enter the date you graduated',
  errorMessages: {
    required: 'Please enter a valid graduation date',
    pattern: 'Please enter a valid current or past date'
  }
}) + currentOrPastDateSchema,

// fileInputUI with upload constraints
documents: fileInputUI({
  title: 'Upload supporting documents',
  hint: 'Upload PDF, JPG, or PNG files (5MB max each)',
  accept: '.pdf,.jpg,.jpeg,.png',
  maxSize: 5242880,                       // 5MB in bytes
  maxFiles: 10,
  buttonText: 'Choose files to upload',
  additionalErrorMessage: 'Please check file size and format'
}) + fileInputSchema(),

// checkboxGroupUI with various configurations - CORRECTED
services: checkboxGroupUI({
  title: 'Which services do you need?',
  required: true,                         // checkboxGroupUI requires this in UI
  hint: 'This is hint text',
  labels: {
    hasA: 'Option A',
    hasB: 'Option B'
  }
}),
// Schema: checkboxGroupSchema(['hasA', 'hasB']) + required in schema too

// checkboxGroupUI with tiled layout and descriptions - CORRECTED
benefits: checkboxGroupUI({
  title: 'Select your benefits',
  required: true,                         // checkboxGroupUI requires this in UI
  tile: true,  // Creates tile-style checkboxes
  labels: {
    health: {
      title: 'Healthcare',
      description: 'Select this option if you want healthcare benefits'
    },
    education: {
      title: 'Education',
      description: 'Select this option if you want education benefits'
    }
  },
  errorMessages: {
    required: 'Please select at least one benefit'
  }
}),

// checkboxGroupUI with custom header level - CORRECTED
programs: checkboxGroupUI({
  title: 'Available programs',
  description: 'Please select at least one option',
  labelHeaderLevel: '3',                  // Makes title an h3 instead of default
  required: true,                         // checkboxGroupUI requires this in UI
  tile: true,
  labels: {
    vocRehab: {
      title: 'Vocational Rehabilitation',
      description: 'Job training and placement services'
    },
    education: {
      title: 'Education Benefits',
      description: 'Tuition assistance and monthly housing allowance'
    }
  }
}),
// Schema: checkboxGroupSchema(['vocRehab', 'education']) + required in schema too

// arrayBuilderItemFirstPageTitleUI - only for array builder item pages
...arrayBuilderItemFirstPageTitleUI({
  title: 'Employer information',
  nounSingular: 'employer',              // Required: used for alert messages
  lowerCase: true,                       // Optional: lowercase 'edit' title (default: true)
  hasMultipleItemPages: true,            // Optional: show multi-page guidance (default: true)
  description: 'Enter details about your employer.' // Optional: page description
})
```

### Common Configuration Properties

All web component pattern configuration properties come from the UIOptions type definition.

```javascript
🎛️ UNIVERSAL PROPERTIES (most patterns support):
{
  title: 'Field label',                   // Display label
  hint: 'Helper text',                    // Additional guidance shown below title
  description: 'Description text',        // Can be JSX component
  classNames: 'custom-css-class',         // Additional CSS classes for field
  errorMessages: {                        // Custom error messages object
    required: 'Custom required message',
    pattern: 'Custom validation message'
  },
  hideOnReview: true,                     // Hide field on review page
  hideIf: (formData) => condition,        // Conditional field visibility
  enableAnalytics: true,                  // Enable Google Analytics events
}

📋 HEADER LEVEL PROPERTIES (radio, checkbox, select patterns):
{
  labelHeaderLevel: '1',                  // '1' | '2' | '3' | '4' | '5' - heading level for field title
  labelHeaderLevelStyle: '3',             // Style header as different level than semantic level
}

🎯 HEADER LEVEL USAGE PATTERNS:
// Regular form: page title is <h3>, field titles should be <h4> or lower
radioUI({
  title: 'Are you married?',
  labelHeaderLevel: '4'                   // Makes title an <h4>
})

// Minimal form: page title is <h1>, field titles should be <h2> or lower
radioUI({
  title: 'Are you married?',
  labelHeaderLevel: '2',                  // Makes title an <h2>
  ifMinimalHeader: {
    labelHeaderLevel: '1'                 // Override: when no titleUI, field provides page title
  }
})

⚠️ IMPORTANT: Use labelHeaderLevel when field title serves as page title instead of titleUI

📋 SELECTION PATTERNS (radio, select, checkbox):
{
  title: 'Field label',                   // Display label
  hint: 'Helper text',                    // Additional guidance
  description: 'JSX description',         // Can include React components
  labels: {                               // Key-value label mapping
    key1: 'Display Label 1',
    key2: 'Display Label 2',
    key3: {                               // Object labels for tiles
      title: 'Title',
      description: 'Description text'
    }
  },
  tile: true,                             // Use tile layout (radio/checkbox only)
  labelHeaderLevel: '3',                  // Header level for tile titles
  disabled: (formData) => condition,      // Conditionally disable field
  updateUiSchema: (formData) => ({        // Dynamic UI updates
    'ui:title': `Updated title for ${formData.name}`,
    'ui:options': {
      hint: 'Updated hint text'
    }
  })
}

🚨 SPECIAL CASE - checkboxGroupUI:
{
  required: true,                         // checkboxGroupUI REQUIRES this in UI
  required: (formData) => condition,      // OR dynamic required function
  // Note: Still need required in schema too for checkboxGroupUI
}

� TEXT INPUT PATTERNS:
{
  title: 'Field label',                   // Display label
  hint: 'Helper text',                    // Additional guidance
  width: 'sm',                           // Input width: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  charcount: true,                        // Show character count (requires maxLength in schema)
  autocomplete: 'given-name',             // Browser autocomplete hint
  inputType: 'email',                     // Mobile keyboard type: 'email' | 'tel' | 'number' | 'search' | 'url'
  inputPrefix: '$',                       // Fixed prefix text
  inputSuffix: '.00',                     // Fixed suffix text
  maxLength: 100,                         // Character limit (also set in schema)
}

�📅 DATE PATTERNS:
{
  title: 'Date field label',              // Display label
  hint: 'Helper text for date',           // Additional guidance
  errorMessages: {                        // Custom error messages
    required: 'Please enter a date',
    pattern: 'Please enter a valid date'
  },
  monthYearOnly: true,                    // For month/year patterns only
  monthSelect: true,                      // Use dropdown for month instead of input
}

⚠️ IMPORTANT: Date patterns do NOT support minDate/maxDate - use validation functions instead

📁 FILE UPLOAD PATTERNS:
{
  title: 'Upload documents',              // Display label
  hint: 'Upload PDF, JPG, or PNG files', // Additional guidance
  accept: '.pdf,.jpg,.png',               // Allowed file types
  maxSize: 5242880,                       // Max file size in bytes (5MB)
  maxFiles: 5,                            // Max number of files
  buttonText: 'Choose files',             // Upload button text
  uploadDescription: 'Drag files here',   // Drop zone text
  additionalErrorMessage: 'Check file format' // Extra error guidance
}

🏠 ADDRESS PATTERNS:
{
  omit: ['street2', 'street3'],           // Hide optional fields
  required: ['street', 'city'],           // Override required fields (rarely needed)
  labels: {                               // Custom field labels (rarely needed)
    street: 'Street address',
    city: 'City or town'
  },
}

🔢 NUMBER/CURRENCY PATTERNS (rare usage):
{
  min: 0,                                 // Minimum value (currencyUI only)
  max: 999999,                            // Maximum value (currencyUI only)
  width: 'sm',                            // Input width
}

⚠️ IMPORTANT: textUI and numberUI do NOT support min/max - use currencyUI for validated numbers
⚠️ VALIDATION: All required/pattern validation goes in SCHEMA, not UI (except checkboxGroupUI)
⚠️ DYNAMIC: Use updateUiSchema for dynamic UI changes, updateSchema for dynamic validation
```
{
  min: 0,                                 // Minimum value (currencyUI only)
  max: 999999,                            // Maximum value (currencyUI only)
  width: 'sm',                            // Input width: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  currencySymbol: '$'                     // Currency symbol (currencyUI only)
}

⚠️ IMPORTANT: textUI and numberUI do NOT support min/max - use currencyUI for validated numbers
```

### Dynamic Configuration Examples

```javascript
// Configuration based on form data - CORRECTED
education: selectUI({
  title: 'Education level',
  labels: {
    'high-school': 'High school',
    'some-college': 'Some college',
    'bachelors': "Bachelor's degree",
    'military-training': 'Military training'
  }
}),
// Schema with conditional options (use schema properties, not UI options):
schema: {
  type: 'object',
  properties: {
    education: selectSchema(['high-school', 'some-college', 'bachelors', 'military-training'])
  }
},

// Conditional required validation - CORRECTED
income: currencyUI({
  title: 'Monthly income',
  hint: 'Enter your gross monthly income in dollars',
  min: 0,
  max: 999999
}),
// Schema with dynamic required:
schema: {
  type: 'object',
  properties: {
    income: currencySchema
  },
}

// Complex array builder configuration
const employerOptions = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: true,
  maxItems: 5,
  isItemIncomplete: (item, index, arrayData) => {
    // Complex validation logic
    if (!item?.name || !item?.address) return true;
    if (item.type === 'contract' && !item?.contractDetails) return true;
    return false;
  },
  text: {
    getItemName: (item, index) => {
      return item?.name || `Employer ${index + 1}`;
    },
    cardDescription: (item) => {
      const parts = [];
      if (item?.position) parts.push(item.position);
      if (item?.address?.city) parts.push(item.address.city);
      if (item?.dates?.start) parts.push(`Started ${item.dates.start}`);
      return parts.join(' • ');
    },
    summaryTitle: (arrayData) => {
      const count = arrayData?.length || 0;
      return count === 0
        ? 'Add your employment history'
        : `Review your ${count} employer${count !== 1 ? 's' : ''}`;
    }
  },
  uiOptions: {
    showSave: true,                       // Show save button on item pages
    reviewMode: false,                    // Enable review mode
    expandUnderReview: true,              // Expand items during review
    viewField: CustomEmployerView         // Custom component for display
  }
};
```

### Real-World Complex Pattern Usage

```javascript
// From real VA forms - correct syntax examples

// selectUI with key/value labels (from mockSelect.js)
educationLevel: selectUI({
  title: 'Select web component using key/value labels',
  hint: 'This is a hint',
  labels: {
    option1: 'Option 1',
    option2: 'Option 2'
  }
}),
// Schema: selectSchema(['option1', 'option2'])

// selectUI simple with string array (from mockSelect.js)
simpleSelect: selectUI('Select simple'),
// Schema: selectSchema(['Option 1', 'Option 2'])

// radioUI with disability compensation example (from mockRadio.js)
vaCompensationType: radioUI({
  title: 'Do you receive VA disability compensation?',
  description: CompensationTypeDescription,  // Can be JSX component
  labels: {
    lowDisability: 'Yes, for a service-connected disability rating of up to 40%',
    highDisability: 'Yes, for a service-connected disability rating of 50% or higher',
    none: 'No'
  }
}),
// Schema: radioSchema(['lowDisability', 'highDisability', 'none'])

// radioUI with tiled layout (from mockRadio.js)
tileCompensationType: radioUI({
  title: 'Do you receive VA disability compensation?',
  tile: true,
  labels: {
    lowDisability: 'Yes, for a service-connected disability rating of up to 40%',
    highDisability: 'Yes, for a service-connected disability rating of 50% or higher',
    none: 'No'
  }
}),

// checkboxGroupUI with at least one required (from mockCheckboxGroup.js)
requiredServices: checkboxGroupUI({
  title: 'Checkbox group - At least one required',
  required: true,
  description: (
    <va-additional-info trigger="JSX description">
      We need the Veteran's Social Security number or tax identification
      number to process the application when it's submitted online, but it's
      not a requirement to apply for the program.
    </va-additional-info>
  ),
  hint: 'This is hint text',
  labels: {
    hasA: 'Option A',
    hasB: 'Option B'
  }
}),
// Schema: checkboxGroupSchema(['hasA', 'hasB'])

// checkboxGroupUI with tiled layout and custom error (from mockCheckboxGroup.js)
tiledOptions: checkboxGroupUI({
  title: 'Checkbox group - Tiled with a custom error message',
  required: true,
  tile: true,
  labels: {
    hasA: {
      title: 'Option A',
      description: 'Select this option if you want to do option A'
    },
    hasB: {
      title: 'Option B',
      description: 'Select this option if you want to do option B'
    }
  },
  errorMessages: {
    required: 'Please select option A or option B'
  }
}),

// yesNoUI with custom labels (from mockRadio.js)
activeDuty: yesNoUI({
  title: 'Are you on active duty now?',
  description: 'This is a description',
  labels: {
    Y: 'Yes, the Veteran is on active duty now',
    N: 'No, the Veteran is not on active duty now'
  }
})
// Schema: yesNoSchema
```

---

## File Structure & Naming

### Standard Folder Structure
```
src/applications/{app-name}/
├── config/
│   └── form.js                    // Form configuration
├── pages/                         // Individual pages
│   ├── personalInformation.js     // Single page
│   ├── contactInformation.js      // Single page
│   └── employment.js              // Array builder pages
└── tests/
    ├── unit/
    │   ├── personalInformation.unit.spec.js
    │   └── contactInformation.unit.spec.js
    └── e2e/
        └── form-flow.cypress.spec.js
```

#### Alternative Folder Structure
```
src/applications/{app-name}/
├── config/
│   └── form.js
├── chapters/
└── tests/

### Naming Conventions
- **Single Pages**: `camelCase` matching the data field name
- **Array Pages**: `pluralNoun` (e.g., `employment.js`, `dependents.js`)
- **Page Paths**: `kebab-case` (e.g., `personal-information`, `contact-info`)
- **Test Files**: `{pageName}.unit.spec.jsx`, `{formName}.cypress.spec.js`

---

## Web Component Pattern Decision Tree

**📖 Complete pattern reference:** #file:web-component-patterns-catalog.json (49 total patterns)

### 1. Name Fields Decision Tree
```
Need name field?
├─ Just first + last name?
│  └─ Use: firstNameLastNameNoSuffixUI + firstNameLastNameNoSuffixSchema
├─ First + last + suffix?
│  └─ Use: firstNameLastNameUI + firstNameLastNameSchema
├─ First + middle + last?
│  └─ Use: fullNameNoSuffixUI + fullNameNoSuffixSchema
├─ First + middle + last + suffix?
│  └─ Use: fullNameUI + fullNameSchema
└─ Need maiden name too?
   └─ Use: fullNameWithMaidenNameUI + fullNameWithMaidenNameSchema
```

### 2. Contact Information Decision Tree
```
Need contact info?
├─ Email only?
│  ├─ For notifications? → emailToSendNotificationsUI + emailToSendNotificationsSchema
│  └─ General email? → emailUI + emailSchema
├─ Phone only?
│  ├─ US phone? → phoneUI + phoneSchema
│  └─ International? → internationalPhoneUI + internationalPhoneSchema
└─ Address?
   ├─ Include military checkbox? → addressUI + addressSchema
   └─ No military option? → addressNoMilitaryUI + addressNoMilitarySchema
```

### 3. Date Fields Decision Tree
```
Need date field?
├─ Birth date? → dateOfBirthUI + dateOfBirthSchema
├─ Death date? → dateOfDeathUI + dateOfDeathSchema
├─ Past/current date? → currentOrPastDateUI + currentOrPastDateSchema
├─ Month/year only? → currentOrPastMonthYearDateUI + currentOrPastMonthYearDateSchema
├─ Date range?
│  ├─ Full dates? → currentOrPastDateRangeUI + currentOrPastDateRangeSchema
│  └─ Month/year range? → currentOrPastMonthYearDateRangeUI + currentOrPastMonthYearDateRangeSchema
└─ Need month as digits? → currentOrPastDateDigitsUI + currentOrPastDateDigitsSchema
```

### 4. Input Fields Decision Tree
```
Need input field?
├─ Text input? → textUI + textSchema
├─ Long text/description? → textareaUI + textareaSchema
├─ Number input? → numberUI + numberSchema
├─ Currency/money? → currencyUI + currencySchema
├─ SSN/ID numbers?
│  ├─ SSN only? → ssnUI + ssnSchema
│  ├─ VA file number only? → vaFileNumberUI + vaFileNumberSchema
│  ├─ SSN or VA file? → ssnOrVaFileNumberUI + ssnOrVaFileNumberSchema
│  ├─ Service number? → serviceNumberUI + serviceNumberSchema
│  └─ ARN? → arnUI + arnSchema
└─ File upload? → fileInputUI + fileInputSchema
```

### 5. Selection Fields Decision Tree
```
Need selection field?
├─ Yes/No question? → yesNoUI + yesNoSchema
├─ Multiple choice (radio)? → radioUI + radioSchema
├─ Dropdown selection? → selectUI + selectSchema
├─ Single checkbox? → checkboxUI + checkboxSchema
├─ Multiple checkboxes? → checkboxGroupUI + checkboxGroupSchema
└─ Relationship to veteran?
   ├─ All relationships? → relationshipToVeteranUI + relationshipToVeteranSchema
   └─ Just spouse/child? → relationshipToVeteranSpouseOrChildUI + relationshipToVeteranSpouseOrChildSchema
```

### 6. Bank/Financial Information
```
Need financial info?
└─ Bank account? → bankAccountUI + bankAccountSchema
```

**🎯 Pattern Selection Tips:**
- Always pair uiSchema with matching schema (e.g., `emailUI` with `emailSchema`)
- Check #file:web-component-patterns-catalog.json for `examplesPath` to see usage examples
- For arrays, always use `arrayBuilderYesNoUI` instead of `yesNoUI`
- Use `titleUI` for page titles, `arrayBuilderItemFirstPageTitleUI` for array item first pages

**🔍 Quick Pattern Lookup:**
```javascript
// All web component patterns are imported from this single location:
import {
  titleUI,                                    // Page titles
  textUI, textSchema,                         // Text inputs
  emailUI, emailSchema,                       // Email fields
  yesNoUI, yesNoSchema,                       // Yes/No questions
  selectUI, selectSchema,                     // Dropdown selections
  radioUI, radioSchema,                       // Radio button groups
  checkboxGroupUI, checkboxGroupSchema,       // Multiple checkboxes
  // Array builder specific patterns:
  arrayBuilderYesNoUI, arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  // ... see catalog for all 49 UI/Schema pairs
} from 'platform/forms-system/src/js/web-component-patterns';
```
```

---

## Array vs Single Page Detection

**📖 For detailed array builder documentation, see:** #file:README.md (src/platform/forms-system/src/js/patterns/array-builder/README.md)

### Detecting Array Builder Pattern
**Look for these indicators in requirements:**

✅ **ARRAY PATTERN INDICATORS:**
- "List of..." / "Multiple..." / "Add another..."
- "Do you have any...?" followed by collection
- "Employment history", "Dependents", "Addresses", "Income sources"
- Maximum items mentioned (e.g., "up to 5 employers")
- Words: "employers", "jobs", "dependents", "children", "addresses", "incidents"

✅ **SINGLE PAGE INDICATORS:**
- Single instance data: "Your name", "Your address", "Date of birth"
- One-time questions: "Are you married?", "What is your income?"
- Contact information, demographics, single dates

### Array Builder Implementation Types

**🔄 REQUIRED ARRAY (required: true)**
- User MUST add at least one item
- Flow: `introPage` → `itemPage` → `summaryPage` → `itemPage` → `summaryPage`
- Starts with intro page, then goes directly to first item page
- Summary page only shown after first item is added

**📝 OPTIONAL ARRAY (required: false)**
- User can choose to add items or skip entirely
- Flow: `summaryPage` → `itemPage` → `summaryPage`
- Starts with summary page showing yes/no question
- Can also use `useLinkInsteadOfYesNo: true` or `useButtonInsteadOfYesNo: true`

### 🤖 AI Implementation Guidance: Critical Questions to Ask

**When implementing array builders, AI MUST ask these clarifying questions:**

**1. Array Flow Type:**
- "Is this array required (user MUST add at least one item) or optional (user can skip)?"
- This determines the entire navigation flow and starting page

**2. Array Builder Interface Style:**
- "Should this use the standard yes/no question format, or do you want 'Add [noun]' button/link instead?"
- Options: `default` (yes/no) | `useLinkInsteadOfYesNo: true` | `useButtonInsteadOfYesNo: true`

**When implementing forms with field titles, AI MUST ask:**

**3. Form Type:**
- "Is this a regular form or minimal form?"
- This affects heading levels: regular (h3→h4) vs minimal (h1→h2)

**4. Page Title Pattern:**
- "Does this page have a titleUI at the top, or does the field title serve as the page title?"
- If no titleUI: use `labelHeaderLevel: '1'` (minimal) or `labelHeaderLevel: '3'` (regular)
- If has titleUI: use `labelHeaderLevel: '2'` (minimal) or `labelHeaderLevel: '4'` (regular)

**Special handling for `ifMinimalHeader`:**
```javascript
// Pattern for fields that might serve as page title in minimal forms
radioUI({
  title: 'Which of these best describes you?',
  labelHeaderLevel: '3',           // Regular form default
  ifMinimalHeader: {
    labelHeaderLevel: '1'          // Override for minimal form when no titleUI
  }
})
```

⚠️ **IMPORTANT:** These questions prevent implementation errors and ensure proper accessibility/SEO.

### Array Builder Implementation

**📖 See detailed examples in:** #file:add-edit-form-array-builder-pages.prompt.md

```javascript
// ARRAY PATTERN: pages/employers.js
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI
} from '~/platform/forms-system/src/js/web-component-patterns';

const options = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: true, // or false for optional
  maxItems: 5,
  isItemIncomplete: item => !item?.name,
};

export const employersPages = arrayBuilderPages(options, pageBuilder => ({
  // Summary page with yes/no question
  employersSummary: pageBuilder.summaryPage({
    title: 'Review your employers',
    path: 'employers-summary',
    uiSchema: {
      'view:hasEmployers': arrayBuilderYesNoUI(options),
    },
    schema: {
      type: 'object',
      properties: {
        'view:hasEmployers': arrayBuilderYesNoSchema,
      },
    },
  }),

  // Individual item pages
  employerName: pageBuilder.itemPage({
    title: 'Employer name',
    path: 'employers/:index/name',
    uiSchema: {
      ...arrayBuilderItemFirstPageTitleUI({
        title: 'Employer name',
        nounSingular: options.nounSingular,
      }),
      name: textUI('Employer name'),
    },
    schema: {
      type: 'object',
      properties: {
        name: textSchema,
      },
      required: ['name'],
    },
  }),
}));
```

### Single Page Implementation

**📖 See basic page instructions in:** #file:add-edit-form-page-default.prompt.md

```javascript
// SINGLE PATTERN: pages/personalInformation.js
import { titleUI, firstNameLastNameNoSuffixUI, firstNameLastNameNoSuffixSchema } from '~/platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Your personal information'),
    name: firstNameLastNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      name: firstNameLastNameNoSuffixSchema,
    },
    required: ['name'],
  },
};
```

### Real Application Examples

**📖 Browse 132 real applications in:** #file:manifest-catalog.json

**Common Array Builder Applications:**
- `src/applications/dependents/686c-674` - Add/remove dependents
- `src/applications/disability-benefits/all-claims` - List disabilities
- `src/applications/pensions` - Income sources, dependents
- `src/applications/hca` - Insurance providers, dependents

**Common Single Page Applications:**
- `src/applications/burials-ez` - Burial allowance (mostly single pages)
- `src/applications/simple-forms/*` - Simple single-purpose forms
- `src/applications/edu-benefits/*` - Education benefit applications

---

## 35+ Real-World Examples

**📖 References:**
- **Web Component Patterns**: #file:web-component-patterns-catalog.json
- **Real Applications**: #file:manifest-catalog.json (see 132 applications for more examples)
- **Array Builder Guide**: #file:README.md (src/platform/forms-system/src/js/patterns/array-builder/README.md)

### Example 1: Basic Personal Information
**When you see:** "Enter your name"
**Use:** `firstNameLastNameNoSuffixUI` + `firstNameLastNameNoSuffixSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Your name'),
    name: firstNameLastNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      name: firstNameLastNameNoSuffixSchema,
    },
    required: ['name'],
  },
};
```

### Example 2: Contact Email
**When you see:** "Email address for notifications"
**Use:** `emailToSendNotificationsUI` + `emailToSendNotificationsSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Contact information'),
    email: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      email: emailToSendNotificationsSchema,
    },
    required: ['email'],
  },
};
```

### Example 3: Yes/No Question
**When you see:** "Are you currently employed?"
**Use:** `yesNoUI` + `yesNoSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Employment status'),
    isEmployed: yesNoUI('Are you currently employed?'),
  },
  schema: {
    type: 'object',
    properties: {
      isEmployed: yesNoSchema,
    },
    required: ['isEmployed'],
  },
};
```

### Example 4: Date of Birth
**When you see:** "Date of birth" / "When were you born?"
**Use:** `dateOfBirthUI` + `dateOfBirthSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Personal information'),
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['dateOfBirth'],
  },
};
```

### Example 5: Phone Number
**When you see:** "Phone number" (US)
**Use:** `phoneUI` + `phoneSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Contact information'),
    phone: phoneUI('Phone number'),
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
    },
    required: ['phone'],
  },
};
```

### Example 6: Current Address
**When you see:** "Current address" / "Mailing address"
**Use:** `addressUI` + `addressSchema` (includes military option)
```javascript
export default {
  uiSchema: {
    ...titleUI('Your address'),
    address: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema(),
    },
    required: ['address'],
  },
};
```

### Example 7: Employment History (Array)
**When you see:** "List your employers" / "Employment history"
**Use:** Array builder pattern
```javascript
// This goes in pages/employers.js - see Array Builder section above
```

### Example 8: Income Amount
**When you see:** "Monthly income" / "Salary" / "$amount"
**Use:** `currencyUI` + `currencySchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Income information'),
    monthlyIncome: currencyUI('Monthly income'),
  },
  schema: {
    type: 'object',
    properties: {
      monthlyIncome: currencySchema,
    },
    required: ['monthlyIncome'],
  },
};
```

### Example 9: SSN or VA File Number
**When you see:** "Social Security number or VA file number"
**Use:** `ssnOrVaFileNumberUI` + `ssnOrVaFileNumberSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Identification'),
    veteranId: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranId: ssnOrVaFileNumberSchema,
    },
    required: ['veteranId'],
  },
};
```

### Example 10: Multiple Choice Question
**When you see:** "What is your relationship to the veteran?"
**Use:** `relationshipToVeteranUI` + `relationshipToVeteranSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Relationship to veteran'),
    relationship: relationshipToVeteranUI(),
  },
  schema: {
    type: 'object',
    properties: {
      relationship: relationshipToVeteranSchema,
    },
    required: ['relationship'],
  },
};
```

### Example 11: Date Range
**When you see:** "Employment dates" / "From date to date"
**Use:** `currentOrPastDateRangeUI` + `currentOrPastDateRangeSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Employment dates'),
    employmentDates: currentOrPastDateRangeUI(),
  },
  schema: {
    type: 'object',
    properties: {
      employmentDates: currentOrPastDateRangeSchema,
    },
    required: ['employmentDates'],
  },
};
```

### Example 12: Bank Account Information
**When you see:** "Direct deposit" / "Bank account"
**Use:** `bankAccountUI` + `bankAccountSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Bank information'),
    bankAccount: bankAccountUI(),
  },
  schema: {
    type: 'object',
    properties: {
      bankAccount: bankAccountSchema(),
    },
    required: ['bankAccount'],
  },
};
```

### Example 13: File Upload
**When you see:** "Upload documents" / "Attach files"
**Use:** `fileInputUI` + `fileInputSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Supporting documents'),
    documents: fileInputUI('Upload your documents'),
  },
  schema: {
    type: 'object',
    properties: {
      documents: fileInputSchema,
    },
  },
};
```

### Example 14: Number Input
**When you see:** "How many..." / "Number of dependents"
**Use:** `numberUI` + `numberSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Dependents'),
    numberOfDependents: numberUI('Number of dependents'),
  },
  schema: {
    type: 'object',
    properties: {
      numberOfDependents: numberSchema,
    },
    required: ['numberOfDependents'],
  },
};
```

### Example 15: Text Area for Long Descriptions
**When you see:** "Describe..." / "Additional information" / "Comments"
**Use:** `textareaUI` + `textareaSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Additional information'),
    description: textareaUI('Describe your situation'),
  },
  schema: {
    type: 'object',
    properties: {
      description: textareaSchema,
    },
  },
};
```

### Example 16: Dropdown Selection
**When you see:** "Select state" / "Choose option from list"
**Use:** `selectUI` + `selectSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Location'),
    state: selectUI('State'),
  },
  schema: {
    type: 'object',
    properties: {
      state: selectSchema(['CA', 'NY', 'TX', 'FL']),
    },
    required: ['state'],
  },
};
```

### Example 17: Single Checkbox
**When you see:** "I agree to..." / "Check if applies"
**Use:** `checkboxUI` + `checkboxSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Agreement'),
    agree: checkboxUI('I agree to the terms'),
  },
  schema: {
    type: 'object',
    properties: {
      agree: checkboxSchema,
    },
    required: ['agree'],
  },
};
```

### Example 18: Multiple Checkboxes
**When you see:** "Select all that apply"
**Use:** `checkboxGroupUI` + `checkboxGroupSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Services'),
    services: checkboxGroupUI('Select services you need'),
  },
  schema: {
    type: 'object',
    properties: {
      services: checkboxGroupSchema(['Health', 'Education', 'Housing']),
    },
  },
};
```

### Example 19: International Phone
**When you see:** "International phone number" / "Country code"
**Use:** `internationalPhoneUI` + `internationalPhoneSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Contact information'),
    internationalPhone: internationalPhoneUI(),
  },
  schema: {
    type: 'object',
    properties: {
      internationalPhone: internationalPhoneSchema,
    },
  },
};
```

### Example 20: Month/Year Date
**When you see:** "When did you start?" (month/year only)
**Use:** `currentOrPastMonthYearDateUI` + `currentOrPastMonthYearDateSchema`
```javascript
export default {
  uiSchema: {
    ...titleUI('Start date'),
    startDate: currentOrPastMonthYearDateUI(),
  },
  schema: {
    type: 'object',
    properties: {
      startDate: currentOrPastMonthYearDateSchema,
    },
    required: ['startDate'],
  },
};
```

### Example 21-35: Array Builder Variations

**📖 For complete array builder examples, see:** #file:README.md (src/platform/forms-system/src/js/patterns/array-builder/README.md)

**Example 21: Optional Dependents (Link Instead of Yes/No)**
```javascript
// Array with useLinkInsteadOfYesNo: true
const options = {
  arrayPath: 'dependents',
  nounSingular: 'dependent',
  nounPlural: 'dependents',
  required: false, // Optional array
  useLinkInsteadOfYesNo: true, // Use link instead of yes/no
  maxItems: 10,
  text: {
    summaryAddLinkText: (props) => {
      return props.itemData?.length ? 'Add another dependent' : 'Add a dependent';
    },
  },
};
```

**Example 22: Required Employment History**
```javascript
// Array with required: true (must add at least one)
const options = {
  arrayPath: 'employment',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: true, // Must have at least one
  maxItems: 5,
  isItemIncomplete: item => !item?.name || !item?.dates,
};
```

**Example 23: Button Instead of Link**
```javascript
// Array with button instead of yes/no or link
const options = {
  arrayPath: 'medications',
  nounSingular: 'medication',
  nounPlural: 'medications',
  required: false,
  useButtonInsteadOfYesNo: true, // Use button instead
  maxItems: 20,
  text: {
    reviewAddButtonText: (props) => {
      return props.itemData?.length ? 'Add another medication' : 'Add a medication';
    },
  },
};
```

**Example 24: Complex Multi-Page Items**
```javascript
// When each item needs multiple pages (name, address, dates, etc.)
const options = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: true,
  maxItems: 3,
  isItemIncomplete: item => !item?.name || !item?.address || !item?.dates,
  text: {
    getItemName: (item, index) => item.name || `Employer ${index + 1}`,
    cardDescription: item => `${item?.address?.city}, ${item?.address?.state}`,
  },
};

export const employersPages = arrayBuilderPages(options, pageBuilder => ({
  employersSummary: pageBuilder.summaryPage({ /* ... */ }),
  employerName: pageBuilder.itemPage({ /* first page */ }),
  employerAddress: pageBuilder.itemPage({ /* second page */ }),
  employerDates: pageBuilder.itemPage({ /* third page */ }),
}));
```

**Example 25-35: Form Config Integration Examples**
```javascript
// config/form.js integration patterns
const formConfig = {
  chapters: {
    // Single pages chapter
    personalInfo: {
      title: 'Personal Information',
      pages: {
        name: {
          path: 'name',
          title: 'Your name',
          uiSchema: personalInformation.uiSchema,
          schema: personalInformation.schema,
        },
        contact: {
          path: 'contact',
          title: 'Contact information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
      },
    },

    // Array pages chapter
    employment: {
      title: 'Employment History',
      pages: employmentPages, // Imported from pages/employment.js
    },
  },
};
```

---

## Testing Requirements

### Unit Test Template
Every page needs a unit test in `tests/unit/{pageName}.unit.spec.js`:

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const mockStore = createStore(() => ({}));

describe('Personal Information Page', () => {
  it('should render page title', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={formConfig.chapters.personalInfo.pages.personalInformation.schema}
          uiSchema={formConfig.chapters.personalInfo.pages.personalInformation.uiSchema}
          data={{}}
        />
      </Provider>
    );

    expect(screen.getByText('Your personal information')).to.exist;
  });

  it('should render first name field', () => {
    render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={formConfig.chapters.personalInfo.pages.personalInformation.schema}
          uiSchema={formConfig.chapters.personalInfo.pages.personalInformation.uiSchema}
          data={{}}
        />
      </Provider>
    );

    expect(screen.getByLabelText(/first name/i)).to.exist;
  });

  it('should render last name field', () => {
    render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={formConfig.chapters.personalInfo.pages.personalInformation.schema}
          uiSchema={formConfig.chapters.personalInfo.pages.personalInformation.uiSchema}
          data={{}}
        />
      </Provider>
    );

    expect(screen.getByLabelText(/last name/i)).to.exist;
  });

  it('should show validation error for required fields', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={formConfig.chapters.personalInfo.pages.personalInformation.schema}
          uiSchema={formConfig.chapters.personalInfo.pages.personalInformation.uiSchema}
          data={{}}
          onSubmit={() => {}}
        />
      </Provider>
    );

    // Trigger validation by submitting
    const continueButton = screen.getByText('Continue');
    continueButton.click();

    expect(screen.getByText(/this field is required/i)).to.exist;
  });
});
```

### Cypress Test Integration
Add page tests to main form Cypress file `tests/e2e/{formName}.cypress.spec.js`:

```javascript
describe('Form Flow', () => {
  it('should complete personal information page', () => {
    cy.visit('/form-url');

    // Personal information page
    cy.get('[data-testid="personal-information-page"]').should('be.visible');
    cy.get('h1').should('contain', 'Your personal information');

    // Fill required fields
    cy.get('input[name="root_name_first"]').type('John');
    cy.get('input[name="root_name_last"]').type('Doe');

    // Continue to next page
    cy.get('button[type="submit"]').click();

    // Verify navigation
    cy.url().should('include', '/contact');
  });

  it('should validate required fields on personal information page', () => {
    cy.visit('/form-url/personal-information');

    // Try to continue without filling required fields
    cy.get('button[type="submit"]').click();

    // Should show validation errors
    cy.get('[role="alert"]').should('contain', 'This field is required');

    // Should not navigate away
    cy.url().should('include', '/personal-information');
  });
});
```

### Running Tests
```bash
# Run unit tests
yarn test:unit --grep "Personal Information"

# Run Cypress tests headless
yarn cy:run --spec "src/applications/{app-name}/tests/e2e/*.spec.js"

# Run Cypress tests interactively
yarn cy:open
```

---

## Complete Checklist

### ✅ For Every New Page:

**1. Create Page File**
- [ ] Create `pages/{pageName}.js`
- [ ] Use correct web component patterns
- [ ] Include `titleUI` in uiSchema
- [ ] Define both `uiSchema` and `schema`
- [ ] Add required field validation

**2. Update Form Config**
- [ ] Import page in `config/form.js`
- [ ] Add to correct chapter
- [ ] Set correct `path` and `title`
- [ ] Reference page's `uiSchema` and `schema`

**3. Array Detection**
- [ ] If collecting multiple items, use array builder pattern
- [ ] Use `arrayBuilderPages` function
- [ ] Use `arrayBuilderYesNoUI` for summary
- [ ] Use `arrayBuilderItemFirstPageTitleUI` for first page
- [ ] Use `arrayBuilderItemSubsequentPageTitleUI` for other pages

**4. Write Unit Tests**
- [ ] Create `tests/unit/{pageName}.unit.spec.js`
- [ ] Test page title renders
- [ ] Test all fields render
- [ ] Test required field validation
- [ ] Test form submission

**5. Add Cypress Tests**
- [ ] Add page test to main form Cypress file
- [ ] Test page navigation
- [ ] Test field interactions
- [ ] Test validation errors
- [ ] Test successful form completion

**6. Web Component Pattern Validation**
- [ ] Verify pattern matches requirements (use decision trees above)
- [ ] Check import paths are correct
- [ ] Ensure schema and uiSchema are paired correctly
- [ ] Validate required fields are marked in schema

**7. Final Verification**
- [ ] Run unit tests: `yarn test:unit --grep "{PageName}"`
- [ ] Run Cypress tests: `yarn cy:run`
- [ ] Start development: `yarn watch`
- [ ] Manually test page in browser
- [ ] Verify accessibility with screen reader
- [ ] Check mobile responsive layout

### ✅ For Array Builder Pages:

**Additional Checks**
- [ ] `arrayPath` matches data structure
- [ ] `nounSingular` and `nounPlural` are correct
- [ ] `isItemIncomplete` function checks all required fields
- [ ] `maxItems` is reasonable (usually 5-20)
- [ ] Summary page uses `arrayBuilderYesNoUI`
- [ ] Item pages use proper title patterns
- [ ] Export uses `arrayBuilderPages` function

---

## Quick Reference: Most Common Patterns

**📖 Complete reference:** #file:web-component-patterns-catalog.json (49 patterns total)

| Use Case | uiSchema + schema | Notes |
|----------|----------|-------|
| First + Last Name | `firstNameLastNameNoSuffixUI()` + `firstNameLastNameNoSuffixSchema` | Most common name pattern |
| Email for notifications | `emailToSendNotificationsUI()` + `emailToSendNotificationsSchema` | Preferred for single email field |
| Yes/No question | `yesNoUI('Question?')` + `yesNoSchema` | Use `arrayBuilderYesNoUI` for arrays |
| Date of birth | `dateOfBirthUI()` + `dateOfBirthSchema` | Has built-in validation |
| Phone number | `phoneUI('Phone')` + `phoneSchema` | US phone numbers |
| Address | `addressUI()` + `addressSchema()` | Includes military checkbox |
| Currency/money | `currencyUI('Amount')` + `currencySchema` | Auto-formats currency |
| SSN or VA file | `ssnOrVaFileNumberUI()` + `ssnOrVaFileNumberSchema` | Either/or validation |
| Text input | `textUI('Label')` + `textSchema` | Basic text field |
| Multiple items | Array builder pattern | Array builder pattern | See #file:README.md |

**🚨 Array Builder Special UI/Schema Patterns:**
| Use Case | uiSchema + schema | Notes |
|----------|----------|-------|
| Array summary page | `arrayBuilderYesNoUI(options)` + `arrayBuilderYesNoSchema` | NOT `yesNoUI` |
| Array first item page | `arrayBuilderItemFirstPageTitleUI({...})` + (no schema) | NOT `titleUI` |
| Array other pages | `arrayBuilderItemSubsequentPageTitleUI(...)` + (no schema) | NOT `titleUI` |

Remember: Always pair the correct uiSchema with its matching schema, and always include `titleUI` at the top of single pages!
