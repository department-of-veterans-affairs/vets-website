import React from 'react';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';

import ErrorableFileInput from '../../common/components/form-elements/ErrorableFileInput';
import ProgressBar from '../../common/components/ProgressBar';
import { scrollAndFocus } from '../../common/utils/helpers';
import PhotoPreview from '../components/PhotoPreview';
import CropperController from '../components/CropperController';

const LARGE_SCREEN = 1201;
const MIN_SIZE = 350;

function isSmallScreen(width) {
  return  width < LARGE_SCREEN;
}

function onReviewPage(pageTitle) {
  return pageTitle === 'Photo review';
}

function isValidFileType(fileName, fileTypes) {
  return fileTypes.some(type => fileName.toLowerCase().endsWith(type));
}

function isValidImageSize(img) {
  return img.width >= MIN_SIZE && img.height >= MIN_SIZE;
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataUrl;
    img.onerror = (e) => reject(e);
    img.onload = () => {
      resolve(img);
    };
  });
}

function isSquareImage(img) {
  return img.width === img.height;
}

export default class PhotoField extends React.Component {
  constructor(props) {
    super(props);
    const formData = props.formData || {};
    let previewSrc;
    if (formData.file instanceof Blob) {
      previewSrc = window.URL.createObjectURL(formData.file);
    }

    this.state = {
      progress: 0,
      src: null,
      isCropping: false,
      previewSrc,
      previewProcessing: false
    };

    this.screenReaderPath = false;
  }

  componentWillMount() {
    this.detectDrag();
    this.detectWidth();
  }

  componentDidMount() {
    window.addEventListener('resize', this.detectWidth);
  }

  componentWillReceiveProps(nextProps) {
    const nextFormData = nextProps.formData || {};
    const prevFormData = this.props.formData || {};
    if (nextFormData.file instanceof Blob && nextFormData.file !== prevFormData.file) {
      if (this.state.previewSrc) {
        window.URL.revokeObjectURL(this.state.previewSrc);
      }
      this.setState({ previewSrc: window.URL.createObjectURL(nextFormData.file) });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.windowWidth !== this.state.windowWidth) {
      const cropper = this.refs.cropper;
      if (cropper) {
        this.setCropBox();
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const newFile = this.props.formData || {};
    const oldFile = prevProps.formData || {};
    const newState = this.state;
    if (newFile.errorMessage && oldFile.errorMessage !== newFile.errorMessage) {
      scrollAndFocus(document.querySelector('.usa-input-error-message'));
    } else if (prevState.isCropping !== newState.isCropping) {
      scrollAndFocus(document.querySelector('.border-box'));
    } else if (typeof this.props.formData === 'undefined' && this.props.formData !== prevProps.formData) {
      scrollAndFocus(document.querySelector('.border-box'));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.detectWidth);
    if (this.state.previewSrc) {
      window.URL.revokeObjectURL(this.state.previewSrc);
    }
  }

  onEdit = () => {
    this.setState({
      isCropping: true,
      fileName: this.props.formData.name,
      src: this.state.previewSrc,
      warningMessage: null
    });
  }


  onChangeScreenReader = (files) => {
    const file = files[0];

    this.screenReaderPath = true;

    const fileTypes = this.props.uiSchema['ui:options'].fileTypes;
    if (!isValidFileType(file.name, fileTypes)) {
      this.props.onChange({
        errorMessage: 'We weren’t able to upload your file. Please make sure the file you’re uploading is a jpeg, tiff, .gif, or .png file and try again.'
      });
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        loadImage(reader.result)
          .then((img) => {
            if (!isSquareImage(img)) {
              this.props.onChange({
                errorMessage: 'The photo you uploaded isn’t a square photo. Please upload a new one that fits the requirements.'
              });
            } else if (!isValidImageSize(img)) {
              this.props.onChange({
                errorMessage: 'The file you selected is smaller than the 350-pixel minimum file width or height and couldn’t be uploaded. Please try to upload a different photo.'
              });
            } else {
              this.setState({ progress: 0, warningMessage: null });
              this.props.formContext.uploadFile(
                file,
                this.props.onChange,
                this.props.uiSchema['ui:options'],
                this.updateProgress,
              ).catch(() => {
                // rather not use the promise here, but seems better than trying to pass
                // a blur function
                this.props.onBlur(this.props.idSchema.$id);
              });
            }
          });
      };
      reader.readAsDataURL(file);
    }
  }

  onChange = (files) => {
    this.screenReaderPath = false;
    this.setState({ dragActive: false });

    const fileTypes = this.props.uiSchema['ui:options'].fileTypes.concat('bmp');
    if (files && files[0]) {
      const file = files[0];
      const fileName = file.name;
      if (file.preview) {
        // dropzone recommendation
        window.URL.revokeObjectURL(file.preview);
      }
      if (!isValidFileType(fileName, fileTypes)) {
        this.props.onChange({
          errorMessage: 'We weren’t able to upload your file. Please make sure the file you’re uploading is a jpeg, tiff, .gif, .png, or .bmp file and try again.'
        });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          loadImage(reader.result)
            .then((img) => {
              if (!isValidImageSize(img)) {
                this.props.onChange({
                  errorMessage: 'The file you selected is smaller than the 350-pixel minimum file width or height and couldn’t be uploaded. Please try to upload a different photo.'
                });
              } else {
                // Clear any error messages
                this.props.onChange();
                this.setState({
                  src: img.src,
                  fileName,
                  isCropping: true
                });
              }
            })
            .catch(() => {
              this.props.onChange({
                errorMessage: 'Sorry, we weren’t able to load the image you selected.'
              });
            });
        };
        reader.readAsDataURL(file);
      }
    }

    this.setState({ warningMessage: '' });
  }

