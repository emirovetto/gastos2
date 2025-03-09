"use client"

import { useState } from "react"
import { Trash2, Coffee, Film, Music, ShoppingCart, Utensils, Wine } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Expense = {
  id: string
  name: string
  amount: number
  description: string
}

type ExpenseListProps = {
  expenses: Expense[]
  currency: string
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, currency, onDelete }: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Get icon based on description
  const getIcon = (description: string) => {
    const desc = description.toLowerCase()

    if (desc.includes("comida") || desc.includes("cena") || desc.includes("almuerzo")) {
      return <Utensils className="h-5 w-5 text-green-400" />
    } else if (desc.includes("bebida") || desc.includes("café") || desc.includes("cafe")) {
      return <Coffee className="h-5 w-5 text-brown-400" />
    } else if (desc.includes("vino") || desc.includes("cerveza") || desc.includes("alcohol")) {
      return <Wine className="h-5 w-5 text-red-400" />
    } else if (
      desc.includes("cine") ||
      desc.includes("película") ||
      desc.includes("pelicula") ||
      desc.includes("entrada")
    ) {
      return <Film className="h-5 w-5 text-blue-400" />
    } else if (desc.includes("música") || desc.includes("musica") || desc.includes("concierto")) {
      return <Music className="h-5 w-5 text-purple-400" />
    } else {
      return <ShoppingCart className="h-5 w-5 text-gray-400" />
    }
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setTimeout(() => {
      onDelete(id)
      setDeletingId(null)
    }, 300)
  }

  if (expenses.length === 0) {
    return null
  }

  return (
    <Card className="mt-6 bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl text-purple-400">Lista de Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className={cn(
                "flex items-center justify-between p-3 bg-gray-700/50 rounded-md",
                "transition-all duration-300",
                deletingId === expense.id ? "opacity-0 scale-95" : "opacity-100",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-full">{getIcon(expense.description)}</div>
                <div>
                  <div className="font-medium">{expense.name}</div>
                  {expense.description && <div className="text-sm text-gray-400">{expense.description}</div>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-medium text-right">
                  {currency}
                  {expense.amount.toFixed(2)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(expense.id)}
                  className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

