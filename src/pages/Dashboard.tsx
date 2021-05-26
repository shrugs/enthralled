import isHotkey from 'is-hotkey';
import React, { useCallback, useEffect, useState } from 'react';
import { createEditor, Descendant, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';

import { Box } from '../components/basic';
import { ToolbarButton, ToolbarRoot } from '../components/Toolbar';
import { CustomEditor } from '../editor/editor';
import { Element, Leaf } from '../editor/Render';
import { withAnnotations } from '../editor/withAnnotations';
import { withChapters } from '../editor/withChapters';
import { withHtml } from '../editor/withHtml';

const EMPTY_VALUE: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
];

function doAnnotate(editor: CustomEditor) {
  const id = window.prompt('What annotation number is this?');
  if (!id) {
    window.alert("didn't understand that sorry");
    return;
  }

  Transforms.wrapNodes(
    editor,
    {
      type: 'annotation',
      id,
      content: [{ text: '' }],
      children: [],
    },
    { split: true },
  );
}

function doChapter(editor: CustomEditor) {
  const title = window.prompt('Chapter Title ("Chapter -1")');
  if (!title) {
    window.alert('need title');
    return;
  }

  Transforms.insertNodes(editor, [
    {
      type: 'chapter',
      title,
      children: [{ text: '' }],
    },
    { type: 'paragraph', children: [{ text: '' }] },
  ]);
}

export function Dashboard() {
  const [value, setValue] = useState<Descendant[]>(EMPTY_VALUE);
  const [jsonValue, setJsonValue] = useState('');

  useEffect(() => {
    setJsonValue(JSON.stringify(value, null, 2));
  }, [value]);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const [editor] = useState(() =>
    withChapters(withAnnotations(withHtml(withHistory(withReact(createEditor() as any))))),
  );

  return (
    <Box css={{ height: '$screen', display: 'flex', fd: 'row' }}>
      <Box css={{ w: '$half', p: '$2' }}>
        <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
          <ToolbarRoot>
            <ToolbarButton onMouseDown={() => doAnnotate(editor)}>
              Annotate Selection (mod+shift+a)
            </ToolbarButton>
            <ToolbarButton onMouseDown={() => doChapter(editor)}>
              Insert Chapter (mod+shift+c)
            </ToolbarButton>
          </ToolbarRoot>
          <Editable
            style={{ height: '100%' }}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Paste in some HTML..."
            spellCheck
            autoFocus
            onKeyDown={(event) => {
              if (isHotkey('mod+shift+a', event as any)) {
                event.preventDefault();
                doAnnotate(editor);
              }

              if (isHotkey('mod+shift+c', event as any)) {
                event.preventDefault();
                doChapter(editor);
              }
            }}
          />
        </Slate>
      </Box>
      <Box css={{ w: '$half', p: '$2', display: 'flex', flexDirection: 'column' }}>
        <ToolbarRoot>
          <ToolbarButton
            onClick={() => {
              try {
                setValue(JSON.parse(jsonValue));
              } catch (error) {
                alert('invalid json');
              }
            }}
          >
            Commit Back
          </ToolbarButton>
        </ToolbarRoot>
        <Box
          as="textarea"
          css={{ flex: '1', fontSize: '$xs' }}
          onChange={(e) => setJsonValue(e.target.value)}
          value={jsonValue}
        ></Box>
      </Box>
    </Box>
  );
}
