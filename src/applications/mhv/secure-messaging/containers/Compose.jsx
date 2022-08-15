import React from 'react';
import PropTypes from 'prop-types';
import SectionGuideButton from '../components/SectionGuideButton';
import Breadcrumbs from '../components/breadcrumbs';
import BeforeMessageAddlInfo from '../components/BeforeMessageAddlInfo';
import ComposeForm from '../components/ComposeForm';

const Compose = () => {
  const navSections = [
    {
      title: 'Pharmacy',
      links: [{ name: 'Link', endpoint: '/pharmacy/link' }],
    },
    {
      title: 'Appointments',
      links: [{ name: 'Link', endpoint: '/appointments/link' }],
    },
    {
      title: 'Messages',
      links: [
        { name: 'Compose', endpoint: '/secure-messages/compose' },
        { name: 'Drafts', endpoint: '/secure-messages/drafts' },
        { name: 'Folders', endpoint: '/secure-messages/folders' },
        { name: 'Sent', endpoint: '/secure-messages/sent' },
        { name: 'Deleted', endpoint: '/secure-messages/deleted' },
        { name: 'Search Messages', endpoint: '/secure-messages/search' },
        { name: 'Messages FAQ', endpoint: '/secure-messages/faq' },
      ],
    },
    {
      title: 'Medical Records',
      links: [{ name: 'Link', endpoint: '/medical-records/link' }],
    },
    {
      title: 'VA health care benefits',
      links: [{ name: 'Link', endpoint: '/benefits/link' }],
    },
    {
      title: 'Copay bills and travel pay',
      links: [{ name: 'Link', endpoint: '/copay/link' }],
    },
    {
      title: 'Health Resources',
      links: [{ name: 'Link', endpoint: '/resources/link' }],
    },
  ];

  const SideNavItem = props => {
    const { title, links } = props;
    return (
      <li>
        <button
          type="button"
          className="usa-accordion-button"
          aria-expanded={title === 'Messages'}
          aria-controls={title}
        >
          {title}
        </button>
        <div id={title} className="usa-accordion-content" aria-hidden="true">
          <ul className="usa-sidenav-list">
            {links.map(link => (
              <li key={link.name}>
                <a href={link.endpoint}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  };

  SideNavItem.propTypes = {
    links: PropTypes.array,
    title: PropTypes.string,
  };

  return (
    <div className="vads-l-grid-container compose-container">
      <Breadcrumbs link="/search" pageName="Search" />
      <SectionGuideButton sectionName="Messages" />

      <div className="vads-l-row compose-contents">
        <div className="vads-l-col--12 medium-screen:vads-l-col--4 large-screen:vads-l-col--3 left-nav-container">
          <nav
            className="va-sidebarnav vads-u-width--full"
            id="va-detailpage-sidebar"
          >
            <div>
              <button
                type="button"
                aria-label="Close this menu"
                className="va-btn-close-icon va-sidebarnav-close"
              />
              <div className="left-side-nav-title">
                <h4 style={{ lineHeight: '60px' }}>My Health</h4>
              </div>
              <ul className="usa-accordion">
                {navSections.map(item => (
                  <SideNavItem
                    key={item.title}
                    links={item.links}
                    title={item.title}
                  />
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="vads-l-col--12 large-screen:vads-u-padding-left--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9">
          <h1 className="page-title">Compose Message</h1>
          <section className="emergency-note">
            <p>
              <strong>Note: </strong>
              Call <a href="tel:911">911</a> if you have a medical emergency. If
              you’re in crisis and need to talk to someone now, call the{' '}
              <a href="tel:988">Veterans Crisis Line</a>. To speak with a VA
              healthcare team member right away, contact your local VA call
              center.
            </p>
          </section>
          <div>
            <BeforeMessageAddlInfo />
          </div>

          <section className="compose-block">
            <div className="compose-header">
              <h3>New Message</h3>
              <button type="button" className="send-button-top">
                <i className="fas fa-paper-plane" />
                <span className="send-button-top-text">Send</span>
              </button>
            </div>

            <ComposeForm />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Compose;
