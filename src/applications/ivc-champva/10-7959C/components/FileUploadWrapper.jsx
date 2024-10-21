import FileFieldCustom from '../../shared/components/fileUploads/FileUpload';
import { requiredFiles, UPLOADS_COMPLETE_PATH } from '../config/constants';

// Wrap shared fileFieldCustom so we can pass the form-specific
// list of required uploads (for use with MissingFileOverview)
export default function FileFieldWrapped(props) {
  return FileFieldCustom({
    ...props,
    requiredFiles,
    // Since `MissingFileOverview` isn't the last page in this form, go to the
    // appropriate next page after all uploads are complete:
    uploadsCompletePath: UPLOADS_COMPLETE_PATH,
  });
}
