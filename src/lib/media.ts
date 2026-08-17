export const MAX_IMAGE_BYTES = 8 * 1024 * 1024
export const MAX_VIDEO_BYTES = 150 * 1024 * 1024

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'] as const
export const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'] as const
export const MEDIA_ACCEPT = [...IMAGE_TYPES, ...VIDEO_TYPES].join(',')

export type SelectedMediaType = 'image' | 'video'

export function getMediaType(file: File): SelectedMediaType {
  if ((IMAGE_TYPES as readonly string[]).includes(file.type)) return 'image'
  if ((VIDEO_TYPES as readonly string[]).includes(file.type)) return 'video'
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension && ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].includes(extension)) return 'image'
  if (extension && ['mp4', 'mov', 'webm'].includes(extension)) return 'video'
  throw new Error('Bitte wähle ein Foto (JPEG, PNG, WebP, HEIC) oder Video (MP4, MOV, WebM).')
}

export function validateMediaSize(file: File, type = getMediaType(file)) {
  if (type === 'video' && file.size > MAX_VIDEO_BYTES) throw new Error('Das Video ist zu groß. Bitte wähle ein kürzeres oder kleineres Video.')
  if (type === 'image' && file.size > MAX_IMAGE_BYTES) throw new Error('Das Foto ist zu groß. Bitte wähle ein Bild mit höchstens 8 MB.')
}

export function safeMediaExtension(file: File, type: SelectedMediaType) {
  const byMime: Record<string, string> = {
    'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/heic': 'heic', 'image/heif': 'heif',
    'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm',
  }
  return byMime[file.type] || (type === 'video' ? 'mp4' : 'jpg')
}

export async function createVideoPoster(file: File): Promise<Blob | undefined> {
  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.muted = true
  video.playsInline = true
  video.preload = 'metadata'
  video.src = url
  try {
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error('THUMBNAIL_TIMEOUT')), 8000)
      video.onloadedmetadata = () => {
        video.currentTime = Math.min(Math.max(video.duration * 0.08, 0.1), 1.5)
      }
      video.onseeked = () => { window.clearTimeout(timer); resolve() }
      video.onerror = () => { window.clearTimeout(timer); reject(new Error('THUMBNAIL_UNAVAILABLE')) }
    })
    const maxWidth = 720
    const scale = Math.min(1, maxWidth / video.videoWidth)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale))
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale))
    const context = canvas.getContext('2d')
    if (!context) return undefined
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    return await new Promise(resolve => canvas.toBlob(blob => resolve(blob || undefined), 'image/webp', .78))
  } catch {
    return undefined
  } finally {
    video.removeAttribute('src')
    video.load()
    URL.revokeObjectURL(url)
  }
}

export function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toLocaleString('de-DE', { maximumFractionDigits: 1 })} MB`
}
