import { useCallback, useMemo, useState } from 'react';
import { generatePath, useHistory, useParams } from 'react-router';
import { createContainer } from 'unstated-next';

const SEP = `~`;
const serialize = (stack: string[]) => (stack.length === 0 ? undefined : stack.join(SEP));
const deserialize = (stack: string) => (stack ? stack.split(SEP) : []);

// NOTE: don't pop root, duh
function useNavigationStack() {
  const history = useHistory();
  const [focusedAnnotationId, focusAnnotationId] = useState<string>();

  const params: { stack: string } = useParams();
  const stack = useMemo(() => deserialize(params.stack), [params]);
  const setStack = useCallback(
    (stack: string[]) => history.push(generatePath(`/:stack?`, { stack: serialize(stack) })),
    [],
  );

  const push = useCallback(
    (id) => {
      focusAnnotationId(() => undefined);
      setStack([...stack, id]);
    },
    [stack],
  );

  const pop = useCallback(() => {
    focusAnnotationId(() => undefined);
    history.goBack(); // we use native go back for scroll restoration instead of popping stack directly
  }, [stack]);

  // only defocus if nothing else is focused
  const defocus = useCallback(
    (id: string) => focusAnnotationId((_id) => (_id === id ? undefined : _id)),
    [],
  );

  return { stack, push, pop, focusedAnnotationId, defocus, focus: focusAnnotationId };
}

export const NavigationStack = createContainer(useNavigationStack);
