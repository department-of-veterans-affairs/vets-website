# Product Requirements Document: VA Form 21-651 - Election of Compensation in Lieu of Retired Pay

## Executive Summary

VA Form 21-651 is a compensation election form that allows veterans to elect to receive disability compensation from the Department of Veterans Affairs in lieu of retired pay, or to waive retired pay to secure compensation. This is a simple, single-page form with minimal complexity that serves as an official election document for veterans who need to make this important financial decision regarding their benefits.

## Form Metadata

- **Form Number**: VA Form 21-651
- **Title**: Election of Compensation in Lieu of Retired Pay or Waiver of Retired Pay to Secure Compensation from Department of Veterans Affairs
- **OMB Number**: Not visible in provided PDF
- **Expiration Date**: Not specified in provided PDF
- **Respondent Burden**: Estimated 5-10 minutes
- **Benefit Type**: Disability Compensation Election
- **Form Date**: References superseding VA Form 21-651, MAR 2005
- **Page Count**: 1 page
- **USC Reference**: 38 U.S.C. 5304(a)-5305

## Technical Requirements

- **Platform**: VA.gov forms system
- **Framework**: React + RJSF + Redux
- **Accessibility**: WCAG 2.2 AA compliance
- **Authentication**: Required (veteran-specific form)
- **Save-in-Progress**: Enabled
- **Prefill**: Available from veteran profile data
- **Form Complexity**: Simple

## Form Structure

### Chapter 1: Veteran Information
**Purpose**: Collect and verify veteran identification information

#### Page 1.1: Veteran Details
**URL**: `/21-651/veteran-information`
**Title**: "Veteran Information"
**Description**: Basic veteran identification information for the compensation election

**Fields**:
- **veteranFullName**:
  - Type: textUI/textSchema (fullNameUI pattern)
  - Label: "Veteran's full name"
  - Required: Yes
  - Validation: Standard name validation
  - Prefill: Available from user profile

- **vaFileNumber**:
  - Type: textUI/textSchema
  - Label: "VA file number"
  - Required: Yes
  - Validation: VA file number format
  - Prefill: Available from user profile

- **serviceNumber**:
  - Type: textUI/textSchema
  - Label: "Service number"
  - Required: No
  - Validation: Alphanumeric, variable length
  - Prefill: Available from military records if available

- **socialSecurityNumber**:
  - Type: ssnUI/ssnSchema
  - Label: "Social Security number"
  - Required: Yes
  - Validation: SSN format validation
  - Prefill: Available from user profile

### Chapter 2: Election Statement
**Purpose**: Capture the veteran's formal election decision

#### Page 2.1: Compensation Election
**URL**: `/21-651/election-statement`
**Title**: "Compensation Election"
**Description**: Formal election to receive compensation in lieu of retired pay

**Fields**:
- **electionStatement**:
  - Type: Custom read-only text component
  - Content: "I hereby elect to receive compensation from the Department of Veterans Affairs in lieu of the total amount of retired pay, or waive that portion of my retired pay which is equal in amount to the compensation which may be awarded by the Department of Veterans Affairs."
  - Required: Display only

- **veteranSignature**:
  - Type: signatureUI/signatureSchema (digital signature)
  - Label: "Veteran's signature"
  - Required: Yes
  - Validation: Digital signature required

- **signatureDate**:
  - Type: dateUI/dateSchema
  - Label: "Date of signature"
  - Required: Yes
  - Validation: Cannot be future date
  - Default: Current date

### Chapter 3: Review and Submit
**Purpose**: Final review and submission

#### Page 3.1: Review and Submit
**URL**: `/21-651/review-and-submit`
**Title**: "Review and Submit"
**Description**: Review all information before submitting the election

## Conditional Logic

No complex conditional logic required for this form. All fields are straightforward with standard validation rules.

## Data Schema

```json
{
  "type": "object",
  "properties": {
    "veteranInformation": {
      "type": "object",
      "properties": {
        "veteranFullName": {
          "type": "object",
          "properties": {
            "first": { "type": "string" },
            "middle": { "type": "string" },
            "last": { "type": "string" }
          }
        },
        "vaFileNumber": { "type": "string" },
        "serviceNumber": { "type": "string" },
        "socialSecurityNumber": { "type": "string" }
      }
    },
    "electionInformation": {
      "type": "object",
      "properties": {
        "veteranSignature": { "type": "string" },
        "signatureDate": { "type": "string", "format": "date" }
      }
    }
  }
}
```

## Integration Points

- **Prefill Sources**:
  - User profile (name, SSN, VA file number)
  - Military service records (service number)
- **Submission Endpoint**: TBD - Benefits backend API
- **Document Upload**: Not required for this form
- **Notification System**:
  - Email confirmation upon submission
  - Status updates on election processing

## Accessibility Requirements

- Screen reader compatibility for all form elements
- Keyboard navigation support throughout the form
- High color contrast for all text and UI elements
- Clear error messaging with proper ARIA labels
- Focus management between form pages
- Digital signature component must be accessible
- Form instructions must be clearly readable

## Business Rules

1. **Authentication Required**: Only authenticated veterans can access this form
2. **One-Time Election**: Veterans should be warned this is typically a one-time election
3. **Legal Implications**: Clear messaging about the financial implications of the election
4. **Existing Elections**: Check if veteran has already made this election
5. **Eligibility**: Verify veteran is eligible to make this election (has both retired pay and disability compensation)

## Success Metrics

- Form completion rate: Target 95%+
- Error rate by field: Target <2%
- Time to completion: Target <5 minutes
- User satisfaction scores: Target 4.5/5
- Digital signature success rate: Target 98%+

## Implementation Roadmap

### Phase 1: Core Form Structure (2-3 weeks)
- Set up basic form framework
- Implement veteran information page
- Add prefill integration for basic fields
- Basic validation and error handling

### Phase 2: Election Features (1-2 weeks)
- Implement digital signature component
- Add election statement display
- Implement review page
- Add submission logic

### Phase 3: Integration and Polish (1-2 weeks)
- Backend API integration
- Comprehensive testing
- Accessibility audit and fixes
- Performance optimization

### Phase 4: Testing and Launch (1-2 weeks)
- End-to-end testing
- User acceptance testing
- Security review
- Production deployment

## Key Technical Challenges

1. **Digital Signature**: Implementing secure, legally-compliant digital signature
2. **Election Validation**: Ensuring veteran is eligible and hasn't already made election
3. **Legal Compliance**: Meeting requirements for official VA form submission
4. **Integration**: Connecting with benefits systems for election processing

## Recommended Implementation Approach

Given the simplicity of this form, recommend a straightforward implementation using standard VA.gov form patterns. Focus on reliability and legal compliance over complex features. The form should emphasize clarity and user confidence in making this important financial election.

## Quality Assurance

- [ ] All PDF content captured in digital form
- [ ] Web component patterns correctly mapped
- [ ] No conditional logic missed (form is straightforward)
- [ ] Accessibility requirements documented
- [ ] VA.gov standards compliance verified
- [ ] Legal and business requirements addressed
- [ ] Digital signature security requirements met
