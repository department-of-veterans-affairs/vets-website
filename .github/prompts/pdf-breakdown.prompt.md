# Instructions for Agent when analyzing PDF forms and creating Product Requirements Documents (PRDs) for VA.gov forms.

## Purpose
Break down a PDF form into structured context for creating digital forms on VA.gov, including metadata extraction, chapter organization, page structure, and field identification.

## Process Overview
<process>

<workspace-setup>
<find-form-path>
- Use `/src/applications/manifest-catalog.json` to find the form. If there is any ambiguity, ask the user for more details.
- If no context is provided, search for the nearest `manifest.json` file to find the application root.
</find-form-path>
<no-form-path-found>
- If it is for a new form, suggest a new folder name based on existing patterns in `/src/applications/manifest-catalog.json`.
- Confirm with the user before proceeding if it is a new form.
- `yarn new:app` is the command to create a new form.
- After creating a new form, run `yarn generate-manifest-catalog` to update the `manifest-catalog.json`.
</no-form-path-found>
<create-prd>
- [ ] Create {appFolder}/prd.md for the PRD documentation.
</create-prd>>
</workspace-setup>

<pdf-analysis>
- Analyze the PDF form structure, layout, and content
- Extract form metadata (title, form number, OMB info, etc.)
- Identify logical chapters and page groupings, preferring 1 thing per page, or just a few things per page
- Catalog all form fields with their types and requirements
- Note any special instructions or conditional logic
</pdf-analysis>

<prd-creation>
- Create a comprehensive PRD outlining the digital form structure
- Map PDF sections to VA.gov form chapters and pages
- Specify web component patterns for each field type
- Document validation rules and conditional logic
- Include accessibility considerations
</prd-creation>

</process>

## PDF Analysis Structure

### Form Metadata Extraction
Extract and document the following information:
- **Form Number**: Official VA form number (e.g., "VA Form 21-526EZ")
- **Form Title**: Full descriptive title
- **OMB Number**: Office of Management and Budget control number
- **Expiration Date**: When the form expires
- **Respondent Burden**: Estimated completion time
- **Purpose**: What benefit or service the form provides
- **Revision Date**: When the form was last updated
- **Page Count**: Total number of pages in the PDF

### Chapter and Section Organization
Analyze the PDF to identify logical groupings:

<examples>

<chapter-example>
```
Chapter 1: Veteran Information
├── Page 1: Personal Information
│   ├── Name fields (first, middle, last)
│   ├── Social Security Number
│   ├── Date of Birth
│   └── Contact Information
├── Page 2: Military Service History
│   ├── Service dates
│   ├── Branch of service
│   ├── Service number
│   └── Discharge type
```
</chapter-example>

<section-example>
```
Section A: Claimant Information
├── Subsection A1: Personal Details
├── Subsection A2: Address Information
├── Subsection A3: Phone and Email

Section B: Claim Details
├── Subsection B1: Type of Claim
├── Subsection B2: Conditions Being Claimed
├── Subsection B3: Supporting Evidence
```
</section-example>

</examples>

### Field Cataloging
For each field identified in the PDF, document:

#### Field Properties
- **Field Name**: Descriptive name for the field
- **Field Type**: Input type (text, select, checkbox, radio, date, etc.)
- **Field Label**: Exact text label from PDF
- **Required Status**: Whether the field is mandatory
- **Validation Rules**: Format requirements, character limits, etc.
- **Web Component Pattern**: Corresponding VA.gov web component from patterns catalog
- **Conditional Logic**: When the field appears/disappears based on other inputs

#### Field Type Mapping
<field-mapping>
```
PDF Field Type → VA.gov Web Component Pattern
─────────────────────────────────────────────
Text Box → textUI/textSchema
Dropdown → selectUI/selectSchema
Checkbox → checkboxUI/checkboxSchema
Radio Buttons → radioUI/radioSchema
Date Field → dateUI/dateSchema
File Upload → fileUploadUI/fileUploadSchema
Yes/No → yesNoUI/yesNoSchema
Currency → currencyUI/currencySchema
Phone → phoneUI/phoneSchema
Email → emailUI/emailSchema
SSN → ssnUI/ssnSchema
```
</field-mapping>

