import React, { useMemo } from 'react';
import { Descendant, Element, Node } from 'slate';

import enthralled from '../assets/enthralled.json';
import { Box, Separator } from '../components/basic';
import { Serialize } from '../components/Serialize';
import { AnnotationElement, FragmentElement } from '../editor/editor';
import { NavigationStack } from '../lib/NavigationStack';
import { styled } from '../stitches.config';

const Container = styled('main', {
  maxWidth: '86ch',
  mx: 'auto',
  px: '$4',
});

const ContentContainer = styled('div', {
  variants: {
    annotation: {
      true: {
        my: '$24',
      },
    },
  },
});

const makeFragment = (children: Descendant[]): FragmentElement => ({ type: 'fragment', children });

type TopLevelNode = FragmentElement | AnnotationElement;

function RenderFocusedContent() {
  const nav = NavigationStack.useContainer();
  const [prev, node]: [TopLevelNode | undefined, TopLevelNode] = useMemo(() => {
    let prev: TopLevelNode | undefined;
    let curr: TopLevelNode = makeFragment(enthralled as Descendant[]);
    for (const id of nav.stack) {
      for (const [node] of Node.nodes(curr)) {
        if (Element.isElement(node) && node.type === 'annotation' && node.id === id) {
          prev = makeFragment(node.children);
          curr = makeFragment(node.content);
          break;
        }
      }
    }

    return [prev, curr];
  }, [nav.stack]);

  return (
    <ContentContainer annotation={nav.stack.length > 0}>
      {prev && (
        <>
          <Serialize node={makeFragment(prev.children)} />
          <Separator />
        </>
      )}
      <Serialize node={node} />
    </ContentContainer>
  );
}

function NavigationBar() {
  const nav = NavigationStack.useContainer();

  if (nav.stack.length === 0) return null;

  return (
    <Box css={{ display: 'flex', fd: 'row' }}>
      <Box css={{ mr: '$8' }} onClick={() => nav.pop()}>
        {'<-'}
      </Box>
      <Box>{['Enthralled', ...nav.stack].join(' -> ')}</Box>
    </Box>
  );
}

export function Book() {
  return (
    <NavigationStack.Provider>
      <Container>
        <NavigationBar />
        <RenderFocusedContent />
      </Container>
    </NavigationStack.Provider>
  );
}
