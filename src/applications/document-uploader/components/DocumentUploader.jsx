import React from 'react';
import { RegardingSelector } from './RegardingSelector';
import { DocumentUploaderMetadata } from './DocumentUploaderMetaData';
import CallToActionAlert from '../../../platform/site-wide/cta-widget/CallToActionAlert';

export class DocumentUploader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="document-uploader">
        <h1>Digitally send a document to the VA</h1>
        <div className='va-introtext'>
          <p> You can send a document using our new <b>Digital Mail</b> feature. It's the same as faxing or mailing a document to the VA, just <i>easier</i> and <i>faster</i>. </p>
        </div>
        <hr />
        <h2>Digital Mail</h2>
        <RegardingSelector 
          veteran={this.props.veteran} 
          setVeteran={this.props.setVeteran} />
        { this.props.veteran.regarding && 
            <div>
              <CallToActionAlert
                heading='Have you tried the Claims Tool?'
                status='info'
                alertText='For faster claims service and the ability to review uploaded documents online you can always use the ebenefits claims tool. To continue using digital mail complete the form below'
              />
              <DocumentUploaderMetadata 
                {...this.props}
              />
            </div>
        }


      </div>
    );
  }
}
