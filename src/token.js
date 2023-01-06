import { getValueAtPath } from "./helpers.js"

const VALUE = 1
const KEY = 2
const FUNCTION = 3

export const hasMustache = (v) => v.match(/({{[^{}]+}})/)

export const parseMustache = (v) => v.match(/{{([^{}]+)}}/)[1]?.trim()

export const getParts = (value) =>
  value
    .trim()
    .split(/({{[^{}]+}})/)
    .filter((v) => v)
    .map((value) => {
      let match = value.match(/{{([^{}]+)}}/)

      if (!match)
        return {
          type: VALUE,
          value,
        }

      value = +match[1].trim()

      return {
        type: KEY,
        value,
      }
    })

export const getValueFromParts = (target, parts) => {
  return parts.reduce((a, part) => {
    let { type, value, negated } = part

    let v

    if (type === VALUE) v = value
    if (type === KEY) {
      v = getValueAtPath(value, target)
    }
    if (type === FUNCTION) {
      let args = part.args.map((value) => getValueAtPath(value, target))

      v = getValueAtPath(part.method, target)?.(...args)
    }

    if (negated) v = !v

    return a || a === 0 ? a + v : v
  }, "")
}
