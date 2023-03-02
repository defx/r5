// import { ATTRIBUTE, TEXT } from "../src/constants.js"

const getParts = (value) =>
  value
    .trim()
    .split(/({{[^{}]+}})/)
    .filter((v) => v)
    .map((value) => {
      let match = value.match(/{{([^{}]+)}}/)
      return match ? [1, +match[1].trim()] : [0, value]
    })

const ATTRIBUTE = "ATTR"
const TEXT = "TEXT"
const EMPTY = 1

function parse(strings) {
  const m = {}

  let html = ""
  let openAttr = false
  let attrName
  let attrVal

  function map(type, index) {
    const tags = (html.match(/(<[\w!])/g) || []).length
    const text = (html.match(/(>[^<]+<)/g) || []).length
    const k = tags + text
    const entry = {
      type,
    }
    if (type === ATTRIBUTE) {
      entry.name = attrName
      entry.parts = getParts(attrVal)
    }
    if (type === TEXT) {
      entry.index = index
    }
    m[k] = m[k] || []
    m[k].push(entry)
  }

  strings.forEach((str, i) => {
    html += str

    if (openAttr) {
      const m = str.match(/([\s\w]*)['"]/)

      openAttr = !!!m
      if (!openAttr) {
        attrVal += m[1]
        map(ATTRIBUTE)
      }
    } else {
      const m = str.match(/(\w+)=['"]{1}([^'"]*)$/)
      if (m) {
        attrName = m[1]
        attrVal = m[2]
      }
      openAttr = !!m
    }

    if (i === strings.length - 1) return

    if (openAttr) {
      html += `{{${i}}}`
      attrVal += `{{${i}}}`
    } else {
      html += `<!--{{${EMPTY}}}-->`
      map(TEXT, i)
    }
  })

  // ...
  return { m, t: html }
}

describe("parse", () => {
  it("...", () => {
    const html = `<section><p class="foo {{0}} bar">{{1}}and{{2}}</p>{{3}}<a onclick='{{4}}'>{{5}}and{{6}}</a></section><span>{{7}}</span>`

    const parts = [
      `<section><p class="foo `,
      ` bar">`,
      `and`,
      `</p>`,
      `<a onclick='`,
      `'>`,
      `and`,
      `</a></section><span>`,
      `</span>`,
    ]

    const { m, t } = parse(parts)

    console.log(t, JSON.stringify(m, null, 2))
  })
})