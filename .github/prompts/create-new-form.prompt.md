# New Form Creation Instructions

This guide provides instructions for creating new VA.gov forms using the Yeoman generator with proper context gathering and command generation.

## Overview

This process generates a complete VA.gov form application using the `@department-of-veterans-affairs/vets-website` Yeoman generator. The generator creates all necessary files, configuration, and basic structure for a new form.

## Context Gathering

Before generating the command, gather the following information:

### Required Information
- **appName**: Descriptive name for the form (e.g., "Burial Allowance Application")
- **folderName**: Directory name in `src/applications/` (kebab-case, e.g., "burial-allowance")
- **entryName**: Webpack entry name for the application (should match folderName)
- **rootUrl**: URL path for the form (starts with "/", e.g., "/burial-allowance")
- **formNumber**: Official form number (e.g., "21P-530")
- **benefitDescription**: Brief description of what the form provides (e.g., "burial benefits")

### Optional Information with Defaults
- **slackGroup**: Slack group for notifications (default: "none")
- **contentLoc**: Path to content repository (default: "../vagov-content")
- **trackingPrefix**: Analytics tracking prefix (default: derived from form)
- **respondentBurden**: Estimated completion time in minutes (default: "30")
- **ombNumber**: OMB control number if applicable (default: none)
- **expirationDate**: Form expiration date in MM/DD/YYYY format (default: future date)
- **usesVetsJsonSchema**: Whether form uses vets-json-schema (default: false)
- **usesMinimalHeader**: Whether to use minimal header layout (default: true)
- **templateType**: Form template type (valid values: "WITH_1_PAGE", "WITH_4_PAGES") (default: "WITH_1_PAGE")

## Command Generation

### Basic Command Structure
```bash
yarn new:app \
  --force \
  --appName="[APP_NAME]" \
  --folderName="[FOLDER_NAME]" \
  --entryName="[ENTRY_NAME]" \
  --rootUrl="/[ROOT_URL]" \
  --isForm=true \
  --slackGroup="[SLACK_GROUP]" \
  --contentLoc="../vagov-content" \
  --formNumber="[FORM_NUMBER]" \
  --trackingPrefix="[TRACKING_PREFIX]" \
  --respondentBurden="[MINUTES]" \
  --ombNumber="[OMB_NUMBER]" \
  --expirationDate="[MM/DD/YYYY]" \
  --benefitDescription="[DESCRIPTION]" \
  --usesVetsJsonSchema=[true/false] \
  --usesMinimalHeader=[true/false] \
  --templateType="WITH_1_PAGE"
```

### Example Commands

#### Example 1: Burial Benefits Form
```bash
yarn new:app \
  --force \
  --appName="Burial Allowance Application" \
  --folderName="burial-allowance" \
  --entryName="burial-allowance" \
  --rootUrl="/burial-allowance" \
  --isForm=true \
  --slackGroup="@benefits-team" \
  --contentLoc="../vagov-content" \
  --formNumber="21P-530" \
  --trackingPrefix="burials-530-" \
  --respondentBurden="30" \
  --ombNumber="2900-0797" \
  --expirationDate="12/31/2026" \
  --benefitDescription="burial benefits" \
  --usesVetsJsonSchema=false \
  --usesMinimalHeader=true \
  --templateType="WITH_1_PAGE"
```

#### Example 2: Simple Form with Minimal Configuration
```bash
yarn new:app \
  --force \
  --appName="Address Change Request" \
  --folderName="address-change" \
  --entryName="address-change" \
  --rootUrl="/address-change" \
  --isForm=true \
  --slackGroup="none" \
  --formNumber="22-8794" \
  --benefitDescription="address update services" \
  --usesMinimalHeader=true \
  --templateType="WITH_1_PAGE"
```

#### Example 3: Complex Multi-Chapter Form
```bash
yarn new:app \
  --force \
  --appName="Education Benefits Application" \
  --folderName="education-benefits-1990" \
  --entryName="education-benefits-1990" \
  --rootUrl="/education/apply-for-education-benefits/application/1990" \
  --isForm=true \
  --slackGroup="@education-team" \
  --contentLoc="../vagov-content" \
  --formNumber="22-1990" \
  --trackingPrefix="edu-1990-" \
  --respondentBurden="45" \
  --ombNumber="2900-0154" \
  --expirationDate="06/30/2027" \
  --benefitDescription="education benefits" \
  --usesVetsJsonSchema=true \
  --usesMinimalHeader=false \
  --templateType="WITH_4_PAGES"
```

## Parameter Details

### Core Parameters
- **--force**: Overwrites existing files without prompting
- **--isForm=true**: Indicates this is a form application (required)

### Application Identity
- **--appName**: Display name shown to users
- **--folderName**: Must be unique in `src/applications/`
- **--entryName**: Used for webpack bundling, should match folderName
- **--rootUrl**: URL path, must start with "/" and be unique

### Form Metadata
- **--formNumber**: Official government form number
- **--benefitDescription**: Brief description for user-facing text
- **--respondentBurden**: Estimated completion time (used for OMB compliance)
- **--ombNumber**: Office of Management and Budget control number
- **--expirationDate**: When form expires (MM/DD/YYYY format)

### Technical Configuration
- **--usesVetsJsonSchema**: true if form schema comes from vets-json-schema
- **--usesMinimalHeader**: true for simplified header/footer layout
- **--templateType**: "WITH_1_PAGE" or "WITH_4_PAGES"

### Development Configuration
- **--slackGroup**: Team notification channel (use "none" if no team)
- **--contentLoc**: Path to content repository for static content
- **--trackingPrefix**: Google Analytics event prefix

## After Generation

After running the generator, you will have:

1. **Application structure** in `src/applications/[folderName]/`
2. **Basic form configuration** in `config/form.js`
3. **Entry point** in `app-entry.jsx`
4. **Initial page** in `pages/`
5. **Manifest entry** added to application manifest
6. **Package.json updates** for the new entry

## Next Steps

- **Review generated files** for accuracy

## Common Patterns

### URL Structure Patterns
- Simple forms: `/[form-name]`
- Benefit applications: `/[benefit-type]/apply-for-[benefit-name]/application/[form-number]`
- Account management: `/account/[action-name]`

### Folder Naming Patterns
- Kebab-case: "burial-allowance", "education-benefits"
- Include form numbers: "form-21p-530", "form-22-1990"
- Descriptive but concise: "address-change", "direct-deposit"

### Tracking Prefix Patterns
- Format: "[category]-[form-number]-"
- Examples: "burials-530-", "edu-1990-", "health-10-10ez-"

## Troubleshooting

### Common Issues
1. **Folder already exists**: Use `--force` flag or choose different folderName
2. **Invalid URL path**: Ensure rootUrl starts with "/" and is unique