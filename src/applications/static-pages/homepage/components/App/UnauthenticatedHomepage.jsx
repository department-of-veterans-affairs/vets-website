// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';

export const UnauthenticatedHomepage = ({ cards, hubs, promos }) => {
  console.log('In unauthenticated homepage', cards, hubs, promos);
  return (
    <main data-template="layouts/home" id="homepage">
      {/* the hub */}
      <section className="homepage-hub">
        <div className="homepage-hub-container">
          <h1 className="heading-level-2 homepage-heading">
            Access and manage your VA benefits and health care
          </h1>
          {/* top row */}
          <div className="hub-links-row">
            {cards.map(card => {
              const iconClassname = card?.label.toLowerCase().replace(' ', '-');
              return (
                <div
                  className="hub-links-container"
                  data-e2e="bucket"
                  key={card.label}
                >
                  <h2 className="heading-level-3 hub-links-title">
                    <i
                      className={`icon-large-baseline icon-heading hub-icon-${iconClassname} hub-color-${iconClassname}`}
                    />
                    {card?.label}
                  </h2>
                  <ul className="hub-links-list">
                    <li>
                      {card?.links?.map(link => (
                        <a
                          key={link.url.path}
                          href={link.url.path}
                          onClick={recordEvent({
                            event: 'nav-zone-one',
                            'nav-path': `${
                              link.url.path ? link.url.path : link.label
                            }`,
                          })}
                        >
                          {link.label}
                        </a>
                      ))}
                    </li>
                  </ul>
                </div>
              );
            })}
            {/* {'{'}% comment %{'}'} Close row and start new row after 2nd card.{' '}
          {'{'}% endcomment %{'}'}
          {'{'}% if forloop.index == 2 %{'}'} */}
          </div>
          {/* <div className="hub-links-row">
          {'{'}% endif %{'}'}
          {'{'}% endfor %{'}'}
        </div> */}
        </div>
        {/* {'{'}% include "src/site/includes/veteran-banner.html" %{'}'} */}
      </section>
      {/* /the hub */}
      <section id="content">
        <section id="homepage-benefits">
          <div className="usa-grid usa-grid-full homepage-benefits-row">
            {hubs.map(hub => (
              <div
                className="usa-width-one-third"
                key={hub?.entity?.entityId}
                data-e2e="hub"
                data-entity-id={hub?.entity?.entityId}
              >
                <h3 className="heading-level-4">
                  <a
                    href={hub?.entity?.entityUrl?.path}
                    onClick={recordEvent({ event: 'nav-linkslist' })}
                  >
                    <i
                      className={`icon-small icon-heading hub-icon-${
                        hub?.entity?.fieldTitleIcon
                      } hub-background-${hub?.entity?.fieldTitleIcon} white`}
                    />
                    {hub?.entity?.fieldHomePageHubLabel}
                  </a>
                </h3>
                <p className="homepage-benefits-description">
                  {hub?.entity?.fieldTeaserText}
                </p>
              </div>
            ))}
          </div>
          {/* <div className="usa-grid usa-grid-full homepage-benefits-row">
          {'{'}% endif %{'}'}
          {'{'}% endfor %{'}'}
        </div> */}
        </section>
        <section id="homepage-popular">
          <div className="usa-grid usa-grid-full">
            <div className="usa-width-one-third">
              <a
                href="/find-locations/"
                onClick={recordEvent({ event: 'nav-main-health' })}
                className="homepage-button"
              >
                <div className="icon-wrapper">
                  <i className="fa fa-map-marker-alt homepage-button-icon" />
                </div>
                {/* div required for alignment */}
                <div className="button-inner">
                  <span>
                    Find a VA health facility, regional office, or cemetery
                  </span>
                </div>
              </a>
            </div>
            <div className="usa-width-one-third">
              <button
                onClick={recordEvent({ event: 'nav-main-vcl' })}
                className="homepage-button vcl va-overlay-trigger"
                data-show="#modal-crisisline"
              >
                <div className="icon-wrapper vcl" />
                <div className="button-inner">
                  <span>Talk to a Veterans Crisis Line responder now</span>
                </div>
              </button>
            </div>
            <div className="usa-width-one-third" id="myva-login">
              <button
                onClick={recordEvent({ event: 'nav-main-sign-in' })}
                className="homepage-button signin-signup-modal-trigger"
              >
                <div className="icon-wrapper">
                  <i className="fas fa-user-circle homepage-button-icon" />
                </div>
                <div className="button-inner">
                  <span>Sign in or create an account to use more tools</span>
                </div>
              </button>
            </div>
          </div>
        </section>
        {/* end triple column */}
        {/* end #content */}
        <section className="usa-grid usa-grid-full">
          <div className="va-h-ruled--stars" />
        </section>
        <section id="homepage-news">
          <div className="usa-grid usa-grid-full">
            {promos.map(promo => (
              <div
                data-entity-id={promo?.entity?.entityId}
                className="usa-width-one-third homepage-news-story"
                data-e2e="news"
                key={promo?.entity?.entityId}
              >
                <div className="homepage-image-wrapper">
                  <img
                    className="lazy"
                    width={552}
                    data-src={promo?.entity?.fieldImage?.entity?.image?.url}
                    alt={promo?.entity?.fieldImage?.entity?.image?.alt}
                  />
                </div>
                <h4 className="homepage-news-story-title">
                  <a
                    className="no-external-icon"
                    href={promo?.entity?.fieldPromoLink?.entity?.fieldLink?.url}
                    onClick={recordEvent({ event: 'nav-footer-news-story' })}
                  >
                    {promo?.entity?.fieldPromoLink?.entity?.fieldLink?.title}
                  </a>
                </h4>
                <p className="homepage-news-story-desc">
                  {promo?.entity?.fieldPromoLink?.entity?.fieldLinkSummary}
                </p>
              </div>
              // </div>
            ))}
            {/*
        <div className="usa-grid usa-grid-full">
          {'{'}% endif %{'}'}
          {'{'}% endfor %{'}'}
        </div> */}
          </div>
        </section>
      </section>
    </main>
  );
};

UnauthenticatedHomepage.propTypes = {};

const mapStateToProps = state => {};

export default connect(
  mapStateToProps,
  null,
)(UnauthenticatedHomepage);
