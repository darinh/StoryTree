import { Guid } from "@microsoft/sp-core-library";
import { IPath } from "./IPath";

export interface IChapter {
  id: Guid;
  content: string;
  paths: IPath[];
  author: {
    displayName: string;
    email: string;
  };
}