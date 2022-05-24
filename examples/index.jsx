import React from 'react';
import ReactDOM from 'react-dom';
import FormApp from './multi-page';

import '@department-of-veterans-affairs/component-library/dist/main.css';
import {defineCustomElements} from '@department-of-veterans-affairs/component-library';
import schema from './multi-page/schema';
import {transformJSONSchema} from "@department-of-veterans-affairs/va-forms-system-core/utils/helpers";

void defineCustomElements();

const schemaKeys = transformJSONSchema(schema);

const Main = () => {
  return (
    <>
      <FormApp basename="/" initialValues={schemaKeys}/>
    </>
  )
}

ReactDOM.render(<Main/>, document.getElementById('root'));
