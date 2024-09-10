import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { setCategoryID } from '../actions';
import RequireSignInModal from '../components/RequireSignInModal';
import SignInMayBeRequiredCategoryPage from '../components/SignInMayBeRequiredCategoryPage';
import { ServerErrorAlert } from '../config/helpers';
import { CHAPTER_1, URL, envUrl, requireSignInCategories } from '../constants';

const CategorySelectPage = props => {
  const { onChange, loggedIn, goBack, goToPath, formData } = props;
  const dispatch = useDispatch();

  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [showModal, setShowModal] = useState({ show: false, selected: '' });

  const onModalNo = () => {
    isLoading(true);
    onChange({ ...formData, selectCategory: undefined });
    setShowModal({ show: false, selected: '' });
    setTimeout(() => isLoading(false), 200);
  };

  const showError = data => {
    if (data.selectCategory) {
      goToPath('/category-topic-2');
    }
    focusElement('va-select');
    return setValidationError('Please select a category');
  };

  const handleChange = event => {
    const selectedValue = event.detail.value;
    const selected = apiData.find(cat => cat.attributes.name === selectedValue);
    localStorage.removeItem('askVAFiles');
    if (requireSignInCategories.includes(selectedValue) && !loggedIn) {
      setShowModal({ show: true, selected: `${selectedValue}` });
    } else {
      dispatch(setCategoryID(selected.id));
      onChange({ ...formData, selectCategory: selectedValue });
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
      getApiData(`${envUrl}${URL.GET_CATEGORIES}`);
    },
    [loggedIn],
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
          messageAriaDescribedby={CHAPTER_1.PAGE_1.QUESTION_1}
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

        <FormNavButtons goBack={goBack} goForward={() => showError(formData)} />
      </form>

      <RequireSignInModal
        onClose={onModalNo}
        show={showModal.show}
        restrictedItem={showModal.selected}
      />
    </>
  ) : (
    <ServerErrorAlert />
  );
};

CategorySelectPage.propTypes = {
  id: PropTypes.string,
  loggedIn: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
    formData: state.form.data,
  };
}

export default connect(mapStateToProps)(CategorySelectPage);
