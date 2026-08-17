import { useContext } from 'react'
import { DataContext } from '../contexts/DataContext'
export function useData() { const value=useContext(DataContext); if(!value) throw new Error('DataProvider fehlt'); return value }
