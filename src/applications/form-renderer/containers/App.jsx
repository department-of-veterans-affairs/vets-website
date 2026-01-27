import React, { useState, useEffect } from 'react';
import FormRenderer from 'platform/form-renderer/FormRenderer';
import { getData } from '../config/utilities';
import '../sass/form-renderer.scss';

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
          <h1 className="vads-u-margin-bottom--1 vads-u-margin-top--4">
            {config.formLabel}
            <span className="schemaform-title"> ({config.formName})</span>
          </h1>
          <div className="subheading">
            <span>
              OMB Version {config.formVersion}, Release {config.formRelease}
            </span>
            <br />
            <span>
              Signed electronically and submitted via VA.gov at{' '}
              {data.date_submitted}.
            </span>
          </div>
        </div>
        <FormRenderer config={config} data={data} />
      </div>
    );
  }
  return <div>Loading</div>;
};

export default App;
