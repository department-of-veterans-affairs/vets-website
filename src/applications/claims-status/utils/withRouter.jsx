import React from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom-v5-compat';

export default function withRouter(Component) {
  return props => (
    <Component
      {...props}
      location={useLocation()}
      navigate={useNavigate()}
      params={useParams()}
    />
  );
}
