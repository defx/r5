<div align="center">

# @defx/r5

## HTML Renderer

## declarative • minimalist • isomorphic

</div>
<br />

@defx/r5 is a small JavaScript library consisting of two essential utility functions that can be used to create and render HTML templates. R5's minimalist design is small and flexible enough to fit into any UI architecture, no matter how simple or complex.

R5 templates are written in standard JavaScript with Template Literals.

```js
import { html, render } from "@defx/r5"

// create a template with the html tag function
const helloWorld = (name) => html`<p>Hello ${name} 👋</p>`

// render a template to the DOM
render(helloWorld("Kimberley"), document.body)

// effeciently update the existing DOM
render(helloWorld("Thea"), document.body)
```

### Installation via NPM

```sh
npm install @defx/r5
```

### Installation via CDN

```js
import { html, render } from "https://www.unpkg.com/@defx/r5"
```

## API

### html

The HTML function is a Tag Function that accepts an HTML Template Literal. It returns an R5 template object, which is essentially a description of what needs to be rendered.

### render

The render function takes an R5 template object and renders it to the provided DOM node. Subsequent invocations of the render function cause the existing DOM to be efficiently updated in only the places where values have changed.

#### isomorphism

When invoked on the server side, this function will always return a String of HTML, so it may be used in the same way for both server and client-side rendering.

#### hydration

You may also re-render server-rendered html in the browser to "hydrate" the event bindings (R5 will ignore the DOM update step if it sees that the existing HTML matches the generated template object)

## known limitations

If any of these things are holding you back, please raise an issue with a description of your use case

- unquoted attributes attribute are not fully supported
