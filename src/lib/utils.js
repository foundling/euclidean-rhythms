export function range(...args) {

  if (!args.length)
    throw TypeError('range requires at least one arg')

  if (args.some(arg => Number.isNaN(Number(arg))))
    throw TypeError('range requires numeric arguments')

  let start, stop

  if (args.length <= 1) {
    start = 0
    stop = args[0]
  } else if (args.length <= 2) {
    start = args[0]
    stop = args[1]
  } else {
    start = args[0]
    stop = args[1]
  }

  return [...Array(stop - start).keys()].map(k => start + Number(k))

}

class RequiredParam extends Error {}

export const requiredParam = (name) => {
  throw new TypeError(`${name} is a required parameter`)
}

