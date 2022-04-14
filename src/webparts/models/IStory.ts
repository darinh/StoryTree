import { Guid } from "@microsoft/sp-core-library";
import { IChapter } from "./IChapter";

export interface IStory extends IChapter {
  id: Guid;
  title: string;
  chapters: IChapter[];
}