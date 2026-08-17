const MAX_BYTES = 8 * 1024 * 1024
export async function prepareImage(file: File): Promise<Blob> {
  const extension=file.name.split('.').pop()?.toLowerCase()
  if (!['image/jpeg','image/png','image/webp','image/heic','image/heif'].includes(file.type)&&!['jpg','jpeg','png','webp','heic','heif'].includes(extension||'')) throw new Error('FORMAT')
  if (file.size > MAX_BYTES) throw new Error('SIZE')
  if (file.type === 'image/heic' || file.type === 'image/heif' || extension === 'heic' || extension === 'heif') return file.type?file:file.slice(0,file.size,extension==='heif'?'image/heif':'image/heic')
  const bitmap = await createImageBitmap(file); const max = 1800; const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height)); const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext('2d'); if (!context) return file; context.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close()
  return await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('COMPRESS')), 'image/webp', .84))
}
