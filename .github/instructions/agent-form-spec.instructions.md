---
applyTo: "**/src/applications/**/agent/form-spec.md"
---
# Instructions for Writing a Form Spec in agent/form-spec.md

The form-spec.md file is used to define the structure and metadata for a form in the application for context for agent tasks. It should include all necessary details to generate the form correctly.

## Sections
1. **Metadata**: General information about the form - used for input to yeoman generator
    - App name (required)
    - Form number (required)
    - Root URL (required)
    - Whether it uses vets-json-schema (optional - default is false)
    - Whether it uses minimal header (optional - default is false)
    - Tracking prefix (optional - default is empty)
    - Respondent burden (in minutes) (optional - default is 0)
    - OMB number (optional - default is empty)
    - Expiration date (optional - default is empty)
    - Benefit description (required)
    - Slack group (optional - default is empty)
    - Template type (required; e.g., WITH_1_PAGE, WITH_4_PAGES)
2. **Chapters & Pages**: Structure of the form, including chapters and pages with their fields.
    - Each chapter should have a title and a list of pages.
    - Each page should have a title and a list of fields with their identifiers and descriptions.
    - Fields must be valid somethingUI from [web-component-pattern-catalog.md](src/platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.md).
    - Use standardized address objects for address fields where applicable.
    - Include if a field is required, specific error messages, validation rules or formats for fields (e.g., date formats, phone number formats).
3. **Notes / Decisions**: Any additional notes or decisions made during the form

Example structure:
```markdown
# 📝 Form Spec

## 🧾 Metadata

- **App name:** 21P-530 Burials benefits form
- **Form number:** 21P-530
- **Root URL:** /burials
- **Uses vets-json-schema:** No
- **Uses minimal header:** No
- **Tracking prefix:** burials-530-
- **Respondent burden (minutes):** 30
- **OMB number:** 2900-0797
- **Expiration date:** 12/31/2026
- **Benefit description:** Burials benefits
- **Slack group:** none
- **Template type:** WITH_1_PAGE

---

## 🗂️ Chapters & Pages

### Chapter: Applicant Information

#### Page: Personal Details (Required)
- `fullName`: Full name of Applicant
  - Required: true
  - Web component: `fullNameUI`
  - Notes:
- `dateOfBirth`: Date of birth (Required)
  - Required: true
  - Web component: `dateOfBirthUI`
  - Notes:

#### Page: Identification (Required)
- `ssnOrVaFileNumber`: SSN or VA file number (Required)
  - Required: true
  - Web component: `ssnOrVaFileNumberUI`
  - Notes:

### Chapter: Contact Information

#### Page: Address (Required)
- `address`: Standardized address object (Required)
  - Required: true
  - Web component: `addressUI`
  - Notes:

#### Page: Communication (Required)
- `phoneNumber`: Phone number (Required)
  - Required: true
  - Web component: `phoneNumberUI`
  - Notes:

- `email`: Email address (Required)
  - Required: true
  - Web component: `emailUI`
  - Notes:

---

## 🧪 Notes / Decisions

-
```