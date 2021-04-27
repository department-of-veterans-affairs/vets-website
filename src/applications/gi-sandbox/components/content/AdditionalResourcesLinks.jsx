import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

export const AdditionalResourcesLinks = ({ vetTec = false }) => {
  const links = [
    {
      href: 'https://va.careerscope.net/gibill',
      text: 'Get started with CareerScope',
      show: true,
    },
    {
      href: 'https://www.benefits.va.gov/gibill/choosing_a_school.asp',
      text: 'Get help choosing a school',
      show: !vetTec,
    },
    {
      href:
        '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/',
      text: 'Learn more about VET TEC',
      show: vetTec,
    },
    {
      href:
        '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994/introduction',
      text: 'Apply for VET TEC',
      show: vetTec,
    },
    {
      href: '/education/submit-school-feedback',
      text: 'Submit a complaint through our Feedback System',
      show: true,
    },
    {
      href: '/education/how-to-apply/',
      text: 'Apply for education benefits',
      show: !vetTec,
    },
  ];

  const onClick = () =>
    recordEvent({
      event: 'nav-profile-additional-resources',
    });

  return (
    <div>
      {links.filter(link => link.show).map((link, index) => (
        <p key={`additional-resources-link-${index}`}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
          >
            {link.text}
          </a>
        </p>
      ))}
    </div>
  );
};

export default AdditionalResourcesLinks;
