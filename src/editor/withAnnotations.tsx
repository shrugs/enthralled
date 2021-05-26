import { CustomEditor } from './editor';

export const withAnnotations = (editor: CustomEditor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === 'annotation' ? true : isInline(element);
  };

  return editor;
};
