export default {
  getNow() {
    return Date.now()
  },
  tsToString(timestamp: number) {
    const t = new Date(timestamp)
    return `${t.getFullYear()}/${addZero(t.getMonth() + 1)}/${addZero(t.getDate())}`
  },
  stringToTs(str: string) {
    return new Date(str).getTime()
  },
}

function addZero(n: number) {
  return `${n < 10 ? '0' : ''}${n}`
}
