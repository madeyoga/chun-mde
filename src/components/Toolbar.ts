import { EditorView } from "@codemirror/view"
import { italic } from '../commands/Italic'
import { bold } from "../commands/Bold"
import { code } from "../commands/Code"
import { link } from "../commands/Link"
import { quote } from "../commands/Quote"
import { ul } from "../commands/BulletedList"
import { heading } from "../commands/Heading"

interface ToolbarButton {
  text: string,
  icon: string,
  action: () => boolean
}

export class Toolbar {
  public buttonActions: ToolbarButton[]
  public dom: Element

  constructor(editor: EditorView, toolbarItems: ((editor: EditorView) => HTMLElement)[] = []) {
    this.buttonActions = [
      {
        text: "Add heading text",
        icon: "mdi:format-header-3",
        action: () => heading(editor),
      },
      {
        text: "Add bold text, <Ctrl+b>",
        icon: "mdi:format-bold",
        action: () => bold(editor),
      },
      {
        text: "Add italic text, <Ctrl+i>",
        icon: "mdi:format-italic",
        action: () => italic(editor),
      },
      {
        text: "Add a quote, <Ctrl+Shift+.>",
        icon: "mdi:format-quote-close",
        action: () => quote(editor),
      },
      {
        text: "Add code, <Ctrl+e>",
        icon: "mdi:code-tags",
        action: () => code(editor),
      },
      {
        text: "Add a link, <Ctrl+k>",
        icon: "mdi:link-variant",
        action: () => link(editor),
      },
      {
        text: "Add a bulleted list, <Ctrl+Shift+8>",
        icon: "mdi:format-list-bulleted",
        action: () => ul(editor),
      },
    ]

    const toolbarElement = document.createElement("div") as Element
    toolbarElement.className += " chunmde-toolbar"

    for (let btnSpec of this.buttonActions) {
      const buttonElement = document.createElement("button")
  
      // iconify web component
      const icon = document.createElement("iconify-icon")
      icon.className += "iconify "
      icon.setAttribute("icon", btnSpec.icon)
      icon.setAttribute("inline", "false")
      icon.setAttribute("width", "16")
      icon.setAttribute("height", "16")
  
      buttonElement.appendChild(icon)
      buttonElement.onclick = btnSpec.action
      buttonElement.setAttribute("alt", btnSpec.text)
      buttonElement.title = btnSpec.text
      buttonElement.setAttribute("type", "button")
  
      toolbarElement.appendChild(buttonElement)
    }

    for (let createToolbarItem of toolbarItems) {
      toolbarElement.appendChild(createToolbarItem(editor))
    }

    this.dom = toolbarElement
  }
}

export function createToolbar(editorView: EditorView): Toolbar {
  return new Toolbar(editorView)
}
