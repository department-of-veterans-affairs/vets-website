// Node modules.
import React, { memo } from 'react';

const MoreInfoAboutBenefits = () => (
  <div className="row">
    <div className="usa-content columns">
      <aside className="va-nav-linkslist va-nav-linkslist--related">
        <section
          data-template="paragraphs/list_of_link_teasers"
          data-entity-id={3452}
          className="field_related_links"
        >
          <h2
            id="more-information-about-your-benefits"
            className="va-nav-linkslist-heading"
          >
            More information about your benefits
          </h2>
          <ul className="va-nav-linkslist-list">
            <li
              data-template="paragraphs/linkTeaser"
              data-entity-id={3453}
              data-links-list-header="Health care benefits eligibility"
              data-links-list-section-header="More information about your benefits"
            >
              <a href="/health-care/eligibility">
                <h4 className="va-nav-linkslist-title">
                  Health care benefits eligibility
                </h4>
                <p className="va-nav-linkslist-description">
                  Not sure if you qualify? Find out if you can get VA health
                  care benefits.
                </p>
              </a>
            </li>
            <li
              data-template="paragraphs/linkTeaser"
              data-entity-id={3454}
              data-links-list-header="How to apply for health care benefits"
              data-links-list-section-header="More information about your benefits"
            >
              <a href="/health-care/how-to-apply">
                <h4 className="va-nav-linkslist-title">
                  How to apply for health care benefits
                </h4>
                <p className="va-nav-linkslist-description">
                  Ready to apply? Get started now.
                </p>
              </a>
            </li>
            <li
              data-template="paragraphs/linkTeaser"
              data-entity-id={3455}
              data-links-list-header="Health needs and conditions"
              data-links-list-section-header="More information about your benefits"
            >
              <a href="/health-care/health-needs-conditions">
                <h4 className="va-nav-linkslist-title">
                  Health needs and conditions
                </h4>
                <p className="va-nav-linkslist-description">
                  Learn how to access VA services for mental health, women’s
                  health, and other specific needs.
                </p>
              </a>
            </li>
            <li
              data-template="paragraphs/linkTeaser"
              data-entity-id={3456}
              data-links-list-header="Disability benefits"
              data-links-list-section-header="More information about your benefits"
            >
              <a href="/disability">
                <h4 className="va-nav-linkslist-title">Disability benefits</h4>
                <p className="va-nav-linkslist-description">
                  Have an illness or injury that was caused—or made worse—by
                  your active-duty service? Find out if you can get disability
                  compensation (monthly payments) from VA.
                </p>
              </a>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
);

export default memo(MoreInfoAboutBenefits);
