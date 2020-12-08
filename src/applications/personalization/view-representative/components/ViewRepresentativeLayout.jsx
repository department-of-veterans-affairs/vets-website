import React from 'react';
import SideBar from './SideBar';
import ViewRepresentativeBody from './ViewRepresentativeBody';

const ViewRepresentativeLayout = props => {
  return (
    <div className="vads-l-row">
      <main className="vads-l-col--12 medium-screen:vads-l-col--8">
        <header>
          <h1>View your representative for VA claims</h1>
          <ViewRepresentativeBody representative={props.representative} />
        </header>
      </main>
      <section className="vads-l-col--12 medium-screen:vads-l-col--4">
        <SideBar />
      </section>
    </div>
  );
};

export default ViewRepresentativeLayout;
