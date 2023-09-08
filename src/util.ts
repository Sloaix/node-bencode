const td = new TextDecoder('utf-8', { fatal: true })

/**
 * 是否是有效的UTF-8字符串
 * @param str
 * @returns
 */
export function isUtf8(bytes: Uint8Array | string) {
  if (typeof bytes === 'string') {
    bytes = new TextEncoder().encode(bytes)
  }

  try {
    td.decode(bytes)
  } catch (e) {
    const error = e as Error
    if (error.name === 'TypeError') {
      return false
    } else {
      throw e
    }
  }

  return true
}
