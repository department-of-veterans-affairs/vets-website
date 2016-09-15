# Education Benefits

### GI Bill content pages

- [Dependent Assistance](https://www.vets.gov/education/gi-bill/survivors-dependent-assistance/) comparison table could use work - table heading doesn't adhere to the US web design standards styles; and the table generally takes up a lot of space

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-dependent-table.png)

### GI Bill Comparison Tool

- **Initial Search page**
  - "Additional Resources" sidebar is hidden on mobile
  - Step 1 / Step 2 headings
    - Uses the accordion component instead of standard heading styles
    - These are hidden on mobile - if they aren't on mobile, are they needed on desktop?
  
![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/sidebar-gi-comparison.png)

- **Filter top bar**
  - Replace gear icons with standard dropdown arrows for better accessibility
  - **Note:** This entire filter bar is hidden on mobile

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-gear.png)  

- **Filter sidebar**
  - Uses accordion components instead of standard heading styles
  - Doesn't have the appropriate accordion (+/-) UI, which is necessary for mobile usability  where it's collapsed by default
  - Text labels on radio buttons & checkboxes are smaller than on the previous search page

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-radio.png)
  
  - Mobile: "Showing [x] results for the term '[x]' " text is *much* smaller, not legible

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-mobile-results.png)

- **Icons**
  - Use of iconography as labels goes against our own design standards *and* 508 compliance 
  - The legend for these icons is on the previous page, not user-friendly

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-icons.png)

- **Institution detail page**
  - Section headings are inconsistent with each other and the rest of the site
    - Accordion headings aren't useful since all are expanded by default, and they're missing the (+/-) UI that indicates it's collapsible

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-detail-heading.png)

  - Doesn't make sense for the search chrome at top to be present on this page

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-detail-chrome.png)

  - Icons are paired with text labels here - which is more accessible, but now makes them feel unnecessary

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-detail-icons.png)

  - Consider using a Definition Block to encompass the information at the top of the page as a "school snapshot" section

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-detail-block.png)

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-detail-block-ref.png)

  - Veteran Summary 
    - Use of icons is an outlier - need a better way to communicate supported/unsupported programs

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-detail-summary.png)

  - Benefits Calculator
    - Headings are inconsistent with each other

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-detail-calc.png)

  - School Summary - tables are inconsistent w/ US web design standards and other parts of the site

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-detail-table-usds.png)

*US web design standard table style*

![](https://github.com/department-of-veterans-affairs/vets.gov-frontend/blob/interface-audit/docs/interface-audit/images/gi-detail-table.png)

*GI Bill table styles*
