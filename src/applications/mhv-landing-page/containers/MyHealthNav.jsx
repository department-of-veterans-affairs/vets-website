import React from 'react';
import PropTypes from 'prop-types';

const links = [
  {
    title: 'My HealtheVet',
    href: '/my-health',
  },
  {
    title: 'Appointments',
    href: '/my-health/appointments',
    icon: 'fas fa-calendar',
  },
  {
    title: 'Messages',
    href: '/my-health/secure-messages',
    icon: 'fas fa-comments',
  },
  {
    title: 'Medications',
    href: '/my-health/medications',
    icon: 'fas fa-prescription-bottle',
  },
  {
    title: 'Records',
    href: '/my-health/medical-records',
    icon: 'fas fa-file-medical',
  },
];

const NavItem = ({ title, href, icon }) => (
  <li>
    <a href={href}>
      {!!icon && <i className={icon} aria-hidden="true" />}
      {title}
    </a>
  </li>
);

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
};

const MyHealthNav = () => (
  <nav className="my-health-nav">
    <ul>
      {links.map(link => (
        <NavItem key={link.title} {...link} />
      ))}
    </ul>
  </nav>
);

export default MyHealthNav;
