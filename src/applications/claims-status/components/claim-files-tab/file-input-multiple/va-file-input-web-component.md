# This is the va-file-input code from the VA web component repo pasted here SIMPLY FOR REFERENCE
- This file's home is found here: https://github.com/department-of-veterans-affairs/component-library/blob/e276b24d9292c2a5f8b2cde3cc2073c9b92a8404/packages/web-components/src/components/va-file-input/va-file-input.tsx
- This file is purely to more easily reference that code
- This file's imports are not valid because this file's code was just pasted here for reference

``` tsx
/* eslint-disable i18next/no-literal-string */
import {
  Component,
  Element,
  Host,
  h,
  Prop,
  Fragment,
  Event,
  EventEmitter,
  State,
  Watch,
  forceUpdate,
} from '@stencil/core';
import { i18next } from '../..';
import { fileInput } from './va-file-input-upgrader';
import { extensionToMimeType } from './fileExtensionToMimeType';
import { UploadedFile } from './uploadedFile';

/**
 * @componentName File input
 * @maturityCategory caution
 * @maturityLevel available
 * @guidanceHref form/file-input
 */

@Component({
  tag: 'va-file-input',
  styleUrl: 'va-file-input.scss',
  shadow: true,
})
export class VaFileInput {
  private fileInputRef!: HTMLInputElement;
  private uploadStatus: 'idle' | 'success' = 'idle';
  private fileType?: string;

  @Element()
  el: HTMLElement;
  @State()
  file?: File;
  @State()
  fileContents?: string;
  @State()
  internalError?: string;
  @State()
  showModal: boolean = false;
  @State()
  showSeparator: boolean = true;

  /**
   * The label for the file input.
   */
  @Prop()
  label?: string;

  /**
   * The name for the input element.
   */
  @Prop()
  name?: string;

  /**
   * The text displayed on the button.
   */
  @Prop()
  buttonText: string;

  /**
   * The value attribute for the file view element.
   */
  @Prop()
  value?: File;

  /**
   * Sets the input to required and renders the (*Required) text.
   */
  @Prop()
  required?: boolean = false;

  /**
   * A comma-separated list of unique file type specifiers.
   */
  @Prop()
  accept?: string;

  /**
   * The error message to render.
   */
  @Prop()
  error?: string;

  /**
   * Optional hint text.
   */
  @Prop()
  hint?: string;

  /**
   * Optional file status, ex: "Uploading...", "Uploaded".
   */
  @Prop()
  statusText?: string;

  /**
   * Custom instructional message in the file input.
   */
  @Prop()
  uploadMessage?: HTMLElement = null;

  /**
   * Emit component-library-analytics events on the file input change event.
   */
  @Prop()
  enableAnalytics?: boolean = false;

  /**
   * Optionally specifies the size of the header element to use instead of the base label.
   * Accepts a number from 1 to 6, corresponding to HTML header elements h1 through h6.
   * If not provided, defaults to standard label styling.
   */
  @Prop()
  headerSize?: number;

  /**
   * DST only prop
   * removes extraneous display for multiple file input
   */
  @Prop()
  headless?: boolean = false;

  /**
   * Optionally displays the read-only view
   */
  @Prop()
  readOnly?: boolean = false;

  /**
   * When true shows a password field
   */
  @Prop()
  encrypted?: boolean = false;

  /**
   * Object representing a previously uploaded file. Example: `{ name: string, type: string, size: number}`
   */
  @Prop()
  uploadedFile?: UploadedFile;

  /**
   * Maximum allowed file size in bytes.
   */
  @Prop()
  maxFileSize?: number = Infinity;

  /**
   * Percent upload completed. For use with va-progress-bar component
   */
  @Prop({ mutable: true })
  percentUploaded?: number = null;

  /**
   * The event emitted when the file input value changes.
   */
  @Event()
  vaChange: EventEmitter;

  /**
   * The event used to track usage of the component. This is emitted when the
   * file input changes and enableAnalytics is true.
   */
  @Event({
    eventName: 'component-library-analytics',
    composed: true,
    bubbles: true,
  })
  componentLibraryAnalytics: EventEmitter;

  @Watch('statusText')
  handleValueChange(value) {
    //This won't be read if its not in a timeout due to other messages being read.
    setTimeout(() => {
      this.updateStatusMessage(value);
    });
  }

  @Watch('percentUploaded')
  percentHandler(value: number) {
    if (value >= 100) {
      this.resetState();
    }
  }

  /**
   * called when file has been uploaded
   * or file upload has been cancelled
   * only relevant when percentUploaded specified
   */
  private resetState() {
    this.fileContents = null;
    this.uploadStatus = 'idle';
    this.percentUploaded = null;
    forceUpdate(this.el);
  }

  private handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
    input.value = '';
  };

  private handleDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.handleFile(files[0]);
    }
  };

  private handleFile = (file: File, emitChange: boolean = true) => {
    if (this.accept) {
      const normalizedAcceptTypes = this.normalizeAcceptProp(this.accept);
      if (!this.isAcceptedFileType(file.type, normalizedAcceptTypes)) {
        this.removeFile(false);
        this.internalError = 'This is not a valid file type.';
        return;
      }
    }

    if (file.size > this.maxFileSize) {
      this.internalError = `
        We can't upload your file because it's too big. Files must be less than ${this.formatFileSize(
          this.maxFileSize,
        )}.`;
      // in case the file was added by clicking the "change file" button do a reset
      this.fileContents = null;
      this.uploadStatus = 'idle';
      return;
    }

    this.uploadedFile = null;
    this.file = file;
    if (emitChange) {
      this.vaChange.emit({ files: [this.file] });
    }
    this.uploadStatus = 'success';
    this.internalError = null;
    this.generateFileContents(this.file);
    this.updateStatusMessage(`You have selected the file: ${this.file.name}`);
    this.el.focus();

    if (this.enableAnalytics) {
      this.componentLibraryAnalytics.emit({
        componentName: 'va-file-input',
        action: 'change',
        details: {
          label: this.label,
        },
      });
    }
  };

  private removeFile = (notifyParent: boolean = true) => {
    this.closeModal();
    this.uploadStatus = 'idle';
    this.internalError = null;
    if (notifyParent) {
      this.vaChange.emit({ files: [] });
    }
    this.file = null;
    this.uploadedFile = null;
    this.updateStatusMessage(`File removed. No file selected.`);
    this.el.focus();
  };

  private openModal = () => {
    // set the status attribute here not in markup or it will have no effect
    const modal = this.el.shadowRoot.querySelector('va-modal');
    modal.setAttribute('status', 'warning');
    this.showModal = true;
  };

  private closeModal = () => {
    this.showModal = false;
    // wait a tick for modal to close before setting focus
    setTimeout(() => {
      this.fileInputRef.focus();
    }, 0);
  };

  private changeFile = () => {
    if (this.fileInputRef) {
      this.fileInputRef.click();
    }
  };

  private updateStatusMessage(message: string) {
    // Add delay to encourage screen reader readout
    setTimeout(() => {
      const statusMessageDiv = this.el.shadowRoot.querySelector(
        '#statusMessage',
      );
      statusMessageDiv ? (statusMessageDiv.textContent = message) : '';
    }, 1000);
  }

  /**
   * Converts the size of a file from bytes to a more human-readable format for
   * rendering the file size label. This function calculates the file size in
   * appropriate units (B, KB, MB, GB, TB) based on the size provided. It uses
   * logarithmic scaling to determine the unit, then formats the size to one
   * decimal place for units KB and above.
   *
   * @param {number} filesSize - The size of the file in bytes.
   * @returns {string} The file size formatted as a string with the appropriate unit.
   */
  private formatFileSize = (filesSize): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (filesSize === 0) return '0 B';

    const unitIndex = Math.floor(Math.log(filesSize) / Math.log(1024));
    if (unitIndex === 0) return `${filesSize} ${units[unitIndex]}`;

    const sizeInUnit = filesSize / Math.pow(1024, unitIndex);
    const formattedSize = sizeInUnit.toFixed(unitIndex < 2 ? 0 : 1);
    return `${formattedSize}\xa0${units[unitIndex]}`;
  };

  private normalizeAcceptProp = (accept: string): string[] => {
    return accept.split(',').map(item => {
      item = item.trim();
      return item.startsWith('.') ? extensionToMimeType[item] : item;
    });
  };

  private isAcceptedFileType = (
    fileType: string,
    acceptedTypes: string[],
  ): boolean => {
    for (const type of acceptedTypes) {
      if (type === fileType) {
        return true;
      }
      if (type.endsWith('/*') && fileType.startsWith(type.slice(0, -1))) {
        return true;
      }
    }
    return false;
  };

  private renderLabelOrHeader = (
    label: string,
    required: boolean,
    headerSize?: number,
  ) => {
    const requiredSpan = required ? (
      <span class="required"> {i18next.t('required')}</span>
    ) : null;
    if (headerSize && headerSize >= 1 && headerSize <= 6) {
      const HeaderTag = `h${headerSize}` as keyof JSX.IntrinsicElements;
      return (
        <div class="label-header">
          <HeaderTag
            htmlFor="fileInputField"
            part="label"
            class="label-header-tag"
          >
            {label}
            {requiredSpan}
          </HeaderTag>
        </div>
      );
    } else {
      return (
        <div class="label-header">
          <label htmlFor="fileInputField" part="label" class="usa-label">
            {label}
            {requiredSpan}
          </label>
        </div>
      );
    }
  };

  private generateFileContents(file: File) {
    if (!file) return;

    const reader = new FileReader();
    this.fileType = file.type;

    reader.onloadend = () => {
      this.fileContents = reader.result as string;
    };

    if (
      this.fileType &&
      (this.fileType === 'application/pdf' ||
        this.fileType.startsWith('image/'))
    ) {
      reader.readAsDataURL(file);
    }
  }

  /**
   * This method checks if there is "additional info" content in the default slot,
   * or if a file has been uploaded and the change/delete buttons need to show,
   * and shows or hides the "separator" horizontal rule as needed.
   */
  componentWillRender() {
    const hasSlottedContent = !!this.el.querySelector(':scope > *');
    const needsButtons = (!!this.value || !!this.file) && !this.readOnly;
    this.showSeparator = hasSlottedContent || needsButtons;
  }

  componentDidLoad() {
    fileInput.init(this.el);
  }

  connectedCallback() {
    this.el.addEventListener('change', this.handleChange);
  }

  disconnectedCallback() {
    this.el.removeEventListener('change', this.handleChange);
  }

  private getDefaultUploadMessage() {
    return (
      <span>
        Drag a file here or{' '}
        <span class="file-input-choose-text">choose from folder</span>
      </span>
    );
  }

  render() {
    const {
      label,
      name,
      required,
      accept,
      error,
      hint,
      file,
      uploadStatus,
      uploadMessage,
      headerSize,
      fileContents,
      fileType,
      headless,
      value,
      readOnly,
      encrypted,
      statusText,
      uploadedFile,
      percentUploaded,
    } = this;

    if (value && !this.file) {
      this.handleFile(value, false);
    }

    const displayError = this.error || this.internalError;
    const ariaDescribedbyIds =
      `${hint ? 'input-hint-message' : ''} ${
        displayError ? 'input-error-message' : ''
      }`.trim() || null; // Null so we don't add the attribute if we have an empty string
    const fileInputTargetClasses = `file-input-target ${
      displayError ? 'file-input-target-error' : ''
    }`.trim();

    let fileThumbnail = (
      <div class="thumbnail-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          fill="#07648d"
          width="40px"
          height="40px"
        >
          <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
        </svg>
      </div>
    );
    if (error) {
      fileThumbnail = (
        <div class="thumbnail-container">
          <va-icon
            icon="error"
            size={3}
            class="thumbnail-preview thumbnail-error"
          />
        </div>
      );
    } else if (fileContents) {
      if (fileType.startsWith('image/')) {
        fileThumbnail = (
          <div class="thumbnail-container" aria-hidden="true">
            <img class="thumbnail-preview" src={fileContents} alt="image" />
          </div>
        );
      } else if (fileType === 'application/pdf') {
        fileThumbnail = (
          <div class="thumbnail-container" aria-hidden="true">
            <object
              class="thumbnail-preview"
              data={fileContents}
              type="application/pdf"
            />
          </div>
        );
      }
    }
    let selectedFileClassName = headless
      ? 'headless-selected-files-wrapper'
      : 'selected-files-wrapper';
    const hintClass = 'usa-hint' + (headless ? ' usa-sr-only' : '');

    const showProgBar = percentUploaded !== null && percentUploaded < 100;

    let statusClassNames = 'file-status-label';
    if (showProgBar) {
      statusClassNames = `${statusClassNames} uploading-status`;
    }

    return (
      <Host class={{ 'has-error': !!displayError }}>
        {!readOnly && (
          <span class={{ 'usa-sr-only': !!headless }}>
            {label && this.renderLabelOrHeader(label, required, headerSize)}
          </span>
        )}
        {hint &&
          !readOnly && (
            <div class={hintClass} id="input-hint-message">
              {hint}
            </div>
          )}
        <div class="file-input-wrapper" onDrop={this.handleDrop}>
          <input
            id="fileInputField"
            class="file-input"
            style={{
              visibility:
                this.uploadStatus === 'success' || uploadedFile
                  ? 'hidden'
                  : 'unset',
            }}
            type="file"
            ref={el => (this.fileInputRef = el as HTMLInputElement)}
            name={name}
            accept={accept}
            aria-describedby={ariaDescribedbyIds}
            onChange={this.handleChange}
          />
          {uploadStatus === 'idle' &&
            !uploadedFile && (
              <div>
                <span id="file-input-error-alert" role="alert">
                  {displayError && (
                    <Fragment>
                      <span class="usa-sr-only">{i18next.t('error')}</span>
                      <span class="usa-error-message">{displayError}</span>
                    </Fragment>
                  )}
                </span>
                <div
                  class="usa-sr-only"
                  aria-live="polite"
                  id="statusMessage"
                />
                <div class={fileInputTargetClasses}>
                  <div class="file-input-box" />
                  <div class="file-input-instructions">
                    {!!uploadMessage
                      ? uploadMessage
                      : this.getDefaultUploadMessage()}
                  </div>
                </div>
              </div>
            )}
          {(uploadStatus !== 'idle' || uploadedFile) && (
            <div class={selectedFileClassName}>
              {!headless && (
                <div class="selected-files-label">
                  {readOnly ? 'Files you uploaded' : 'Selected files'}
                </div>
              )}
              <div class="usa-sr-only" aria-live="polite" id="statusMessage" />
              <va-card class="va-card">
                <div class="file-info-section">
                  {fileThumbnail}
                  <div class="file-info-group vads-u-line-height--2">
                    <span class="file-label">
                      {file ? file.name : uploadedFile.name}
                    </span>
                    {displayError && (
                      <span id="input-error-message" role="alert">
                        <span class="usa-sr-only">{i18next.t('error')}</span>
                        <span aria-live="polite" class="usa-error-message">
                          {displayError}
                        </span>
                      </span>
                    )}
                    {!showProgBar && (
                      <span class="file-size-label">
                        {this.formatFileSize(
                          file ? file.size : uploadedFile.size,
                        )}
                      </span>
                    )}
                    <span class={statusClassNames} aria-live="polite">
                      {showProgBar ? 'Uploading...' : statusText}
                    </span>
                  </div>
                </div>
                {(file || value || uploadedFile) && (
                  <div>
                    {this.showSeparator && <hr class="separator" />}
                    {encrypted && (
                      <va-text-input label="File password" required />
                    )}
                    <div class="additional-info-slot">
                      <slot />
                    </div>
                    {!readOnly ? (
                      showProgBar ? (
                        <Fragment>
                          <va-progress-bar percent={percentUploaded} />
                          <va-button-icon
                            buttonType="cancel"
                            onClick={this.resetState.bind(this)}
                          />
                        </Fragment>
                      ) : (
                        <Fragment>
                          <div class="file-button-section">
                            <va-button-icon
                              buttonType="change-file"
                              onClick={this.changeFile}
                              label="Change file"
                              aria-label={`change file ${
                                file ? file.name : uploadedFile.name
                              }`}
                            />
                            <va-button-icon
                              buttonType="delete"
                              onClick={this.openModal}
                              aria-label={`delete file ${
                                file ? file.name : uploadedFile.name
                              }`}
                              label="Delete"
                            />
                          </div>
                          <va-modal
                            modalTitle="Delete this file?"
                            visible={this.showModal}
                            primaryButtonText="Yes, remove this"
                            secondaryButtonText="No, keep this"
                            onCloseEvent={this.closeModal}
                            onPrimaryButtonClick={() => this.removeFile(true)}
                            onSecondaryButtonClick={this.closeModal}
                          >
                            We'll remove the uploaded document{' '}
                            <span class="file-label">
                              {file ? file.name : uploadedFile.name}
                            </span>
                          </va-modal>
                        </Fragment>
                      )
                    ) : null}
                  </div>
                )}
              </va-card>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
```
