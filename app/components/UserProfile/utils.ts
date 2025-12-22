export const isPhoneNumber = (input: string | number | undefined) => {
    return /^[0-9()-]+$/.test(input?.toString() ?? "")
}