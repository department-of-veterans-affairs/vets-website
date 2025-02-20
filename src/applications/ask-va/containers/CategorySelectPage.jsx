import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { setCategoryID } from '../actions';
import RequireSignInModal from '../components/RequireSignInModal';
import SignInMayBeRequiredCategoryPage from '../components/SignInMayBeRequiredCategoryPage';
import { ServerErrorAlert } from '../config/helpers';
import { URL, getApiUrl } from '../constants';

const CategorySelectPage = props => {
  const { onChange, isLoggedIn, goToPath, formData, goBack, router } = props;
  const dispatch = useDispatch();

  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const showError = data => {
    if (data.selectCategory) {
      goToPath('/category-topic-2');
    }
    focusElement('va-select');
    return setValidationError('Please select a category');
  };

  const handleChange = event => {
    const selectedValue = event.detail.value;
    const selected = apiData.find(
      category => category.attributes.name === selectedValue,
    );
    if (selected.attributes.requiresAuthentication && !isLoggedIn) {
      setShowModal(true);
    } else {
      dispatch(setCategoryID(selected.id)); // askVA store categoryID
      onChange({
        ...formData,
        categoryId: selected.id,
        selectCategory: selectedValue,
        allowAttachments: selected.attributes.allowAttachments,
      });
    }
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

        <FormNavButtons
          goBack={() => (isLoggedIn ? goBack() : router.push('/'))}
          goForward={() => showError(formData)}
        />
      </form>

      <RequireSignInModal
        onClose={() => setShowModal(false)}
        show={showModal}
        restrictedItem="category"
      />
    </>
  ) : (
    <ServerErrorAlert />
  );
};

CategorySelectPage.propTypes = {
  formData: PropTypes.object,
  goBack: PropTypes.func,
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
  };
}

export default connect(mapStateToProps)(withRouter(CategorySelectPage));
