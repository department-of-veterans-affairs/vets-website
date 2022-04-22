import React, { useState } from 'react';
import { RouterProps } from './types';
import { BrowserRouter, Switch, SwitchProps } from 'react-router-dom';
import { FormContext } from './FormContext';

export type RouterAndSwitchProps = RouterProps & SwitchProps;

/**
 * Manages form pages as routes
 *
 * @beta
 */
export default function Router(props: RouterAndSwitchProps): JSX.Element {
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
