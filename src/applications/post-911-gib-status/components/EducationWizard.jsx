import React from 'react';
import classNames from 'classnames';

import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

export default class EducationWizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      choices: [],
    };
  }

  answerQuestion = (field, answer) => {
    const { config } = this.props;
    const choices = Object.assign(this.state.choices, {
      [field]: answer === 'true',
    });
    let newState = { choices };
    const choiceIndex = config.findIndex(option => option.type === field);
    if (choiceIndex < config.length - 1) {
      const resetChoices = config.slice(choiceIndex + 1).reduce((acc, item) => {
        acc[item.type] = null;
        return acc;
      }, choices);
      newState = { choices: resetChoices };
    }
    this.setState(newState);
  };

  render() {
    const buttonClasses = classNames('usa-button-primary', 'wizard-button', {
      'va-button-primary': !this.state.open,
    });
    const contentClasses = classNames(
      'form-expanding-group-open',
      'wizard-content',
      {
        'wizard-content-closed': !this.state.open,
      },
    );

    return (
      <div className="wizard-container">
        <button
          aria-expanded={this.state.open ? 'true' : 'false'}
          aria-controls="wizardOptions"
          className={buttonClasses}
          onClick={() => this.setState({ open: !this.state.open })}
        >
          {this.props.toggleText}
        </button>
        <div className={contentClasses} id="wizardOptions">
          <div className="wizard-content-inner">
            {// eslint-disable-next-line array-callback-return, consistent-return
            this.props.config.map(choice => {
              const {
                type,
                label,
                isActive,
                previous,
                options,
                component: Component,
              } = choice;

              let shouldDisplayQuestion;
              if (Array.isArray(previous)) {
                shouldDisplayQuestion = isActive(this.state.choices);
              } else {
                shouldDisplayQuestion = isActive(this.state.choices[previous]);
              }
              if (shouldDisplayQuestion) {
                if (options) {
                  return (
                    <RadioButtons
                      additionalFieldsetClass="wizard-fieldset"
                      name={type}
                      id={type}
                      key={type}
                      options={options}
                      onValueChange={({ value }) =>
                        this.answerQuestion(type, value)
                      }
                      value={{ value: this.state.choices[type] }}
                      label={label}
                    />
                  );
                }
                return <Component key={type} />;
              }
            })}
          </div>
        </div>
      </div>
    );
  }
}
