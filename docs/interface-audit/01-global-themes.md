# Global Themes

### Heading styles

- Are *very* inconsistent in how they're used - H3-H5 are used interchangeably
- Recommended to implement a consistent pattern based on hierarchy within a section

![](images/heading-callout.png)

![](images/heading-callout-yes.png)

![](images/process-list-weights.png)

### Fonts

- Roboto Slab is technically in our design guidelines, but is used very sparingly/randomly - only in the GI Bill Comparison tool, homepage header and Facility locator page header
  - Either find a more intentional use for it that incorporates it throughout the whole site or remove it

![](images/roboto-body.png)

![](images/facility-locator-header.png)

- Helvetica appears as a heading font in several areas - Résumé builder, Job skills translator, Job search, Employer commitments

![](images/helvetica-jobs-search.png)

### Callout boxes

- Eligibility information is in a callout box ~70% of the time, otherwise it's just paragraph text
- Secondary headings in the callout box are inconsistently styled - different weights and colors, sometimes bulleted

![](images/callout-half.png)

![](images/callout-none.png)

![](images/careers-callout.png)

### Buttons

- The "standard" button style is used ~30% of the time; other buttons have different heights, border radii, font weights, or colors

![](images/Button-Benefits.png)

![](images/Button-GI-Comparison.png)

![](images/Button-HCA.png)

- Location of CTA buttons
  - On a main page (e.g. Disabilities) sometimes the CTA is in the intro, other times it's in a banenr in the footer
  - On section interior pages it's in a grey bar above the breadcrumb nav
  - On some pages like [this](https://www.vets.gov/disability-benefits/conditions/exposure-to-hazardous-materials/agent-orange/diseases/) it doesn't appear at all

![](images/cta-button-location.png)

- Secondary button styles are inconsistent

![](images/healthcare-btn.png)

*^ Health Care Application*

![](images/search-buttons-clear.png)

*^ Jobs Search*

### Process lists

- Used in different ways due to inconsistency in the format of the content
- Callout boxes used in process lists vary in highlighting all, some, or none of the content in each step
- Some have succinct headings for each step which use heading styles
- Some have only paragraphs/lists of content

![](images/process-list-1.png)

![](images/process-list-headings.png)

### List Navigation

- Sometimes used to list dependent (child) content; other times used to list related (sibling) content
  - Under Claim Types, when I click through to a specific claim type I see the list nav of all claim types at the bottom of that page too
  - Under Conditions, I only see the list nav on the main Conditions page - when I click through to a condition I don't see that list nav

![](images/list-nav.png)

### Sidebars

- Inconsistent styles - Agent Orange example most closely matches the vets.gov style guide
- GI Bill Comparison tool, Résumé builder, Job Search, Employer Commitments all use different sidebars

![](images/sidebar-agent-orange.png)

![](images/sidebar-gi-comparison.png)

![](images/sidebar-job-search.png)

### Forms

- Dropdown styles are inconsistent - some are US web design standard, others have a custom dropdown arrow or icon

![](images/dropdown-gi.png)

![](images/dropdown-facilities.png)

![](images/gi-gear.png)

- Checkboxes are missing the checkmark symbol

![](images/healthcare-checkbox.png)

- "Required" labels are inconsistent - sometimes a red asterisk, sometimes (required) text
- US web design standards  recommend only labeling fields that are *optional* rather than those that are required

![](images/healthcare-field-required.png)

![](images/skills-required.png)

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

![](images/search-features.png)

- **Tips/resources sidebar**
  - Appears only on initial search page, not on search results page (GI Bill)

![](images/sidebar-gi-comparison.png)

- **Search button placement**
  - Attached to right side of search field (Facilities)
  - Next to search field with space between (GI Bill results page)
  - Below search field (Jobs, GI Bill first page)
  - Hidden w/ auto-submit on keydown (Commitments)

![](images/search-button-below.png)

![](images/search-button-beside.png)

![](images/search-button-none.png)

![](images/search-button-reset.png)

- **Search button language**
  - Broad "Search" (Jobs, Facilities, Commitments)
  - Specific "Search Schools" (GI Bill)

![](images/search-button-below.png)

![](images/search-button-beside.png)

- **Reset button**
  - "Reset search" navigates back to initial search page (GI Bill)
  - "Clear search" clears my field inputs on the same page (Jobs)
  - None (Facilities, Commitments)

![](images/search-button-reset.png)

![](images/search-buttons-clear.png)

- **How a search gets submitted**
  - I manually select a Submit button (GI Bill, Jobs, Facilities)
  - Auto-updates on key-down in the search field (Commitments)

- **Appearance of advanced search criteria**
  - Presented up front before performing initial search (Jobs)
  - Deferred until after performing initial search (GI Bill)

![](images/search-advanced-start.png)
![](images/search-advanced-results.png)

- **Number of search results**
  - Inconsistency in format, and sometimes doesn't appear at all

![](images/search-number-results-jobs.png)

![](images/search-number-results.png)

- **Search filter criteria location & orientation**
  - Horizontal in a top banner (GI Bill, Facilities, Commitments)
  - Vertical in a sidebar next to results (GI Bill)
  - Vertical and full-width above results (Jobs)

![](images/search-filters-gi.png)

![](images/search-filters-facilities.png)

![](images/search-filters-commitments.png)

![](images/search-filters-jobs.png)

- **Pagination functionality**
  - Previous/next links only (Jobs)
  - Previous/next links + page numbers (GI Bill, Commitments)
  - Continuous scroll with no pagination UI (Facilities)

![](images/search-pagination-jobs.png)

![](images/search-pagination-gi.png)

![](images/search-pagination-commitments.png)

![](images/search-results-pagination.png)

- **Selector to change number of entries shown per page**
  - Only used on Employer Commitments tool

![](images/search-entries.png)

### Responsive behavior

- Generally the layout doesn't scale well on mobile
- Issues with uneven gutters on right/left, or none at all

![](images/mobile-gutters.png)

- **Tables:**
  - Lines don't break cleanly
  - Text has no line-height, looks crammed

![](images/mobile-tables.png)

### Miscellaneous

- "Work in progress" and vets.gov site banners are *slightly* different on some pages - see GI Bill Comparison Tool
