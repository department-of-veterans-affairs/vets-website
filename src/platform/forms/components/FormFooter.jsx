import React from 'react';

import AskVAQuestions from './AskVAQuestions';

export default class FormFooter extends React.Component {
  render() {
    const GetFormHelp = this.props.formConfig.getHelp;

    return (
      <div>
        <AskVAQuestions>
          {!!GetFormHelp && <GetFormHelp/>}
        </AskVAQuestions>
      </div>
    );
  }
}

// {!isConfirmationPage && <AskVAQuestions>
//   {!!GetFormHelp && <GetFormHelp/>}
// </AskVAQuestions>}
