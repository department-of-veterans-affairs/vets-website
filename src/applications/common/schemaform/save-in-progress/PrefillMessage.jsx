import React from 'react';
import { connect } from 'react-redux';

const message = 'We’ve prefilled some of your information from your account. If you need to correct anything, you can edit the form fields below.';

const TodoList = ({ prestartMessage }) => {
  return (<ul>
    {prestartMessage}
  </ul>);
};

// function PrefillMessage({ children, formContext }) {
//   if (!formContext.prefilled) {
//     return null;
//   }

//   return (
//     <div className="usa-alert usa-alert-info no-background-image schemaform-prefill-message">
//       {children || message}
//     </div>
//   );
// }

const getPrestartMessage = (status, filter) => {
  switch (filter) {
    case true:
      return status;
    case false:
      return null;
    default:
      return status;
  }
};

const mapStateToProps = state => {
  return {
    prestartMessage: getPrestartMessage(state.form.prestartStatus, state.form.displayPrestartMessage)
  };
};

const PrefillMessage = connect(
  mapStateToProps
)(TodoList);

export default PrefillMessage;
