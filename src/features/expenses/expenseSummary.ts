import type { Expense } from '../../types'

export interface ExpenseCategoryTotal {
  category: Expense['category']
  total: number
}

export interface ExpenseCurrencyTotal {
  currency: string
  total: number
  categories: ExpenseCategoryTotal[]
}

export function createExpenseSummary(expenses: Expense[]): ExpenseCurrencyTotal[] {
  const currencies = new Map<string, { totalCents: number; categories: Map<Expense['category'], number> }>()

  for (const expense of expenses) {
    const current = currencies.get(expense.currency) ?? { totalCents: 0, categories: new Map() }
    const amountCents = Math.round(expense.amount * 100)
    current.totalCents += amountCents
    current.categories.set(expense.category, (current.categories.get(expense.category) ?? 0) + amountCents)
    currencies.set(expense.currency, current)
  }

  return [...currencies.entries()].map(([currency, values]) => ({
    currency,
    total: values.totalCents / 100,
    categories: [...values.categories.entries()].map(([category, cents]) => ({ category, total: cents / 100 })),
  }))
}

export function formatExpenseAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(amount)
}
