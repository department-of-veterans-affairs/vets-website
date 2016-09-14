#Hit List - Summary of Interface Audit Findings

##Immediate Actions
*Simple fixes to increase visual consistency and remove outlier styles. Gets us to V1.0 and allows for easier global changes later on.*

**Fonts**
- Change all appearances of Helvetica and Roboto Slab to Source Sans Pro
  - *Exception (for now): Home page "How can we help?" heading*

**Heading Text**
- Use heading styles consistently based on hierarchy within a page - e.g. H1, H2, H3, etc.

**Buttons**
- Implement the US web standard style for all primary buttons (search tools are particularly non-compliant)
- Use a consistent style for secondary buttons
- Apply consistent placement of "Apply for Benefits" buttons above the fold(ish) on core pages

**Callout Boxes**
- On content pages, make sure eligibility / "who does this apply to" information is *always* styled in a callout box
- Create a consistent pattern for headings & subheadings inside callout boxes

**Process Lists**
- Use a consistent heading style for process lists

**Forms**
- Use the US web design standard dropdown style throughout - no custom dropdowns
- Show a checkmark symbol in a selected checkbox
- Consistent font-size for form labels, e.g. radio button text
- Use a standard error state across vets.gov - differing styles appear in the Résumé Builder, Skills Translator

**Content width**
- Consistent column width on content pages (outliers: Agent Orange, Apply for Disability Benefits, Résumé Builder)

**Navigation Elements**
- Ensure list & card navigation elements don't appear together (Careers & Employment page)

**Search Interfaces**
- Use consistent language for submit - "Search" and reset - "Clear search" buttons

**Facility Locator**
- Use standard text link styles for website / directions links - remove border
- Search field should use standard form field with correctly sized font

**Tables**
- Implement one consistent table style across the site
- Ensure tables display well on mobile - text wraps cleanly and has adequate leading and padding to be legible

**Sidebars**
- Use a consistent style & format for informational sidebars

**Pagination**
- Implement a consistent pagination component used by all search tools - Site search, GI Bill Comparison, Job Search, Employer Commitments, Facility Locator

##Requires Further Exploration
*Requires significant development, redesign, user testing or stakeholder input. Has less immediate impact by/on vets.gov branding updates.*

**Headings**
- Revisit use of accordion headings in scenarios where information shouldn't or doesn't collapse - use standard headings instead

**Process Lists**
- Always use headings to summarize each step (requires content approval)
- Only use callout boxes to call out specific information, not entire steps (requires content approval)

**Forms**
- Only display errors after a user has selected a submit button, not as they're entering information
- Use radio buttons instead of dropdowns whenever there are 5 or less options to choose from
- Test for usability of (required) vs (optional) labels on form fields, implement a consistent style

**Icons**
- Make sure iconography is only used when justified by our guiding principles -

  > "If an image is to be used, it should convey content that can not be adequately conveyed by text alone"

**Responsive Behavior**
- Give consistent padding/gutters when content scales down to single-column
- Ensure text never scales to an illegible size on mobile

**Search Interfaces**
- Create consistent interface patterns for search tools - Site search, GI Bill Comparison, Job Search, Employer Commitments, Facility Locator
- Location of search fields / filters - consistent placement relative to search results
- Format of search results - potentially establish 2-3 distinct patterns based on differing metadata requirements
- Visual style of featured / recommended results vs. regular search results
- Search is always submitted/updated by selecting a submit button, not by auto-update as a user types

**List Navigation**
- Investigate whether this pattern should be used to show dependent (child) content vs. related (sibling) content
- Potentially create a unique pattern to handle displaying sibling content and make the relationship clearer

**GI Bill Comparison Tool - Institution Page**
- This page generally needs to be revisited for better consistency that adheres to the vets.gov design guide - it should set a scalable model for similar data-heavy features we develop in the future

**Résumé Builder**
- Consider the use of a step-by-step interface like HCA
- Revisit the grey "card" background for the Résumé preview, use a visual style that feels more on-brand to vets.gov

**Facility Locator**
- Should use a standard breadcrumb/heading pattern for the page header
