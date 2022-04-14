import { Guid } from "@microsoft/sp-core-library";
import { IChapter } from "../../../models/IChapter";

export interface INewChapterProps extends IChapter {
  newChapter?: boolean;  
  onSave: (chapter: IChapter) => void;
  onNextChapter?: (chapterId: Guid) => void;
}