export default function(length = 4) {
    return crypto.getRandomValues(new Uint32Array(length)).join('-')
}
