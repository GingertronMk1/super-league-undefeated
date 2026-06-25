export default function useStatisticalMethods() {
  // sort array ascending
  const asc = (arr: number[]) => arr.sort((a, b) => a - b)

  const sum = (arr: number[]) => arr.reduce(
    (a, b) => a + b,
    0,
  )

  const mean = (arr: number[]) => sum(arr) / arr.length

  // sample standard deviation
  const std = (arr: number[]) => {
    const mu = mean(arr)
    const diffArr = arr.map(a => (a - mu) ** 2)
    return Math.sqrt(sum(diffArr) / (arr.length - 1))
  }

  const quantile = (arr: number[], q: number): number => {
    const sorted = asc(arr)
    const pos = (sorted.length - 1) * (q / 100)
    const base = Math.floor(pos)
    const rest = pos - base
    const sortedBase = sorted[base]
    const sortedNext = sorted[base + 1]
    if (sortedBase === undefined) {
      throw new Error('Array is empty')
    }
    if (sortedNext !== undefined) {
      return sortedBase + rest * (sortedNext - sortedBase)
    }
    else {
      return sortedBase
    }
  }
  const calculatePercentile = (arr: number[], t: number): number => {
    console.log(
      'calculating percentile of',
      t,
    )
    for (let i = 1; i < 101; i++) {
      const thisPercentile = quantile(
        arr,
        i,
      )
      const lastPercentile = quantile(
        arr,
        i - 1,
      )
      if (thisPercentile > t && lastPercentile < t) {
        return i
      }
    }
    return 100
  }

  const q25 = (arr: number[]) => quantile(
    arr,
    25,
  )

  const q50 = (arr: number[]) => quantile(
    arr,
    5,
  )

  const q75 = (arr: number[]) => quantile(
    arr,
    75,
  )

  const median = (arr: number[]) => q50(arr)
  return {
    asc,
    sum,
    mean,
    std,
    quantile,
    q25,
    q50,
    q75,
    median,
    calculatePercentile,
  }
}