## PRD Creation Guidelines

### Prerequisites Checklist
Before creating the PRD, ensure you have:
- [ ] Complete form metadata extracted
- [ ] All pages and sections identified and organized
- [ ] Every field cataloged with properties
- [ ] Conditional logic and dependencies mapped
- [ ] Validation rules documented
- [ ] Accessibility considerations noted
- [ ] Integration points identified (prefill, save-in-progress, etc.)

### PRD Structure Template

```markdown
# Product Requirements Document: [Form Number] - [Form Title]

## Executive Summary
Brief description of the form's purpose and scope.

## Form Metadata
- **Form Number**: [e.g., VA Form 21-526EZ]
- **Title**: [Full form title]
- **OMB Number**: [e.g., 2900-0747]
- **Expiration Date**: [MM/DD/YYYY]
- **Respondent Burden**: [X minutes]
- **Benefit Type**: [e.g., Disability Compensation]

## Technical Requirements
- **Platform**: VA.gov forms system
- **Framework**: React + RJSF + Redux
- **Accessibility**: WCAG 2.2 AA compliance
- **Authentication**: Required/Optional
- **Save-in-Progress**: Enabled/Disabled
- **Prefill**: Available data sources

## Form Structure

### Chapter 1: [Chapter Name]
**Purpose**: [Brief description]

#### Page 1.1: [Page Name]
**URL**: `/form-number/page-name`
**Title**: "[Page Title]"
**Description**: [Brief description of page purpose]

**Fields**:
- **Field Name**: [field-name]
  - Type: [web component pattern]
  - Label: "[Exact label text]"
  - Required: Yes/No
  - Validation: [rules]
  - Conditional: [logic if any]

#### Page 1.2: [Next Page Name]
[Continue pattern...]

### Chapter 2: [Next Chapter Name]
[Continue pattern...]

## Conditional Logic
Document all conditional field display and validation rules:
- If [condition], then show/hide [fields]
- If [value] is selected, then require [other fields]

## Data Schema
Outline the JSON schema structure for form data.

## Integration Points
- **Prefill Sources**: [List data sources]
- **Submission Endpoint**: [API endpoint]
- **Document Upload**: [Requirements]
- **Notification System**: [Email/text preferences]

## Accessibility Requirements
- Screen reader compatibility
- Keyboard navigation support
- Color contrast compliance
- Error messaging standards
- Focus management

## Success Metrics
- Form completion rate
- Error rate by field
- Time to completion
- User satisfaction scores
```

### Steps for PDF Analysis and PRD Creation

1. **Initial PDF Review**: Scan the entire PDF to understand overall structure and complexity
2. **Metadata Extraction**: Gather all form identification and administrative information
3. **Structural Analysis**: Identify natural chapter and page breaks
4. **Field Inventory**: Create comprehensive list of all form fields with properties
5. **Logic Mapping**: Document conditional relationships between fields
6. **Component Mapping**: Match PDF field types to VA.gov web component patterns
7. **PRD Drafting**: Create structured PRD following the template
8. **Technical Review**: Validate against VA.gov forms system capabilities
9. **Accessibility Review**: Ensure all requirements are captured
10. **Stakeholder Review**: Present PRD for feedback and approval

## Output Deliverables

### Analysis Summary
Provide a high-level breakdown including:
- Form complexity assessment (simple/moderate/complex)
- Estimated development effort
- Key technical challenges
- Recommended implementation approach

### Detailed PRD
Complete product requirements document following the template structure.

### Implementation Roadmap
Suggested phased approach for development:
- Phase 1: Core form structure and basic fields
- Phase 2: Complex conditional logic and validations
- Phase 3: Integration points and advanced features
- Phase 4: Testing and accessibility optimization

## Quality Assurance
- Verify all PDF content is captured in the PRD
- Ensure web component patterns are correctly mapped
- Validate conditional logic is completely documented
- Confirm accessibility requirements are addressed
- Review for consistency with VA.gov standards
