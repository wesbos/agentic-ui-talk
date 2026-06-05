declare module 'highlight.js/lib/core' {
  type LanguageFn = (...args: unknown[]) => unknown;

  const hljs: {
    registerLanguage(name: string, language: LanguageFn): void;
    highlightElement(element: HTMLElement): void;
  };

  export default hljs;
}

declare module 'highlight.js/lib/languages/javascript' {
  const language: (...args: unknown[]) => unknown;
  export default language;
}

declare module 'highlight.js/lib/languages/json' {
  const language: (...args: unknown[]) => unknown;
  export default language;
}

declare module 'highlight.js/lib/languages/xml' {
  const language: (...args: unknown[]) => unknown;
  export default language;
}
