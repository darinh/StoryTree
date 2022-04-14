import { DefaultButton, Label, PrimaryButton, Stack, TextField } from '@fluentui/react';
import { Guid } from '@microsoft/sp-core-library';
import * as React from 'react';
import { IPath } from '../../../models/IPath';
import { INewChapterProps as IChapterProps } from './IChapterProps';

const createNewPath: () => IPath = () => ({
  description: '', nextChapterId: Guid.newGuid()
});

export const Chapter: React.FC<IChapterProps> = (props: IChapterProps) => {
  const { newChapter } = props;

  const [content, setContent] = React.useState<string>(props.content);
  const [paths, setPaths] = React.useState<IPath[]>(props.paths);
  
  React.useEffect(() => {
    setContent(props.content);
    setPaths(props.paths);
  }, [props]);

  console.log('rendering chapter');
  console.dir(props);
  console.dir(`content: ${content}`);
  console.dir(`paths: ${JSON.stringify(paths)}`);

  return newChapter ? (
    <div>
      <Label>Content:</Label>
      <TextField
        value={content}
        onChange={(_, newValue) => setContent(newValue)}
      />
      <br />
      <Label>Paths:</Label>
      {paths.map(path => (
        <TextField
          value={path.description}
          onChange={(_, newValue) => {
            const newPath = {
              ...path,
              description: newValue
            };
            const newPaths = [...paths];
            newPaths[newPaths.indexOf(path)] = newPath;
            setPaths(newPaths);
          }}
        />
      ))}

      <Stack horizontalAlign='space-between' horizontal>
        <DefaultButton
          text='New Path'
          onClick={(_) => setPaths([...paths, createNewPath()])}
        />
        <PrimaryButton
          text='Finish'
          onClick={(_) => props.onSave({
            id: props.id,
            author: props.author,
            content,
            paths
          })}
        />
      </Stack>
    </div>
  )
    : (
      <div>
        <p>{content}</p>
        <Stack>
          {
            paths.map(path => [
              <DefaultButton
                text={path.description}
                onClick={(_) => props.onNextChapter(path.nextChapterId)}
              />,
              <br/>
            ])
          }
        </Stack>
      </div>
    );

};