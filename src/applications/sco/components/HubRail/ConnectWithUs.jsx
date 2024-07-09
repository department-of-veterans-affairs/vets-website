import React from 'react';

const ConnectWithUs = () => {
  return (
    <va-accordion-item level="3" open="true" header="Connect with us">
      <h4 className="va-nav-linkslist-list">
        <a href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/elr.asp">
          Find your Education Liaison Representative (ELR)
        </a>
      </h4>

      <section>
        <h4>Email us</h4>
        <ul className="va-nav-linkslist-list social">
          <li>
            <a
              href="mailto:edutraining.vbaco@va.gov"
              target="_blank"
              rel="noopener noreferrer"
            >
              <va-icon
                size={4}
                icon="see name mappings here https://design.va.gov/foundation/icons"
                className="social-icon vads-u-padding-right--1"
              />
              Email National Training Team - Schools
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h4>Get updates</h4>
        <ul className="va-nav-linkslist-list social">
          <li>
            <a
              href="https://public.govdelivery.com/accounts/USVAVBA/subscriber/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              <va-icon
                size={4}
                icon="see name mappings here https://design.va.gov/foundation/icons"
                className="social-icon vads-u-padding-right--1"
              />
              Veteran Benefits email or text updates
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h4>Call us</h4>
        <ul className="va-nav-linkslist-list social">
          <li>
            <va-telephone contact="8884424551" />
          </li>
          <li>
            <va-telephone contact="9187815678" />
          </li>
          <li>
            <va-telephone contact="8006982411" />
          </li>
          <li>If you have hearing loss, call TTY: 711.</li>
        </ul>
      </section>
    </va-accordion-item>
  );
};

export default ConnectWithUs;

/*
 <va-telephone contact={8006982411} />
<va-telephone contact={9187815678} />

 <template>
                <h3>
                    <button aria-expanded="true" aria-controls="content" part="accordion-header">
                        <span className="header-text">
                            <slot name="icon"></slot>Connect with us
                        </span>
                    </button>
                </h3>
            </template>
 */
