const sizes = ['B', 'KB', 'MB']

const k = 1024

export const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
