import React, { useEffect, useState, useCallback } from 'react';

import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { apiRequest } from 'platform/utilities/api';
import { ServerErrorAlert } from '../../config/helpers'; // '  ../config/helpers';
// import { set } from 'date-fns';

const TopicList = props => {
  const { formContext, id, onChange, required, value } = props;
  const { reviewMode, submitted } = formContext;

  const [devs, setDevs] = useState([]);
  //   const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [dirty, setDirty] = useState(false);

  // define our error message(s)
  const errorMessages = { required: 'Please provide a response' };

  // define our custom onchange event
  const handleChange = event => {
    setDirty(true);
    onChange(event.detail.value);
  };

  // define our custom onblur event
  const handleBlur = () => {
    setDirty(true);
  };

  // check field for validation errors only if field is dirty or form has been submitted
  const showError = () => {
    return (submitted || dirty) && !value ? errorMessages.required : false;
  };

  // fetch, map and set our list of facilities based on the state selection
  const getUsers = async () => {
    const response = await apiRequest(`/ask_va/static_data`)
      .then(res => {
        return res;
      })
      .catch(() => {
        hasError(true);
      });

    // format for the widget
    const data = [];
    for (const key of Object.keys(response)) {
      data.push({ id: response[key].dataInfo, name: key });
    }

    // set the dev list in the formConfig
    setDevs(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getDev = useCallback(
    val => {
      const dev = devs.find(f => f.name === val);
      return dev ? `${dev.name} (${dev.id})` : '\u2014';
    },
    [devs],
  );

  // render the developer info on review page
  if (reviewMode) {
    return <span data-testid="ez-facility-reviewmode">{getDev(value)}</span>;
  }

  return !error ? (
    <VaSelect
      id={id}
      name={id}
      value={value}
      label="Dev List"
      error={showError() || null}
      required={required}
      onVaSelect={handleChange}
      onBlur={handleBlur}
    >
      <option value="">&nbsp;</option>
      {devs.map(f => (
        <option key={f.id} value={f.name}>
          {f.name}
        </option>
      ))}
    </VaSelect>
  ) : (
    <div className="server-error-message vads-u-margin-top--4">
      <ServerErrorAlert />
    </div>
  );
};

export default TopicList;
