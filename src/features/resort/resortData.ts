import type { ResortGuideCategory } from './resortTypes'

export const resortGuide: ResortGuideCategory[] = [
  {
    id: 'villa',
    title: 'Unsere Villa',
    summary: '124 m² · Overwater · privater Pool',
    items: [{
      id: 'ocean-villa-with-pool',
      name: 'Ocean Villa with Pool',
      subtitle: 'Unsere Villa über dem Indischen Ozean',
      description: 'Unsere Villa liegt direkt über der Lagune und besitzt einen privaten Infinity-Plunge-Pool, ein großzügiges Sonnendeck und direkten Zugang zum Meer.',
      features: ['124 m²', 'Overwater Villa', 'privater Infinity-Plunge-Pool', 'Sonnendeck', 'direkter Zugang zum Meer', 'bis zu 3 Erwachsene oder 2 Erwachsene + 2 Kinder'],
    }],
  },
  {
    id: 'restaurants',
    title: 'Restaurants',
    summary: '5 Restaurants & Dining-Erlebnisse',
    items: [
      {
        id: 'aqua-orange', name: 'Aqua Orange', subtitle: 'Internationales Buffet',
        description: 'Buffetrestaurant direkt am Strand mit Live-Cooking und Themenabenden.',
        openingHours: [{ label: 'Frühstück', time: '07:00–10:00' }, { label: 'Mittagessen', time: '12:30–14:30' }, { label: 'Abendessen', time: '18:30–21:30' }],
        attire: 'Casual', features: ['Buffet', 'Live Cooking', 'Themenabende', 'direkt am Strand'],
      },
      {
        id: 'grouper-grill', name: 'Grouper Grill', subtitle: 'Surf & Turf',
        description: 'Restaurant direkt am Strand mit frischem Fisch, Seafood, Steaks und Grillgerichten aus der offenen Küche.',
        openingHours: [{ label: 'Mittagessen', time: '12:30–15:00', detail: 'täglich' }, { label: 'À-la-carte-Abendessen', time: '18:30–22:00', detail: 'Montag, Dienstag, Donnerstag, Freitag und Samstag' }, { label: 'Lobster BBQ', time: 'Mittwoch und Sonntag' }],
        reservation: 'recommended', features: ['Seafood', 'Steaks', 'Strand', 'offene Küche', 'Lobster BBQ'],
      },
      {
        id: 'roma', name: 'Roma', subtitle: 'Mediterran / Italienisch',
        description: 'Mediterranes und italienisch geprägtes Restaurant über dem Wasser mit Blick auf die Lagune.',
        openingHours: [{ label: 'Abendessen', time: '18:30–22:00' }], reservation: 'recommended', attire: 'Casual',
        features: ['Italienisch', 'Mediterran', 'Overwater', 'vegetarische Optionen'],
      },
      {
        id: 'teppanyaki', name: 'Teppanyaki', subtitle: 'Japanisch',
        description: 'Japanisches Teppanyaki- und Sushi-Erlebnis mit Zubereitung direkt vor den Gästen.',
        openingHours: [{ label: 'Mittag', time: '12:30–15:00' }, { label: 'Dinner · erste Sitzung', time: '18:30–20:00' }, { label: 'Dinner · zweite Sitzung', time: '20:30–22:00' }],
        reservation: 'recommended', features: ['Teppanyaki', 'Sushi', 'À la carte', 'Set-Menüs', 'Show Cooking'],
      },
      {
        id: 'wine-cellar', name: 'Wine Cellar', subtitle: 'Weinkeller & Private Dining',
        description: 'Weinkeller im Bereich von Roma für Weinverkostungen, Wine Pairing und besondere private Dinner.',
        openingHours: [{ label: 'Wine Pairing Dinner', time: '18:30–22:00' }, { label: 'Wine Academy', time: '18:00–19:00' }],
        reservation: 'required', attire: 'Smart Casual', features: ['Wine Pairing', 'Weinverkostung', 'Private Dining', 'besondere Anlässe'],
      },
    ],
  },
  {
    id: 'bars-pools',
    title: 'Bars & Pools',
    summary: '2 Bars · 2 Poolbereiche',
    items: [
      {
        id: 'chemistry', name: 'Chemistry', subtitle: 'Café & Bar',
        description: 'Zentrale Bar für Kaffee, Cocktails, Mocktails, Wein und Drinks über den gesamten Tag.',
        openingHours: [{ label: 'Café & Bar', time: '24 Stunden / 7 Tage' }, { label: 'Pool', time: '09:00–18:00' }, { label: 'All-Inclusive Snacks', time: '12:00–15:30' }, { label: 'High Tea', time: '15:30–17:30' }],
        attire: 'Casual / Beachwear', features: ['Kaffee', 'Cocktails', 'Mocktails', 'Wein', 'Snacks', 'High Tea', 'Pool'],
      },
      {
        id: 'fresh-water', name: 'Fresh Water', subtitle: 'Adults-only Pool Bar',
        description: 'Bar direkt am Adults-only-Pool am Strand mit Cocktails, alkoholfreien Drinks und leichtem Lunch.',
        openingHours: [{ label: 'Bar', time: '10:00–00:00' }, { label: 'Pool', time: '10:00–19:00' }],
        reservation: 'not-required', attire: 'Casual / Beachwear', features: ['Adults only', 'Pool', 'Cocktails', 'Mocktails', 'Light Lunch', 'Strand'],
      },
      {
        id: 'chemistry-pool', name: 'Pool bei Chemistry', subtitle: 'Allgemeiner Poolbereich',
        description: 'Der Poolbereich bei Chemistry ist tagsüber geöffnet.',
        openingHours: [{ label: 'Pool', time: '09:00–18:00' }],
      },
      {
        id: 'fresh-water-pool', name: 'Adults-only Pool bei Fresh Water', subtitle: 'Adults-only',
        description: 'Der Poolbereich bei Fresh Water ist ausschließlich Erwachsenen vorbehalten.',
        openingHours: [{ label: 'Pool', time: '10:00–19:00' }], features: ['Adults only', 'Strand'],
      },
    ],
  },
  {
    id: 'spa',
    title: 'Ocean Spa',
    summary: 'Overwater Wellness',
    items: [{
      id: 'ocean-spa', name: 'Ocean Spa at Iru Veli', subtitle: 'Overwater Spa & Wellness',
      description: 'Das Ocean Spa liegt über dem Wasser und kombiniert moderne Wellness mit traditionellen asiatischen Anwendungen.',
      openingHours: [{ label: 'Täglich', time: '09:00–19:00' }],
      location: 'Am Steg in Richtung der Ocean Villas, gegenüber beziehungsweise im Bereich von Roma.', reservation: 'recommended',
      features: ['Thai Massage', 'Balinesische Massage', 'Hawaiianische Lomilomi Massage', 'Paarmassagen', 'Kopf- und Kopfhautbehandlungen', 'Gesichtsbehandlungen', 'Body Scrubs', 'Body Wraps', 'Body Masks', 'Thalgo-Anwendungen', 'Yoga', 'Mat Pilates', 'Pranayama', 'Meditation'],
      note: 'Reservierung im Voraus empfohlen.',
    }],
  },
  {
    id: 'snorkeling',
    title: 'Schnorcheln & Tauchen',
    summary: 'Hausriff & Indischer Ozean',
    introduction: 'Die Unterwasserwelt gehört zu den schönsten Seiten unserer Insel – Sichtungen bleiben dabei immer ein Naturerlebnis.',
    items: [
      { id: 'house-reef', name: 'Hausriff & Unterwasserwelt', description: 'Rund um Iru Veli warten Korallen, tropische Rifffische und die typische Unterwasserwelt des Dhaalu Atolls.', note: 'Bestimmte Tierarten können nicht garantiert werden.', features: ['Korallen', 'tropische Rifffische', 'Dhaalu Atoll'] },
      { id: 'diving', name: 'Diving', subtitle: 'Für unterschiedliche Erfahrungsstufen', description: 'Das Resort bietet organisierte Tauchmöglichkeiten für unterschiedliche Erfahrungsstufen.', note: 'Details, Voraussetzungen und Verfügbarkeit bitte vor Ort prüfen.' },
      { id: 'reef-diary', name: 'Unser Riff-Tagebuch', subtitle: 'Unsere persönlichen Sichtungen', description: 'Hier sammeln wir während der Reise unsere eigenen Begegnungen am Riff.', appLinks: [{ label: 'Riff-Tagebuch öffnen', to: '/reef' }] },
    ],
  },
  {
    id: 'activities',
    title: 'Aktivitäten & Ausflüge',
    summary: 'Wasser, Inseln & Ausflüge',
    items: [
      {
        id: 'watersports', name: 'Watersports', subtitle: 'Aktiv auf dem Indischen Ozean',
        description: 'Das Resort bietet verschiedene Wassersportmöglichkeiten rund um die Insel.',
        features: ['Kajak', 'Paddleboarding', 'Windsurfen und Windsportangebote', 'Kitesurfing', 'Jetski', 'weitere Wassersportangebote'],
        note: 'Je nach Verfügbarkeit und Wetterbedingungen. Details bitte vor Ort prüfen.',
      },
      {
        id: 'excursions', name: 'Excursions', subtitle: 'Das Dhaalu Atoll entdecken',
        description: 'Vom Sonnenuntergang auf dem Boot bis zum Besuch einer lokalen Insel werden unterschiedliche Ausflüge angeboten.',
        features: ['Sunset Cruise', 'Sandbank-Ausflüge', 'lokale Inseln', 'Schnorchelausflüge', 'weitere Bootsausflüge'],
        note: 'Verfügbarkeit und Zeiten können vor Ort variieren.',
      },
    ],
  },
  {
    id: 'experiences',
    title: 'Besondere Erlebnisse',
    summary: 'Inselmomente entdecken',
    items: [
      { id: 'floating-breakfast', name: 'Floating Breakfast', description: 'Frühstück oder Lunch wird auf einem schwimmenden Tablett im privaten Pool der Villa serviert.', note: 'Kostenpflichtiges Extra beziehungsweise je nach gebuchtem Paket. Details bitte vor Ort prüfen.' },
      { id: 'pool-parties', name: 'Weekly Pool Parties', description: 'Wöchentliche Poolparty mit Musik oder DJ und entspannter Inselatmosphäre.' },
      { id: 'private-sunset-isle', name: 'Private Sunset Isle', description: 'Privates Sandbank-Erlebnis für zwei zum Sonnenuntergang.' },
      { id: 'cast-away', name: 'Cast Away', description: 'Halbtägiges privates Sandbank-Erlebnis mit Strand, Meer und optionalem Schnorcheln.' },
      { id: 'local-island', name: 'Local Island Experience', description: 'Geführtes Erlebnis auf einer lokalen Insel mit Einblicken in maledivischen Alltag und Kultur.' },
      { id: 'bodu-beru', name: 'Bodu Beru Night', description: 'Traditionelle maledivische Trommelmusik und Tanz.' },
      { id: 'sunk-in-sand', name: 'Sunk In Sand Dining', description: 'Besonderes Dining-Erlebnis direkt im Sand am Strand mit Blick auf den Indischen Ozean.' },
      { id: 'hotpot', name: 'Hotpot Lunch & Dinner', description: 'Gemeinsames Hotpot-Erlebnis mit verschiedenen Brühen, Seafood, Fleisch und Gemüse.' },
      { id: 'cinema', name: 'Cinema by Moonlight', description: 'Kinoabend unter freiem Himmel.' },
      { id: 'sundowners', name: 'Secret Sundowners', description: 'Besonderes Sunset-Erlebnis.', note: 'Details und Verfügbarkeit bitte vor Ort prüfen.' },
    ],
  },
  {
    id: 'honeymoon',
    title: 'Flitterwochen',
    summary: 'Unsere Zeit im Paradies',
    items: [{
      id: 'our-honeymoon', name: 'Unsere Flitterwochen', subtitle: 'Zeit für uns',
      description: 'Iru Veli verbindet unsere private Poolvilla mit romantischen Inselmomenten, Wellness und besonderen Erlebnissen für zwei.',
      features: ['Honeymoon-orientiertes Resort', 'private Poolvilla', 'Floating Breakfast', 'private Dinner-Erlebnisse', 'Spa für Paare', 'Sunset-Erlebnisse', 'Sandbank-Erlebnisse'],
      appLinks: [{ label: 'Unsere Erinnerungen', to: '/memories' }, { label: 'Highlights', to: '/more' }, { label: 'Unsere Reise', to: '/trip' }],
    }],
  },
]
