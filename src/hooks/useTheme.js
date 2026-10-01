import { useContext } from 'react'
import { ThemeContext } from '@/context/theme.js'

export const useTheme = () => useContext(ThemeContext)
