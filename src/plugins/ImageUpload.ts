import { EditorView } from "@codemirror/view";
import IEditorPlugin from "./IEditorPlugin"
import { EditorSelection } from "@codemirror/state";
import { trimSelection } from "../commands/Utilities";


function wrapImageUrl(view: EditorView, imageUrl: string) {
  
  const transaction = view.state.changeByRange((range) => {
    const originalText = view.state.sliceDoc(range.from, range.to)
    const { text, rangeFrom, rangeTo } = trimSelection(originalText, range)

    const newText = `![${text}](${imageUrl})`

    const transaction = {
      changes: {
        from: rangeFrom,
        insert: newText,
        to: rangeTo,
      },
      range: EditorSelection.range(rangeFrom + 2, rangeFrom + 2 + text.length),
    }

    return transaction
  })

  view.dispatch(transaction)
  return 
}


export const createImageUploadPlugin: (config: any) => IEditorPlugin = (
  config: any = {
    imageUploadUrl: "",
    imageFormats: ["image/jpg", "image/jpeg", "image/gif", "image/png", "image/bmp", "image/webp"],
  }
) => {

  return {
    createToolbarItem: (editor: EditorView) => {

      const fileInput = document.createElement("input")
      fileInput.type = "file"
      fileInput.style.display = "none";

      fileInput.setAttribute("accept", config.imageFormats.join(","))
      fileInput.addEventListener("change", async (event) => {
        const files = (event.target as HTMLInputElement).files
        if (files && files[0]) {
          const formData = new FormData();
          
          formData.append('image', files[0]);

          const resp = await fetch(config.imageUploadUrl, {
            method: "POST",
            body: formData,
          })

          if (resp.ok) {
            const obj = await resp.json()
            wrapImageUrl(editor, obj.url)
          }
          else {
            const text = await resp.text()
            alert("Error uploading image: " + resp.status + resp.statusText + text)
          }
        }
      })

      const icon = document.createElement("iconify-icon")
      icon.className += "iconify "
      icon.setAttribute("icon", "mdi:image-outline")
      icon.setAttribute("inline", "false")
      icon.setAttribute("width", "16")
      icon.setAttribute("height", "16")

      const buttonElement = document.createElement("button")
      buttonElement.appendChild(icon)
      buttonElement.setAttribute("alt", "Select and upload an image")
      buttonElement.setAttribute("title", "Select and upload an image")
      buttonElement.setAttribute("type", "button")
      buttonElement.addEventListener("click", () => {
        fileInput.click()
      })

      buttonElement.appendChild(fileInput)

      return buttonElement
    },
    // keybind: {
    //   key: "",
    //   run: (editor) => {
    //     fileInput.click()
    //     return true
    //   },
    // }
  }
}