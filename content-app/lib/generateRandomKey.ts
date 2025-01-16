export function generateUniqueKey() {
    return Math.random().toString(36).substr(2, 9) // Generates a random key of length 9
}
