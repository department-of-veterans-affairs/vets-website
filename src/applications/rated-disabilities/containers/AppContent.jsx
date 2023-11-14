import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getRatedDisabilities } from '../actions';

export default function AppContent(props) {
  const [data, setData] = useState({});
  useEffect(() => {
    getRatedDisabilities.then(res => {
      setData(res);
    });
  }, []);

  return (
    <h1>Hello</h1>
  );
}

AppContent.propTypes = {
};