import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { EditorState, EditorStateConfig } from '@codemirror/state'
import { keymap, ViewUpdate, EditorView, KeyBinding } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { indentWithTab } from "@codemirror/commands"
import { italicKeyBinding } from './commands/Italic'
import { boldKeyBinding } from "./commands/Bold"
import { codeKeyBinding } from "./commands/Code"
import { linkKeyBinding } from "./commands/Link"
import { quoteKeyBinding } from "./commands/Quote"
import { ulKeyBinding } from "./commands/BulletedList"
import { Toolbar } from "./components/Toolbar"
import IEditorPlugin from "./plugins/IEditorPlugin"
import { createImageUploadPlugin } from "./plugins/ImageUpload"

interface ChunInterface {
  dom: Element,
  toolbar: Toolbar,
  editor: EditorView,
  getValue: () => string,
}

interface ChunConfig extends EditorStateConfig {
  onUpdateListener?: (update: ViewUpdate) => void,
  toolbar: boolean,
  indentWithTab: boolean,
  lineWrapping: boolean,
  toolbarItems: ((editor: EditorView) => HTMLElement)[],
}

const ChunMDE = function ChunMDE(this: ChunInterface, containerId: string, customConfig: ChunConfig = {
  doc: "",
  toolbar: true,
  indentWithTab: true,
  lineWrapping: false,
  toolbarItems: []
}) {
  const parentElement = document.getElementById(containerId) as Element

  const config: EditorStateConfig = {
    doc: customConfig.doc,
    extensions: customConfig.extensions,
  }

  /** CodeMirror6's EditorView */
  const editorView = new EditorView({
    state: EditorState.create(config)
  })

  parentElement.className += " chunmde-container"

  // toolbar
  if (customConfig.toolbar) {
    const toolbar = new Toolbar(editorView, customConfig.toolbarItems)
    parentElement.appendChild(toolbar.dom)
    this.toolbar = toolbar
  }
  parentElement.appendChild(editorView.dom)

  /** Shortcut to get the editor value */
  this.getValue = () => {
    return editorView.state.doc.toString()
  }

  this.dom = parentElement
  this.editor = editorView
} as any as { new (containerId: string, customConfig?: ChunConfig): ChunInterface; }

interface IEditorBuilder {
  use: (plugin: IEditorPlugin) => IEditorBuilder;
  mount: (selector: string) => void;
}

export function createChunEditor(customConfig: ChunConfig = {
  doc: "",
  toolbar: true,
  indentWithTab: true,
  lineWrapping: false,
  toolbarItems: [],
}): IEditorBuilder {

  const defaultKeybinds = [
    italicKeyBinding,
    boldKeyBinding,
    codeKeyBinding,
    linkKeyBinding,
    quoteKeyBinding,
    ulKeyBinding,
  ]

  const defaultExtensions = [
    keymap.of(defaultKeybinds),
    markdown({ base: markdownLanguage }),
    basicSetup,
  ]

  const keybinds: KeyBinding[] = []
  const toolbarItemDelegates: ((editor: EditorView) => HTMLButtonElement)[] = []

  return {
    use(plugin) {
      if (plugin.keybind) {
        keybinds.push(plugin.keybind)
      }

      if (plugin.createToolbarItem) {
        toolbarItemDelegates.push(plugin.createToolbarItem)
      }

      return this
    },
    mount(selector) {

      if (customConfig.onUpdateListener) {
        defaultExtensions.push(EditorView.updateListener.of(customConfig.onUpdateListener!))
      }
      if (customConfig.lineWrapping) {
        defaultExtensions.push(EditorView.lineWrapping)
      }
      if (customConfig.indentWithTab) {
        keybinds.push(indentWithTab)
      }

      defaultExtensions.push(keymap.of(keybinds))
      customConfig.extensions = defaultExtensions
      customConfig.toolbarItems = toolbarItemDelegates

      return new ChunMDE(selector, customConfig)
    },
  }
}

interface IGlobalChunEditor {
  createChunEditor: () => IEditorBuilder,
  createImageUploadPlugin: (imageUploadUrl: string, imageFormats: string[]) => IEditorPlugin,
}

declare global {
  interface Window { ChunMDE: typeof ChunMDE; Chun: IGlobalChunEditor }
}

const Chun = { 
  createChunEditor, 
  createImageUploadPlugin,
}

window.ChunMDE = ChunMDE
window.Chun = Chun;

export default Chun;

