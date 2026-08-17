const MAX_BYTES = 8 * 1024 * 1024
export async function prepareImage(file: File): Promise<Blob> {
  if (!['image/jpeg','image/png','image/webp','image/heic','image/heif'].includes(file.type)) throw new Error('FORMAT')
  if (file.size > MAX_BYTES) throw new Error('SIZE')
  if (file.type === 'image/heic' || file.type === 'image/heif') return file
  const bitmap = await createImageBitmap(file); const max = 1800; const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height)); const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext('2d'); if (!context) return file; context.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close()
  return await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('COMPRESS')), 'image/webp', .84))
}
