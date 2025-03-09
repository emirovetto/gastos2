"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Expense = {
  id: string
  name: string
  amount: number
  description: string
}

type ExpenseSummaryProps = {
  expenses: Expense[]
  currency: string
  totalPersons: number
}

export function ExpenseSummary({ expenses, currency, totalPersons }: ExpenseSummaryProps) {
  // Calculate totals
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Group by person
  const personTotals: Record<string, number> = {}
  expenses.forEach((expense) => {
    if (!personTotals[expense.name]) {
      personTotals[expense.name] = 0
    }
    personTotals[expense.name] += expense.amount
  })

  // Calculate equal split
  const equalSplit = total > 0 ? total / totalPersons : 0

  if (expenses.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-purple-400">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-400">No hay gastos registrados aún.</CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl text-purple-400">Resumen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-700">
            <span className="text-cyan-300">Total</span>
            <span className="text-xl font-bold text-white">
              {currency}
              {total.toFixed(2)}
            </span>
          </div>

          {total > 0 && (
            <div className="flex justify-between items-center pb-2 border-b border-gray-700">
              <div>
                <span className="text-cyan-300">Dividido entre {totalPersons} personas</span>
                <span className="text-xs text-cyan-400 block">Monto por persona</span>
              </div>
              <span className="font-medium text-white">
                {currency}
                {equalSplit.toFixed(2)}
              </span>
            </div>
          )}

          <div className="space-y-3">
            {Object.entries(personTotals).map(([name, amount]) => {
              const percentage = ((amount / total) * 100).toFixed(0)
              const balance = amount - equalSplit
              const isPositive = balance >= 0

              return (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                        {name.charAt(0)}
                      </div>
                      <span className="text-white">{name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white">
                        {currency}
                        {amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-cyan-400">{percentage}% del total</div>
                    </div>
                  </div>

                  {totalPersons > 1 && (
                    <div className={`text-sm ml-10 ${isPositive ? "text-green-400" : "text-red-400"}`}>
                      {isPositive
                        ? `Debe recibir: ${currency}${balance.toFixed(2)}`
                        : `Debe pagar: ${currency}${Math.abs(balance).toFixed(2)}`}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

