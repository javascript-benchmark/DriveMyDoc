import {DriveDocument} from './drive-document';
import {DriveFile} from './drive-file';

export interface DriveFolder extends DriveDocument {

  files: DriveFile[];
}
