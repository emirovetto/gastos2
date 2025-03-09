"use client"

import { useState } from "react"
import Image from 'next/image'
import { PlusCircle, Copy, Send, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ExpenseChart } from "@/components/expense-chart"
import { ExpenseList } from "@/components/expense-list"
import { ExpenseSummary } from "@/components/expense-summary"
import { cn } from "@/lib/utils"

// Define expense type
type Expense = {
  id: string
  name: string
  amount: number
  description: string
}

export default function ExpenseCalculator() {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [currency, setCurrency] = useState("ARS")
  const [isAdding, setIsAdding] = useState(false)
  const [totalPersons, setTotalPersons] = useState<number>(2)
  const [participantNames, setParticipantNames] = useState<string[]>([])

  // Remove darkMode useEffect

  // Add new expense
  const addExpense = () => {
    if (!name) return

    setIsAdding(true)

    setTimeout(() => {
      const newExpense: Expense = {
        id: Date.now().toString(),
        name,
        amount: amount ? Number.parseFloat(amount) : 0,
        description,
      }

      // Add participant name to the list if not already there
      if (!participantNames.includes(name)) {
        setParticipantNames([...participantNames, name])
      }

      setExpenses([...expenses, newExpense])
      setName("")
      setAmount("")
      setDescription("")
      setIsAdding(false)
    }, 300)
  }

  // Delete expense
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  // Generate summary text for sharing
  const generateSummaryText = () => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    if (total === 0) return "No hay gastos registrados."

    const personTotals: Record<string, { amount: number; descriptions: string[] }> = {}

    // Initialize all participants with zero
    participantNames.forEach((name) => {
      personTotals[name] = { amount: 0, descriptions: [] }
    })

    expenses.forEach((expense) => {
      if (!personTotals[expense.name]) {
        personTotals[expense.name] = { amount: 0, descriptions: [] }
      }
      personTotals[expense.name].amount += expense.amount
      if (expense.description) {
        personTotals[expense.name].descriptions.push(expense.description)
      }
    })

    const equalSplit = total / totalPersons

    let summary = `¡Resumen de gastos!\n💰 Total: ${currency}${total.toFixed(2)}\n`
    summary += `👥 Total personas: ${totalPersons}\n`
    summary += `💸 Dividido en partes iguales: ${currency}${equalSplit.toFixed(2)} por persona\n\n`

    Object.entries(personTotals).forEach(([person, data]) => {
      const percentage = total > 0 ? ((data.amount / total) * 100).toFixed(0) : "0"
      const descriptions = data.descriptions.length > 0 ? ` - "${data.descriptions.join(", ")}"` : ""
      const balance = data.amount - equalSplit
      const balanceText =
        balance > 0
          ? `debe recibir ${currency}${balance.toFixed(2)}`
          : `debe pagar ${currency}${Math.abs(balance).toFixed(2)}`

      summary += `👥 ${person}: ${currency}${data.amount.toFixed(2)} (${percentage}%)${descriptions}\n   ${balanceText}\n`
    })

    summary += "\ 4kdigitalsg.com 🚀"

    return summary
  }

  // Copy summary to clipboard
  const copySummary = () => {
    const summary = generateSummaryText()
    navigator.clipboard
      .writeText(summary)
      .then(() => alert("Resumen copiado al portapapeles"))
      .catch((err) => console.error("Error al copiar: ", err))
  }

  // Share via WhatsApp
  const shareViaWhatsApp = () => {
    const summary = encodeURIComponent(generateSummaryText())
    window.open(`https://wa.me/?text=${summary}`, "_blank")
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8",
        "transition-all duration-300",
      )}
    >
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <Image 
            src="/4kdev.png"
            alt="4kdev Logo"
            width={96}
            height={96}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            Calculadora de Gastos de Comida
          </h1>
          <p className="text-gray-400">Divide gastos fácilmente entre amigos</p>
        </header>

        <Card className="mb-6 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-purple-400">Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalPersons" className="text-gray-300">
                  Número total de personas
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="totalPersons"
                    type="number"
                    value={totalPersons}
                    onChange={(e) => setTotalPersons(Number.parseInt(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white w-24"
                  />
                  <span className="text-white">personas que participarán en la división de gastos</span>
                </div>
              </div>

              {participantNames.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-gray-300">Participantes agregados</Label>
                  <div className="flex flex-wrap gap-2">
                    {participantNames.map((name) => (
                      <div key={name} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-white">
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-purple-400">Agregar Gasto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ej: Emi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-300">
                    Monto
                  </Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-700 border border-r-0 border-gray-600 rounded-l-md">
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="bg-transparent text-white outline-none"
                      >
                        <option value="ARS">ARS</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="25.50"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">
                    Descripción (opcional)
                  </Label>
                  <Input
                    id="description"
                    placeholder="Ej: Una coca bien fría!"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <Button
                  onClick={addExpense}
                  className={cn(
                    "w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
                    "transition-all duration-300 transform",
                    isAdding ? "scale-95 opacity-80" : "",
                  )}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Gasto
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary and Chart */}
          <div className="space-y-6">
            <ExpenseSummary expenses={expenses} currency={currency} totalPersons={totalPersons} />
            <ExpenseChart expenses={expenses} currency={currency} />
          </div>
        </div>

        {/* Expense List */}
        <ExpenseList expenses={expenses} currency={currency} onDelete={deleteExpense} />

        {/* Share Options */}
        {expenses.length > 0 && (
          <>
            <Card className="mt-6 bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-purple-400">Compartir Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-700/50 rounded-md mb-4 text-sm font-mono whitespace-pre-wrap text-white">
                  {generateSummaryText()}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={copySummary}
                    variant="outline"
                    className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar al portapapeles
                  </Button>
                  <Button onClick={shareViaWhatsApp} className="bg-green-600 hover:bg-green-700 text-white">
                    <Send className="mr-2 h-4 w-4" />
                    Compartir por WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reset Button */}
            <Button
              onClick={() => {
                setExpenses([]);
                setName("");
                setAmount("");
                setDescription("");
                setParticipantNames([]);
                setTotalPersons(2);
                setCurrency("ARS");
              }}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Reiniciar Todo
            </Button>
          </>
        )}

      </div>
    </div>
  )
}

