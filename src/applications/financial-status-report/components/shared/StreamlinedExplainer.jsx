import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import SharedExplainer from './SharedExplainer';

const StreamlinedExplainer = ({ goBack, goForward, setFormData }) => {
  const formData = useSelector(state => state.form.data);

  return (
    <SharedExplainer
      headline="You can skip questions on this form"
      paragraph1="Based on your responses so far, you’re tentatively eligible for debt relief. We don’t need to ask you any more questions."
      paragraph2="After you submit your request, we’ll mail you a letter with more details."
      goBack={goBack}
      goForward={goForward}
      setFormData={setFormData}
      data={formData}
      explainerType="Streamlined"
    />
  );
};

StreamlinedExplainer.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default StreamlinedExplainer;
