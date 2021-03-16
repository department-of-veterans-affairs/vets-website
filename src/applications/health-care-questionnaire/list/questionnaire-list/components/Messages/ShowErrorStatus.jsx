import React from 'react';
import ServiceDown from './ServiceDown';

export default function ShowErrorStatus(props) {
  const { children, hasError } = props;
  return hasError ? <ServiceDown /> : <>{children}</>;
}
