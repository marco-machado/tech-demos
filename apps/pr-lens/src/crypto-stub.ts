/** Browser stand-in for the renderer’s comment-address hashing. Unused by `render()`. */
export function createHash(_algorithm: string) {
  return {
    update() {
      return this
    },
    digest() {
      return ''
    },
  }
}