  onPreviewError = () => {
    this.setState({ previewProcessing: true });
  }

  uploadPhoto = (blob) => {
    this.setState({ isCropping: false, progress: 0, warningMessage: null });
    const file = blob;
    file.lastModifiedDate = new Date();
    file.name = 'profile_photo.png';
    this.props.formContext.uploadFile(
      file,
      (formData) => {
        if (formData.confirmationCode) {
          this.props.onChange(Object.assign({}, formData, {
            file
          }));
        } else {
          this.props.onChange(formData);
        }
      },
      this.props.uiSchema['ui:options'],
      this.updateProgress
    ).catch(() => {
      // rather not use the promise here, but seems better than trying to pass
      // a blur function
      // this.props.onBlur(this.props.idSchema.$id);
    });
  }

  resetFile = () => {
    this.props.onChange();
    this.setState({ isCropping: false });
  }

  updateProgress = (progress) => {
    this.setState({ progress });
  }

  detectWidth = () => {
    const windowWidth = window.innerWidth;
    this.setState({ windowWidth });
  }

  detectDrag = () => {
    const div = document.createElement('div');
    const supportsDragAndDrop = ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    const iOS = !!navigator.userAgent.match('iPhone OS') || !!navigator.userAgent.match('iPad');
    const dragAndDropSupported = supportsDragAndDrop && window.FileReader;
    this.setState({ dragAndDropSupported: dragAndDropSupported && !iOS });
  }

  handleDrag(dragActive) {
    this.setState(dragActive);
  }

  updatePreviewSrc = (src) => {
    this.setState({ previewSrc: src });
  }

