import React from 'react';

const App = () => {
  return (
    <>
      <va-breadcrumbs className="vads-u-font-family--sans no-wrap">
        <a href="/">Home</a>
        <a href="/my-health">My Health</a>
      </va-breadcrumbs>
      <main>
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 large-screen:vads-l-col--3">
              <div
                className="vads-u-padding-x--2 vads-u-padding-y--7 vads-u-background-color--primary-alt-lightest"
                style={{ height: '240px' }}
              >
                Usually this is the sidebar
              </div>
            </div>
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9">
              <div
                className="vads-u-padding-x--2 vads-u-padding-y--7 vads-u-background-color--primary-alt-lightest"
                style={{ height: '240px' }}
              >
                <h1 className="vads-u-margin-bottom--1p5">MHV Landing page</h1>
                Usually this is main content
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
