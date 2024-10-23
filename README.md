# chunchunmaru-mde
[![](https://data.jsdelivr.com/v1/package/npm/chunmde/badge)](https://www.jsdelivr.com/package/npm/chunmde)
![npm](https://img.shields.io/npm/dt/chunmde?style=flat-square)
![NPM Version](https://img.shields.io/npm/v/chunmde)

Markdown editor based on [codemirror6](https://codemirror.net/)

## Features
- Key bindings
- Toolbars
- Commands:
  - heading
  - italic <Ctrl+i>
  - bold <Ctrl+b>
  - quote <Ctrl+Shift+e>
  - code <Ctrl+e>
  - link <Ctrl+k>
  - Unordered list <Ctrl+Shift+8>
- Plugins:
  - Image upload

## Usage

#### Browser
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Markdown editor in the browser</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chunmde@x.y.z/dist/chunmde.min.css">
</head>
<body>
  <div id="editor-container"></div>
  <script src="https://cdn.jsdelivr.net/npm/chunmde@x.y.z/dist/chunmde.bundle.min.js"></script>
  <script>
    const { createChunEditor, createImageUploadPlugin } = Chun
    
    const imageUploadPlugin = createImageUploadPlugin({
      imageUploadUrl: "", 
      imageFormats: ["image/jpg", "image/jpeg", "image/gif", "image/png", "image/bmp", "image/webp"],
    })

    const editor = createChunEditor({
      doc: initialContent.value,
      lineWrapping: true,
      indentWithTab: true,
      toolbar: true,
    })
    .use(imageUploadPlugin)
    .mount("editor-container")

    console.log(editor.getValue())
  </script>
</body>
</html>
```

## Contribute
- [Fork the repository](https://github.com/madeyoga/chunchunmaru-mde.git)!
- Clone your fork: `git clone https://github.com/your-username/chunchunmaru-mde.git`
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request :>
