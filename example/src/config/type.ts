import { TypeDefinition, TypeDefinitionHeadlines } from "@muybuen/type";

export const customHeadline: TypeDefinitionHeadlines = {
  "display-xxl": {
    _id: "headline-display-xxl",
    classAlias: ["main-headline"],
    fontWeight: "bold",
    clamp: [15, 40],
    lineHeight: 0.8,
    letterSpacing: "-0.05em",
  },
  "display-xl": {
    _id: "headline-display-xl",
    fontWeight: "bold",
    clamp: [4.5, 9],
    letterSpacing: "-0.05em",
  },
  "display-lg": {
    _id: "headline-display-lg",
    fontWeight: "bold",
    clamp: [3.5, 5],
    letterSpacing: "-0.05em",
    lineHeight: 1,
  },
  "display-md": {
    _id: "headline-display-md",
    fontWeight: "bold",
    clamp: [3, 4],
    letterSpacing: "-0.05em",
    lineHeight: 1,
  },
  "display-sm": {
    _id: "headline-display-sm",
    fontWeight: "bold",
    clamp: [1.5, 2],
    letterSpacing: "-0.05em",
    lineHeight: 1,
  },
  "display-xs": {
    _id: "headline-display-xs",
    fontWeight: "bold",
    clamp: [1, 1],
    letterSpacing: "-0em",
    lineHeight: 1,
  },
};

export const customTexts: Record<
  "body" | "string" | "caption",
  TypeDefinition
> = {
  body: {
    fontWeight: "normal",
    fontSize: "1rem",
    lineHeight: 1.25,
    textTransform: "none",
  },
  string: {
    fontWeight: "normal",
    fontSize: "1rem",
    letterSpacing: ".12em",
    lineHeight: 1.25,
    textTransform: "uppercase",
  },
  caption: {
    fontWeight: "normal",
    fontSize: ".75rem",
    lineHeight: 1.25,
  },
};
