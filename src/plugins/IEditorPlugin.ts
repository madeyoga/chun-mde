import { EditorView } from "@codemirror/view";

export default interface IEditorPlugin {
  createToolbarItem?: (editor: EditorView) => HTMLButtonElement,
  keybind?: {
    key: string;
    run: (view: EditorView) => boolean;
  },
}
