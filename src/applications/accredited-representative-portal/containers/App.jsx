import React from 'react';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';

import Footer from '../components/common/Footer/Footer';
import Header from '../components/common/Header/Header';

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps)(App);
