import {BehaviorSubject} from 'rxjs';

export interface DriveDocument {
  id: string;
  name: string;
  mimeType: string;
  parents: string[];
  webViewLink: string;
  iconLink: string;
  files: DriveDocument[];
  webContentLink: string;
  filesChange: BehaviorSubject<DriveDocument[]>;

}
