import React from 'react';

class Breadcrumbs extends React.Component {
  render() {
    const crumbs = [
      <a href="/" key="home">Home</a>,
      <a href="/disability-benefits" key="disability-benefits">Disability Benefits</a>,
    ];

    return (<div className="db-breadcrumbs">
      {crumbs.reduce((content, e) => { return [...content, ' › ', e]; }, []).slice(1)}
    </div>);
  }
}

export default Breadcrumbs;
