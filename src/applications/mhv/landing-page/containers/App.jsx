import React from 'react';
import NavCard from '../components/NavCard';
import HubLinks from '../components/HubLinks';

const App = () => {
  const demoLinks = [
    { href: '#fixme', text: 'A link' },
    { href: '#fixme', text: 'A link, too' },
    {
      href: '#fixme',
      text: 'A much longer link that might wrap to a new line',
    },
  ];

  const demoLinks2 = demoLinks.concat([
    { href: '#fixmetoo', text: 'Making a slightly longer list' },
  ]);
  return (
    <>
      <va-breadcrumbs className="vads-u-font-family--sans no-wrap">
        <a href="/">Home</a>
        <a href="/my-health">My Health</a>
      </va-breadcrumbs>
      <main>
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <div className="vads-l-row vads-u-margin-bottom--3">
            <div className="vads-l-col medium-screen:vads-l-col--6">
              <h1>My Health</h1>
              <p>
                One place to manage your health care &#x2E3A; and your health
              </p>
            </div>
            <div className="vads-u-display--none medium-screen:vads-u-display--block vads-l-col--6">
              <img
                src="/img/mhv-logo.png"
                className="vagov-logo vads-u-max-width--100 vads-u-margin-bottom--4"
                alt="My HealtheVet Logo"
              />
            </div>
          </div>
          <div className="vads-l-row vads-u-justify-content--space-between vads-u-margin-bottom--0 medium-screen:vads-u-margin-bottom--2">
            <div className="vads-l-col--12 medium-screen:vads-l-col mhv-u-grid-gap vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
              <NavCard title="Appointments" icon="calendar" links={demoLinks} />
            </div>
            <div className="vads-l-col--12 medium-screen:vads-l-col mhv-u-grid-gap vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
              <NavCard title="Messages" icon="comments" links={demoLinks2} />
            </div>
          </div>
          <div className="vads-l-row vads-u-justify-content--space-between vads-u-margin-bottom--0 medium-screen:vads-u-margin-bottom--2">
            <div className="vads-l-col--12 medium-screen:vads-l-col mhv-u-grid-gap vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
              <NavCard
                title="Medications"
                icon="prescription-bottle"
                links={demoLinks2}
              />
            </div>
            <div className="vads-l-col--12 medium-screen:vads-l-col mhv-u-grid-gap vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
              <NavCard
                title="Health records"
                icon="file-medical"
                links={demoLinks}
              />
            </div>
          </div>
          <div className="vads-l-row vads-u-justify-content--space-between vads-u-margin-bottom--0 medium-screen:vads-u-margin-bottom--2">
            <div className="vads-l-col--12 medium-screen:vads-l-col mhv-u-grid-gap vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
              <NavCard title="Payments" icon="dollar-sign" links={demoLinks2} />
            </div>
            <div className="vads-l-col--12 medium-screen:vads-l-col mhv-u-grid-gap vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
              <NavCard
                title="Medical supplies and equipment"
                icon="deaf"
                links={demoLinks}
              />
            </div>
          </div>
        </div>
      </main>
      <HubLinks />
    </>
  );
};

export default App;
