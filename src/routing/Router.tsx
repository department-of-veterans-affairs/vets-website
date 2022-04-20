import React, { useState } from 'react';
import { RouterProps } from './types';
import { BrowserRouter, Switch } from 'react-router-dom';
import { FormContext } from './FormContext';

/**
 * Manages form pages as routes
 *
 * @beta
 */
export default function Router(props: RouterProps): JSX.Element {
  const [formData, handleUpdate] = useState({});

  const updateFormData = (data: Record<string, unknown>) => {
    const updatedData = { ...formData, ...data };
    handleUpdate(updatedData);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        handleUpdate: updateFormData,
      }}
    >
      <BrowserRouter basename={props.basename}>
        <Switch>{props.children}</Switch>
      </BrowserRouter>
    </FormContext.Provider>
  );
}
