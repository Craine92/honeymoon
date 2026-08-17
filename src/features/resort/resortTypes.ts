export type ResortCategory = 'villa' | 'restaurants' | 'bars-pools' | 'spa' | 'snorkeling' | 'activities' | 'experiences' | 'honeymoon'
export type ResortReservation = 'required' | 'recommended' | 'not-required'

export interface ResortOpeningHour {
  label: string
  time: string
  detail?: string
}

export interface ResortAppLink {
  label: string
  to: string
}

export interface ResortGuideItem {
  id: string
  name: string
  subtitle?: string
  description: string
  openingHours?: ResortOpeningHour[]
  location?: string
  reservation?: ResortReservation
  attire?: string
  features?: string[]
  note?: string
  appLinks?: ResortAppLink[]
}

export interface ResortGuideCategory {
  id: ResortCategory
  title: string
  summary: string
  introduction?: string
  items: ResortGuideItem[]
}
