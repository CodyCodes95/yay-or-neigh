import Code from "@editorjs/code";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import BreakLine from "editorjs-break-line";
export const EDITOR_TOOLS = {
  code: Code,
  // header: Header,
  paragraph: Paragraph,
  breakLine: {
    class: BreakLine,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+ENTER",
  },
};
