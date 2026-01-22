import React, { useState, useEffect } from 'react';
import FormRenderer from 'platform/form-renderer/FormRenderer';
import { getData } from '../config/utilities';

const fetchFormData = async (setConfig, setData) => {
  const response = await getData('/form_submissions/latest');
  setConfig(response.config);
  setData(response.data);
};

const App = () => {
  const [config, setConfig] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchFormData(setConfig, setData);
  }, []);
  if (!!config && !!data) {
    return (
      <div>
        <div className="vads-grid-container vads-u-padding--0">
          <h1 className="vads-u-margin-bottom--1 vads-u-margin-top--0">
            {config.formLabel}
          </h1>
          <div className="schemaform-title form-name">({config.formName})</div>
        </div>
        <FormRenderer config={config} data={data} />
      </div>
    );
  }
  return <div>Loading</div>;
};

export default App;
