import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { clearFormData, removeAskVaForm, setCategoryID } from '../actions';
import SignInMayBeRequiredCategoryPage from '../components/SignInMayBeRequiredCategoryPage';
import { ServerErrorAlert } from '../config/helpers';
import { URL, getApiUrl, hasPrefillInformation } from '../constants';
import { askVAAttachmentStorage } from '../utils/StorageAdapter';

const CategorySelectPage = props => {
  const {
    onChange,
    isLoggedIn,
    formData,
    goBack,
    goForward,
    router,
    formId,
  } = props;
  const dispatch = useDispatch();
  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const isLOA3 = useSelector(state => state.user.profile.loa.current === 3);

  const showError = () => {
    if (formData.selectCategory) {
      goForward(formData);
    }
    focusElement('va-select');
    return setValidationError('Please select a category');
  };

  const handleChange = event => {
    const selectedValue = event.detail.value;

    if (!selectedValue || selectedValue === '') {
      // Clear form data when no category is selected
      dispatch(setCategoryID(null));
      onChange({
        ...formData,
        categoryId: null,
        selectCategory: '',
        allowAttachments: false,
        categoryRequiresSignIn: false,
        requireSignInLogic: {
          ...formData.requireSignInLogic,
          category: false,
        },
        contactPreferences: [],
      });
      return;
    }

    const selected = apiData.find(
      category => category.attributes.name === selectedValue,
    );

    if (!selected) return;

    dispatch(setCategoryID(selected.id));

    (async () => {
      await askVAAttachmentStorage.clear();
    })();

    const initialData =
      formData.initialFormData === undefined
        ? { ...formData }
        : { ...formData.initialFormData };

    onChange({
      ...formData,
      hasPrefillInformation: hasPrefillInformation(formData),
      // FOR TESTING PREFILL LOCALLY
      // hasPrefillInformation: true,
      // aboutYourself: {
      //   first: 'Wallace',
      //   middle: 'R',
      //   last: 'Webb',
      //   dateOfBirth: '1950-09-13',
      // },
      // schoolInfo: {
      //   schoolFacilityCode: '31002144',
      //   schoolName: 'WESTERN GOVERNORS UNIVERSITY',
      // },
      // businessPhone: '333444555556',
      // businessEmail: 'test@business.email',
      /// /
      initialFormData: initialData,
      categoryId: selected.id,
      selectCategory: selectedValue,
      allowAttachments: selected.attributes.allowAttachments,
      contactPreferences: selected.attributes.contactPreferences,
      categoryRequiresSignIn:
        selected.attributes.requiresAuthentication && !isLOA3,
      requireSignInLogic: formData.requireSignInLogic
        ? {
            ...formData.requireSignInLogic,
            category: selected.attributes.requiresAuthentication,
          }
        : {
            category: selected.attributes.requiresAuthentication,
            topic: false,
            personQuestionIsAbout: false,
          },
    });
  };

  const getApiData = url => {
    isLoading(true);
    return apiRequest(url)
      .then(res => {
        setApiData(res.data);
        isLoading(false);
      })
      .catch(() => {
        isLoading(false);
        hasError(true);
      });
  };

  useEffect(
    () => {
      getApiData(getApiUrl(URL.GET_CATEGORIES));
    },
    [isLoggedIn],
  );

  useEffect(
    () => {
      focusElement('h2');
    },
    [loading],
  );

  const handleGoBack = () => {
    if (!hasPrefillInformation(formData)) {
      dispatch(clearFormData());
      dispatch(removeAskVaForm(formId));
      router.push('/');
    } else {
      goBack();
    }
  };

  if (loading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  return !error ? (
    <>
      <SignInMayBeRequiredCategoryPage />
      <h3>Category</h3>
      <form className="rjsf">
        <VaSelect
          id="root_selectCategory"
          label="Select the category that best describes your question"
          name="Select category"
          value={formData.selectCategory}
          onVaSelect={handleChange}
          required
          error={validationError}
          uswds
        >
          {apiData.map(category => (
            <option
              key={category.id}
              value={category.attributes.name}
              id={category.id}
            >
              {category.attributes.name}
            </option>
          ))}
        </VaSelect>

        <FormNavButtons goBack={handleGoBack} goForward={() => showError()} />
      </form>
    </>
  ) : (
    <ServerErrorAlert />
  );
};

CategorySelectPage.propTypes = {
  formData: PropTypes.object,
  formId: PropTypes.string,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  id: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  router: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
    formData: state.form.data,
    formId: state.form.formId,
  };
}

export default connect(mapStateToProps)(withRouter(CategorySelectPage));
