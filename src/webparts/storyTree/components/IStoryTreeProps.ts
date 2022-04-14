import { IStory } from "../../models/IStory";

export interface IStoryTreeProps {
  stories: IStory[];
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  userEmail: string;
  onSave(stories: IStory[]);
}