import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNextPagePath,
  getPreviousPagePath,
} from 'platform/forms-system/src/js/routing';
import { focusElement } from 'platform/utilities/ui';
import { setData } from 'platform/forms-system/src/js/actions';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import definition from '../config/chapters/vaBenefits/benefitsPackage';
import RegistrationOnlyDescription from '../components/FormDescriptions/RegistrationOnlyDescription';
import FormFooter from '../components/FormFooter';
import content from '../locales/en/content.json';

const AuthBenefitsPackagePage = props => {
  const { location, route, router } = props;
  const { pathname } = location;
  const { pageList } = route;
  const { schema } = definition;
  const uiSchema = {
    ...definition.uiSchema,
    ...titleUI({
      title: content['benefits--reg-only-title'],
      description: RegistrationOnlyDescription,
      headerLevel: 2,
      headerStyleLevel: 3,
    }),
  };

  const { data: formData } = useSelector(state => state.form);
  const [localData, setLocalData] = useState({});
  const dispatch = useDispatch();

  const handlers = {
    goBack: () => {
      const prevPagePath = getPreviousPagePath(pageList, formData, pathname);
      router.push(prevPagePath);
    },
    onChange: data => {
      setLocalData(data);
      dispatch(
        setData({
          ...formData,
          'view:vaBenefitsPackage': data['view:vaBenefitsPackage'],
        }),
      );
    },
    onSubmit: () => {
      const nextPagePath = getNextPagePath(pageList, formData, pathname);
      router.push(nextPagePath);
    },
  };

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <>
      <FormTitle
        title={content['page-title--before-you-begin']}
        subTitle={content['form-subtitle']}
      />
      <div className="progress-box progress-box-schemaform vads-u-padding-x--0">
        <div className="vads-u-margin-y--2 form-panel">
          <SchemaForm
            name="Benefits package form"
            title="Benefits package form"
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={handlers.onSubmit}
            onChange={handlers.onChange}
            data={localData}
          >
            <FormNavButtons goBack={handlers.goBack} submitToContinue />
          </SchemaForm>
        </div>
      </div>
      <FormFooter />
    </>
  );
};

AuthBenefitsPackagePage.propTypes = {
  location: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
};

export default AuthBenefitsPackagePage;
