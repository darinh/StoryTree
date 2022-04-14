import { Guid } from "@microsoft/sp-core-library";

export interface IPath {
  description: string;
  nextChapterId: Guid;
}