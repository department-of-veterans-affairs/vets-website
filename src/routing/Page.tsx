import React from 'react';

import { Form, Formik } from 'formik';
import { Route, useRouteMatch } from 'react-router-dom';
import { PageProps } from './types';
import { buildRelativePath } from '../utils/helpers';

/**
 * Renders the page contents
 *
 * @beta
 */
export default function Page(props: PageProps): JSX.Element {
  const handleSubmit = () => {
    console.log('submiting');
  };

  const { path } = useRouteMatch();
  const combinedPath = buildRelativePath(path, props.path);

  return (
    <Route path={combinedPath}>
      <div className="vads-u-display--flex vads-u-align-items--center vads-u-flex-direction--column">
        <h1>{props.title}</h1>
        <Formik initialValues={{}} onSubmit={handleSubmit}>
          <Form>{props.children}</Form>
        </Formik>
      </div>
    </Route>
  );
}
