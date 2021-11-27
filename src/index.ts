import { isObservable, toJS } from 'mobx';

export const NAME_RULE = 'MOBX_FORMATTER';

export const DEFAULT_STYLE = {
  background: '#00ff5a12',
  borderRadius: '4px',
  padding: '0 3px;',
};

export default function(
  window: Window,
  mobx: {
    isObservable: typeof isObservable;
    toJS: typeof toJS;
  },
  optiuns: {
    style: Partial<CSSStyleDeclaration>;
  } = {
    style: DEFAULT_STYLE,
  },
) {
  const style = Object.entries(optiuns.style).reduce((acum, [key, value]) => {
    return acum + `${kebabize(key)}: ${value}; `;
  }, '');
  
  const w = window as any;
  removeMobxFormatter(w);
  
  w.devtoolsFormatters = [
    ...w.devtoolsFormatters,
    {
      type: NAME_RULE,
      header(obj: unknown) {
        try {
          if (isInstance(obj) || !mobx.isObservable(obj)) {
            return null;
          }
          return [
            'div',
            {
              style,
            },
            [
              'object',
              {
                object: mobx.toJS(obj),
              },
            ],
          ];
        } catch (e) {
          return null;
        }
      },
      hasBody() {
        return false;
      },
    },
  ];
}

export function removeMobxFormatter(window: Window) {
  const w = window as any;
  w.devtoolsFormatters = w.devtoolsFormatters || [];
  
  w.devtoolsFormatters = w.devtoolsFormatters.filter((item: { type?: string }) => item.type === NAME_RULE);
}

function isInstance(v: unknown) {
  if (typeof v === 'object') {
    return (
      v?.constructor?.name !== 'Object' &&
      v?.constructor?.name !== 'Array' &&
      v?.constructor?.name !== 'Set' &&
      v?.constructor?.name !== 'Map'
    );
  }
  return false;
}

function kebabize(str: string) {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
}
