import React from 'react';
import { Link } from 'react-router-dom';

const LinkComponent = ({ url }) => {
  return <Link to={url}>Go to {url} page</Link>;
};

export default LinkComponent;
