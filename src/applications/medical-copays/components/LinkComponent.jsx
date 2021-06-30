import React from 'react';
import { Link } from 'react-router';

const LinkComponent = ({ path }) => {
  return <Link to={path}>Go to {path} page</Link>;
};

export default LinkComponent;