  render() {
    const { formData, formContext } = this.props;
    const file = formData || {};
    const onReview = formContext.reviewMode;

    if (onReview) {
      return (
        <div className="va-growable-background">
          <PhotoPreview
            id={file.confirmationCode}
            className="photo-review"
            isLoggedIn={formContext.isLoggedIn}
            processing={this.state.previewProcessing}
            src={this.state.previewSrc}
            onUpdatePreview={this.updatePreviewSrc}
            onError={this.onPreviewError}/>
        </div>
      );
    }

    const { isCropping } = this.state;
    const hasFile = !!file.confirmationCode;
    const errorMessage = file.errorMessage;
    const screenReaderError = this.screenReaderPath && !!errorMessage;
    const label = this.props.uiSchema['ui:title'];
    const smallScreen = isSmallScreen(this.state.windowWidth) || onReviewPage(this.props.formContext.pageTitle);
    const fileTypes = this.props.uiSchema['ui:options'].fileTypes;
    const cropperTypes = fileTypes.concat('bmp');
    const progressBarContainerClass = classNames('schemaform-file-uploading', 'progress-bar-container');

    let fieldView;
    if (file.uploading) {
      fieldView = 'progress';
    } else if (isCropping) {
      fieldView = 'cropper';
    } else if (screenReaderError) {
      fieldView = 'error';
    } else if (hasFile && !isCropping) {
      fieldView = 'preview';
    } else if (!isCropping && !hasFile) {
      fieldView = 'initial';
    }

    let uploadMessage;
    if (smallScreen) {
      uploadMessage = <span>Upload <i className="fa fa-upload"></i></span>;
    } else if (fieldView === 'cropper') {
      uploadMessage = 'Upload a New Photo';
    } else {
      uploadMessage = 'Upload Your Photo';
    }

    let instruction;
    if (fieldView === 'cropper') {
      instruction = <span><strong>Step 2 of 2:</strong> Fit your head and shoulders in the frame.</span>;
    } else if (fieldView === 'initial') {
      instruction = <span><strong>Step 1 of 2:</strong> Upload a digital photo.</span>;
    }

    let description;
    if (fieldView === 'cropper') {
      description = <p>Move and resize your photo, so your head and shoulders fit in the square frame below. Click and drag, or use the arrow and magnifying buttons to help.</p>;
    } else if (fieldView === 'preview') {
      description = <div>Success! This photo will be printed on your Veteran ID Card.</div>;
    } else if (fieldView === 'initial' && this.state.dragAndDropSupported) {
      description = <p>Drag and drop your image into the square or click the upload button.</p>;
    }

    const uploadControlClass = classNames(
      'photo-input-container',
      {
        'photo-input-container-left': fieldView === 'error' || fieldView === 'preview',
      }
    );

    return (
      <fieldset>
        <legend className="schemaform-label photo-label">{label}<span className="form-required-span">(*Required)</span></legend>
        <div className={errorMessage ? 'error-box' : 'border-box'}>
          {fieldView === 'cropper' && <span className="sr-only">
            This is a photo editing tool that requires sight to use. If you're using a screen reader <button type="button" onClick={this.resetFile}>go back one step to upload your photo without cropping.</button>
          </span>}
          <div>
            {errorMessage && <div className="photo-error-wrapper">
              <div role="alert" className="usa-input-error-message photo-error-message">
                We’ve run into a problem.
                <p>{errorMessage}</p>
              </div>
              <a href="/veteran-id-card/how-to-upload-photo" target="_blank">
                Learn more about uploading a photo for your Veteran ID Card
              </a>
            </div>}
            {instruction}
            {!this.state.previewProcessing && description}
            {fieldView === 'preview' && hasFile && <PhotoPreview
              id={file.confirmationCode}
              className="photo-preview"
              isLoggedIn={formContext.isLoggedIn}
              processing={this.state.previewProcessing}
              src={this.state.previewSrc}
              onUpdatePreview={this.updatePreviewSrc}
              onError={this.onPreviewError}/>
            }
          </div>
          {fieldView === 'progress' && <div className={progressBarContainerClass}>
            <span>{this.state.fileName}</span><br/>
            <ProgressBar percent={this.state.progress}/>
          </div>}
          {fieldView === 'cropper' && <CropperController
            onDone={this.onDone}
            narrowLayout={smallScreen}
            onPhotoCropped={blob => this.uploadPhoto(blob)}
            src={this.state.src}/>
          }
          {fieldView === 'initial' && <div className="drop-target-container">
            <Dropzone
              className={`drop-target ${this.state.dragActive && 'drag-active'}`}
              onDragEnter={() => this.handleDrag({ dragActive: true })}
              onDragLeave={() => this.handleDrag({ dragActive: false })}
              onDrop={this.onChange}
              accept="image/jpeg, image/gif, image/jpg, image/png, image/tiff, image/tif, image/bmp">
              {this.state.dragActive ? <div className="drag-active-text">
                <span>DROP PHOTO</span>
              </div> : <img alt="placeholder" src="/img/photo-placeholder.png"/>}
            </Dropzone>
          </div>}
          <div className={uploadControlClass}>
            {fieldView === 'preview' && <button
              className="photo-preview-link va-button-link"
              type="button"
              onClick={this.resetFile}>
              Go back and change your photo
            </button>}
            {fieldView === 'preview' && !this.state.previewProcessing && <button
              className="photo-preview-link va-button-link"
              type="button"
              aria-describedby="editButtonDescription"
              onClick={this.onEdit}>
              Edit your photo
            </button>}
            {(fieldView === 'initial' || fieldView === 'cropper') && <ErrorableFileInput
              accept={cropperTypes.map(type => `.${type}`).join(',')}
              onChange={this.onChange}
              buttonText={uploadMessage}
              aria-describedby="croppingToolDescription"
              name="fileUpload"/>}
            {fieldView === 'initial' && <ErrorableFileInput
              accept={fileTypes.map(type => `.${type}`).join(',')}
              onChange={this.onChangeScreenReader}
              buttonText="Use our screen reader-friendly photo upload tool."
              aria-describedby="screenReaderPathDescription"
              triggerClass="va-button-link"
              name="screenReaderFileUpload"/>}
            {fieldView === 'error' && <ErrorableFileInput
              accept={fileTypes.map(type => `.${type}`).join(',')}
              onChange={this.onChangeScreenReader}
              buttonText="Upload Photo Again"
              name="screenReaderFileUpload"/>}
          </div>
          <span className="sr-only" id="croppingToolDescription">This button will take you to a photo cropping tool which requires sight to use. The recommended path for screen readers is to use the screen-reader friendly upload tool button.</span>
          <span className="sr-only" id="editButtonDescription">This button will take you into a photo cropping tool, which requires sight to use. This button is not recommended if you are using a screen reader.</span>
          <span className="sr-only" id="screenReaderPathDescription">This is the recommended path if you are using a screen reader. It will allow you to upload your photo without having to crop, as long as you have a photo that is square and at least 350 pixels wide.</span>
        </div>
      </fieldset>
    );
  }
}
