import React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';

export function Element(props: RenderElementProps) {
  const { attributes, children, element } = props;

  switch (element.type) {
    default:
      return <p {...attributes}>{children}</p>;
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'code':
      return (
        <pre>
          <code {...attributes}>{children}</code>
        </pre>
      );
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>;
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>;
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>;
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'link':
      return (
        <a href={element.url} {...attributes}>
          {children}
        </a>
      );
    case 'image':
      return <ImageElement {...props} />;
  }
}

function ImageElement({ attributes, children, element }: RenderElementProps) {
  if (element.type !== 'image') throw new Error(`<ImageElement /> expects image`);

  // const selected = useSelected();
  // const focused = useFocused();

  return (
    <div {...attributes}>
      {children}
      <img
        src={element.url}
        alt="idk"
        // className={css`
        //   display: block;
        //   max-width: 100%;
        //   max-height: 20em;
        //   box-shadow: ${selected && focused ? '0 0 0 2px blue;' : 'none'};
        // `}
      />
    </div>
  );
}

export function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  const Element = leaf.bold
    ? 'strong'
    : leaf.code
    ? 'code'
    : leaf.italic
    ? 'em'
    : leaf.underline
    ? 'u'
    : leaf.strikethrough
    ? 'del'
    : 'span';

  return (
    <Element
      style={{
        backgroundColor: leaf.redacted ?? undefined,
      }}
      {...attributes}
    >
      {children}
    </Element>
  );
}
