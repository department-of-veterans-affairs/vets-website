import React from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom-v5-compat';

export default function withRouter(Component) {
  return props => {
    const [searchParams] = useSearchParams();
    return (
      <Component
        {...props}
        location={useLocation()}
        navigate={useNavigate()}
        params={useParams()}
        searchParams={searchParams}
      />
    );
  };
}
