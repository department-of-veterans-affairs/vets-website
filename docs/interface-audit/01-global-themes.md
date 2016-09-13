# Global Themes

### Heading styles

- Are *very* inconsistent in how they're used - H3-H5 are used interchangeably
- Recommended to implement a consistent pattern based on hierarchy within a section

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/heading-callout.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/heading-callout-yes.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/process-list-weights.png)

### Fonts

- Roboto Slab is technically in our design guidelines, but is used very sparingly/randomly - only in the GI Bill Comparison tool, homepage header and Facility locator page header
  - Either find a more intentional use for it that incorporates it throughout the whole site or remove it

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/roboto-body.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/facility-locator-header.png)

- Helvetica appears as a heading font in several areas - Résumé builder, Job skills translator, Job search, Employer commitments

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/helvetica-jobs-search.png)

### Callout boxes

- Eligibility information is in a callout box ~70% of the time, otherwise it's just paragraph text
- Secondary headings in the callout box are inconsistently styled - different weights and colors, sometimes bulleted

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/callout-half.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/callout-none.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/careers-callout.png)

### Buttons

- The "standard" button style is used ~30% of the time; other buttons have different heights, border radii, font weights, or colors

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/Button-Benefits.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/Button-GI-Comparison.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/Button-HCA.png)

- Location of CTA buttons
  - On a main page (e.g. Disabilities) sometimes the CTA is in the intro, other times it's in a banenr in the footer
  - On section interior pages it's in a grey bar above the breadcrumb nav
  - On some pages like [this](https://www.vets.gov/disability-benefits/conditions/exposure-to-hazardous-materials/agent-orange/diseases/) it doesn't appear at all

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/cta-button-location.png)

- Secondary button styles are inconsistent

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/healthcare-btn.png)

*^ Health Care Application*

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-buttons-clear.png)

*^ Jobs Search*

### Process lists

- Used in different ways due to inconsistency in the format of the content
- Callout boxes used in process lists vary in highlighting all, some, or none of the content in each step
- Some have succinct headings for each step which use heading styles
- Some have only paragraphs/lists of content

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/process-list-1.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/process-list-headings.png)

### List Navigation

- Sometimes used to list dependent (child) content; other times used to list related (sibling) content
  - Under Claim Types, when I click through to a specific claim type I see the list nav of all claim types at the bottom of that page too
  - Under Conditions, I only see the list nav on the main Conditions page - when I click through to a condition I don't see that list nav

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/list-nav.png)

### Sidebars

- Inconsistent styles - Agent Orange example most closely matches the vets.gov style guide
- GI Bill Comparison tool, Résumé builder, Job Search, Employer Commitments all use different sidebars

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/sidebar-agent-orange.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/sidebar-gi-comparison.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/sidebar-job-search.png)

### Forms

- Dropdown styles are inconsistent - some are US web design standard, others have a custom dropdown arrow or icon

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/dropdown-gi.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/dropdown-facilities.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-gear.png)

- Checkboxes are missing the checkmark symbol

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/healthcare-checkbox.png)

- "Required" labels are inconsistent - sometimes a red asterisk, sometimes (required) text
- US web design standards  recommend only labeling fields that are *optional* rather than those that are required
 
![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/healthcare-field-required.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/skills-required.png)

### Search tools

- UI & features are drastically different between the various searchable interfaces on the site: 
  - Job Search
  - GI Bill Comparison Tool
  - Facility Locator
  - Employer Commitments

- **Search results**
  - Load on a separate page from initial search fields (GI Bill)
  - Appear below search fields on the same page (Jobs, Facilities, Commitments)
  - Appearance of "Featured" results before the user has search for anything (Jobs)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-features.png)

- **Tips/resources sidebar**
  - Appears only on initial search page, not on search results page (GI Bill)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/sidebar-gi-comparison.png)

- **Search button placement**
  - Attached to right side of search field (Facilities)
  - Next to search field with space between (GI Bill results page)
  - Below search field (Jobs, GI Bill first page)
  - Hidden w/ auto-submit on keydown (Commitments)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-button-below.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-button-beside.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-button-none.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-button-reset.png)

- **Search button language**
  - Broad "Search" (Jobs, Facilities, Commitments)
  - Specific "Search Schools" (GI Bill)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-button-below.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-button-beside.png)

- **Reset button**
  - "Reset search" navigates back to initial search page (GI Bill)
  - "Clear search" clears my field inputs on the same page (Jobs)
  - None (Facilities, Commitments)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-button-reset.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-buttons-clear.png)

- **How a search gets submitted**
  - I manually select a Submit button (GI Bill, Jobs, Facilities)
  - Auto-updates on key-down in the search field (Commitments)

- **Appearance of advanced search criteria**
  - Presented up front before performing initial search (Jobs)
  - Deferred until after performing initial search (GI Bill)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-advanced-start.png)
![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-advanced-results.png)

- **Number of search results**
  - Inconsistency in format, and sometimes doesn't appear at all

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-number-results-jobs.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-number-results.png)

- **Search filter criteria location & orientation**
  - Horizontal in a top banner (GI Bill, Facilities, Commitments)
  - Vertical in a sidebar next to results (GI Bill)
  - Vertical and full-width above results (Jobs)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-filters-gi.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-filters-facilities.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-filters-commitments.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-filters-jobs.png)

- **Pagination functionality**
  - Previous/next links only (Jobs)
  - Previous/next links + page numbers (GI Bill, Commitments)
  - Continuous scroll with no pagination UI (Facilities)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-pagination-jobs.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-pagination-gi.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-pagination-commitments.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-results-pagination.png)

- **Selector to change number of entries shown per page** 
  - Only used on Employer Commitments tool

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/search-entries.png)

### Responsive behavior

- Generally the layout doesn't scale well on mobile
- Issues with uneven gutters on right/left, or none at all

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/mobile-gutters.png)

- **Tables:**
  - Lines don't break cleanly
  - Text has no line-height, looks crammed

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/mobile-tables.png)

### Miscellaneous

- "Work in progress" and vets.gov site banners are *slightly* different on some pages - see GI Bill Comparison Tool
