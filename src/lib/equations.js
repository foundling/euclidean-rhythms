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

  if ((n - k) <= 1)
    return A.join('')

  return ER(
    n - Math.min(k, n-k), 
    k > (n - k) ? n % k : k % n,
    distribute(n, k, A)
  )

}
