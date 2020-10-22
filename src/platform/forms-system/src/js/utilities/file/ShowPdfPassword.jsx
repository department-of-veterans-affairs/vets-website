import React from 'react';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';

class ShowPdfPassword extends React.Component {
  state = {
    // isEncrypted: false,
    field: {
      dirty: false,
      charMax: 255,
      value: '',
    },
  };

  render() {
    const { file, index, onSubmitPassword } = this.props;
    const { field } = this.state;
    const showError = field.dirty && !field.value;

    return (
      <>
        <ErrorableTextInput
          label={'PDF password'}
          errorMessage={
            showError && 'Please provide a password to decrypt this file'
          }
          name={`get_password_${index}`}
          required
          field={field}
          onValueChange={updatedField => {
            this.setState({ field: updatedField });
          }}
        />
        <button
          type="button"
          className="usa-button-primary va-button-primary vads-u-width--auto"
          onClick={() => {
            if (field.value) {
              onSubmitPassword(file, index, field.value);
            } else {
              this.setState({
                field: {
                  dirty: true,
                  charMax: 255,
                  value: '',
                },
              });
            }
          }}
        >
          Add password
        </button>
        <p />
      </>
    );
  }
}

const PasswordLabel = () => (
  <p>
    This is en encrypted PDF document. In order for us to be able to view the
    document, we will need the password to decrypt it.
  </p>
);

export { ShowPdfPassword, PasswordLabel };
