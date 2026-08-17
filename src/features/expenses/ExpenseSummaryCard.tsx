import { Receipt } from 'lucide-react'
import type { Expense } from '../../types'
import { createExpenseSummary, formatExpenseAmount } from './expenseSummary'

export function ExpenseSummaryCard({ expenses }: { expenses: Expense[] }) {
  const totals = createExpenseSummary(expenses)
  const countLabel = `${expenses.length} ${expenses.length === 1 ? 'Ausgabe' : 'Ausgaben'}`

  return <article className="expense-summary-card">
    <header><span><Receipt/></span><div><p className="eyebrow">BISHER AUSGEGEBEN</p><small>{expenses.length ? `${countLabel} · Stand heute` : 'Noch keine Ausgaben erfasst.'}</small></div></header>
    <div className="expense-total-values">
      {totals.length ? totals.map(total=><strong key={total.currency}>{formatExpenseAmount(total.total,total.currency)}</strong>) : <strong>{formatExpenseAmount(0,'USD')}</strong>}
    </div>
    {totals.length>0&&<div className="expense-category-summary">{totals.map(total=><section key={total.currency}>
      {totals.length>1&&<h3>{total.currency}</h3>}
      <div>{total.categories.map(category=><p key={category.category}><span>{category.category}</span><b>{formatExpenseAmount(category.total,total.currency)}</b></p>)}</div>
    </section>)}</div>}
  </article>
}
