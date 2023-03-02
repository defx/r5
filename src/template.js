import { parse } from "./parse.js"

const cache = new Map()

/*

<p class="${"foo"} to ${"bar"}">to ${"baz"}</p>

->

<!-- ** -->
<p class="foo to bar">to <!-- * -->baz</p>


*/

function stars(n) {
  return new Array(n + 1).fill("*").join("")
}

function html(strings, ...values) {
  const L = values.length - 1

  const markup = strings.reduce((markup, string, i) => {
    let str = markup + string

    if (i > L) return str

    const isAttr = str.match(/(\w+-?\w+)=['"]{1}([^'"]*)$/)

    if (isAttr) {
      const startOpenTag = str.lastIndexOf("<")
      const placeholder = str.slice(0, startOpenTag).match(/<!-- (\*+) -->$/)

      if (placeholder) {
        const n = placeholder[1].length
        str =
          str.slice(0, startOpenTag) +
          `<!-- ${stars(n + 1)} -->` +
          str.slice(startOpenTag)
      } else {
        str =
          str.slice(0, startOpenTag) + `<!-- * -->` + str.slice(startOpenTag)
      }

      return str + values[i]
    }

    return str + "<!-- * -->" + values[i]
  }, "")

  return markup
}

// html`<div>${"0"}</div><p class="${"foo"} bar ${"baz"}">${"1"}</p>`

export function xhtml(strings, ...values) {
  const key = strings.join("%")

  if (!cache.has(key)) {
    cache.set(key, parse(strings))
  }

  return {
    $key: null,
    ...cache.get(key),
    v: values,
    key(k) {
      this.$key = k
      return this
    },
  }
}
