export const mapStyles =
  (styleMap: Record<string, string | undefined>) =>
  (style: string | ReadonlyArray<string>): string => {
    if (typeof style === "string") {
      return lookupStyle(styleMap)(style);
    }
    return style.map(lookupStyle(styleMap)).join(" ");
  };

const lookupStyle =
  (styleMap: Record<string, string | undefined>) =>
  (style: string): string => {
    const compiledStyle = styleMap[style];
    if (compiledStyle === undefined) {
      const error = {
        styleMap,
        style,
      };
      throw new Error(`Can't find style definition: ${JSON.stringify(error)}`);
    }

    return compiledStyle;
  };
