import { range } from './utils'
export const degreesToRadians = d => (d * Math.PI)/180

/* ER algorithm */
export function ER(n, k, A) {


  function distribute(n, k, A) {

    let numDistributions = Math.min(k, n - k)

    for (let i = 0; i < numDistributions; i++) {
      A[i] = [ A[i] + A.pop()[0] ]
    }

    return A
  }

  // n - k is remainder, or elements to be distributed
  if (n - k <= 1 || k === 0) {
    return A.join('').split('').map(Number)
  }
  return ER(
    n - Math.min(k, n-k), 
    k > (n - k) ? n % k : k % n,
    distribute(n, k, A)
  )

}


export const initSequence = (n, k) => ([
  ...range(k).map(_ => '1'),
  ...range(n - k).map(_ => '0')
].join('').split(''))

