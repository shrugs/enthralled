import { CustomEditor } from './editor';

export const withChapters = (editor: CustomEditor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === 'chapter' ? false : isInline(element);
  };

  return editor;
};
