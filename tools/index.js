export default {
  mutationRemoveTypename (obj) {
    let newInput = {}
    for (let [key, value] of Object.entries(obj)) {
      if (typeof value === 'object') {
        newInput[key] = mutationRemoveTypename(value)
      }
      if (key !== '__typename') {
        newInput[key] = value
      }
    }
    return newInput
  }
}
