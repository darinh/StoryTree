import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { DefaultButton, Label, Link, TextField } from '@fluentui/react';
import styles from './StoryTree.module.scss';
import { IStoryTreeProps } from './IStoryTreeProps';
import { IStory } from '../../models/IStory';
import { IChapter } from '../../models/IChapter';
import { Chapter } from './chapters/Chapter';
import { Guid } from '@microsoft/sp-core-library';

const storyTitleId = `storyTitle-${Guid.newGuid()}`;

const isNewStory: (story: IStory) => boolean = (story) => {
  return story.chapters === undefined;
};

export const StoryTree: React.FC<IStoryTreeProps> = (props: IStoryTreeProps) => {
  const {
    isDarkTheme,
    environmentMessage,
    hasTeamsContext,
    userDisplayName,
    userEmail
  } = props;

  const [stories, setStories] = React.useState<IStory[]>(props.stories ?? []);
  const [currentStory, setCurrentStory] = React.useState<IStory>({
    id: Guid.newGuid(),
    author: {
      displayName: userDisplayName,
      email: userEmail
    },
    chapters: undefined,
    content: '',
    paths: [],
    title: ''
  });
  const [currentChapter, setCurrentChapter] = React.useState<IChapter>(undefined);

  React.useEffect(() => props.onSave(stories), [stories]);
  return (
    <section className={`${styles.storyTree} ${hasTeamsContext ? styles.teams : ''}`}>
      {isNewStory(currentStory)
        ? [
          <div className={styles.welcome}>
            <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
            <h2>Welcome to StoryTree!</h2>
            <div>Select a story to read or create a new story.</div>
          </div>,
          <div>
            <h3>New Story</h3>
            <Label htmlFor={storyTitleId}>Story Title</Label>
            <TextField
              id={storyTitleId}
              onChange={(_, newValue) => {
                setCurrentStory({
                  ...currentStory,
                  title: newValue
                });
              }}
            />
            <Label>First Chapter:</Label>
            <Chapter newChapter
            {...currentStory}
            onSave={(chapter) => {
              const story: IStory = {
                ...currentStory,
                content: chapter.content,
                paths: chapter.paths,
                chapters: [] // makes it not new anymore
              };
              setCurrentStory(story);
              setCurrentChapter(story);
              const newStories = [...stories, story];
              setStories(newStories);
            }}
            />
            <h3> Stories</h3>
            {stories?.map(story => (<DefaultButton
              text={`${story.title} - Created By: ${story.author.displayName}`}
              onClick={(_) => {
                setCurrentStory(story);
                setCurrentChapter(story);
              }}
            />))}
          </div>
        ]
        : [
          <div>
            <h2>{currentStory.title} - Created By: <Link href={`mailto:${currentStory.author.email}`} >{currentStory.author.displayName}</Link></h2>
          </div>,
          <div>
            {
              <Chapter
                newChapter={currentChapter.content.length === 0}
                {...currentChapter}
                onSave={(chapter) => {
                  const story: IStory = {
                    ...currentStory,
                    chapters: [
                      ...currentStory.chapters,
                      chapter
                    ]
                  };

                  const newStories = [...stories];
                  newStories[props.stories.indexOf(currentStory)] = story;

                  setStories(newStories);
                  setCurrentStory(story);
                }}
                onNextChapter={(nextChapterId) => {
                  console.log(`onNextChapter: ${nextChapterId.toString()}`);
                  let nextChapter: IChapter = {
                    id: nextChapterId,
                    content: '',
                    paths: [],
                    author: {
                      displayName: userDisplayName,
                      email: userEmail
                    }
                  };

                  for (let i = 0; i < currentStory.chapters.length; i++) {
                    const chapter = currentStory.chapters[i];
                    if (chapter.id === nextChapterId) {
                      console.log(`nextChapterFound at index ${i}`);
                      console.dir(currentStory.chapters[i]);
                      nextChapter = currentStory.chapters[i];
                      i = currentStory.chapters.length;
                    }
                  }

                  console.log('next chapter will be');
                  console.dir(nextChapter);
                  setCurrentChapter(nextChapter);
                }}
              />
            }
          </div>
        ]
      }


    </section >
  );
};
