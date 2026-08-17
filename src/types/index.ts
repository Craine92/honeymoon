export type Role = 'guest' | 'owner'
export type AnimalType = 'Hai' | 'Schildkröte' | 'Rochen' | 'Delfin' | 'Muräne' | 'Oktopus' | 'Rifffisch' | 'Sonstiges'
export interface Profile { id: string; displayName: string; role: Role }
export interface Activity { id: string; tripDayId: string; title: string; description?: string; startTime?: string; location?: string; category: string; public: boolean; createdAt?: string }
export interface ReefSighting { id: string; animalType: AnimalType; species?: string; date: string; time?: string; location?: string; count: number; notes?: string; public: boolean; createdAt?: string }
export type MediaType = 'image' | 'video'
export interface Memory { id: string; date: string; title: string; description?: string; mediaType: MediaType; media?: string; mediaPath?: string; thumbnail?: string; thumbnailPath?: string; image?: string; imagePath?: string; location?: string; favorite: boolean; public: boolean; createdAt?: string }
export interface TripDay { id: string; date: string; dayNumber: number; title: string; description: string; highlight?: string; public: boolean; activities: Activity[] }
export interface Highlight { id: string; title: string; description?: string; date?: string; category: string; status: 'planned' | 'completed'; image?: string; public: boolean; createdAt?: string }
export interface PackingItem { id: string; label: string; category: string; packed: boolean }
export interface Expense { id: string; amount: number; currency: string; date: string; description: string; category: 'Essen' | 'Getränke' | 'Spa' | 'Ausflug' | 'Shopping' | 'Trinkgeld' | 'Sonstiges' }
