import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNextPagePath,
  getPreviousPagePath,
} from 'platform/forms-system/src/js/routing';
import { setData } from 'platform/forms-system/src/js/actions';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import definition from '../config/chapters/vaBenefits/benefitsPackage';
import FormFooter from '../components/FormFooter';
import content from '../locales/en/content.json';

const AuthBenefitsPackagePage = ({ location, route, router }) => {
  const { data: formData } = useSelector(state => state.form);
  const [localData, setLocalData] = useState({});
  const dispatch = useDispatch();

  const uiSchema = useMemo(
    () => ({
      ...definition.uiSchema,
      ...titleUI({
        title: content['benefits--reg-only-title'],
        description: content['benefits--reg-only-description'],
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
    }),
    [],
  );

  const handlers = useMemo(
    () => {
      const { pathname } = location;
      const { pageList } = route;
      return {
        goBack: () =>
          router.push(getPreviousPagePath(pageList, formData, pathname)),
        onChange: data => {
          setLocalData(data);
          dispatch(
            setData({
              ...formData,
              'view:vaBenefitsPackage': data['view:vaBenefitsPackage'],
            }),
          );
        },
        onSubmit: () =>
          router.push(getNextPagePath(pageList, formData, pathname)),
      };
    },
    [dispatch, formData, location, route, router],
  );

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
            schema={definition.schema}
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
