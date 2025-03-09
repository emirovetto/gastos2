"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Expense = {
  id: string
  name: string
  amount: number
  description: string
}

type ExpenseChartProps = {
  expenses: Expense[]
  currency: string
}

export function ExpenseChart({ expenses, currency }: ExpenseChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || expenses.length === 0) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Group expenses by person
    const personTotals: Record<string, number> = {}
    expenses.forEach((expense) => {
      if (!personTotals[expense.name]) {
        personTotals[expense.name] = 0
      }
      personTotals[expense.name] += expense.amount
    })

    const total = Object.values(personTotals).reduce((sum, amount) => sum + amount, 0)

    // Define colors for the chart
    const colors = [
      "#9333ea", // purple-600
      "#ec4899", // pink-500
      "#3b82f6", // blue-500
      "#10b981", // emerald-500
      "#f97316", // orange-500
      "#8b5cf6", // violet-500
      "#06b6d4", // cyan-500
    ]

    // Draw pie chart
    let startAngle = 0
    let colorIndex = 0

    const centerX = canvasRef.current.width / 2
    const centerY = canvasRef.current.height / 2
    const radius = Math.min(centerX, centerY) - 10

    Object.entries(personTotals).forEach(([name, amount]) => {
      const sliceAngle = (amount / total) * 2 * Math.PI

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = colors[colorIndex % colors.length]
      ctx.fill()

      // Draw label
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      ctx.fillStyle = "#ffffff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const percentage = Math.round((amount / total) * 100)
      if (percentage > 5) {
        // Only show label if slice is big enough
        ctx.fillText(`${name} (${percentage}%)`, labelX, labelY)
      }

      startAngle += sliceAngle
      colorIndex++
    })

    // Draw center circle (donut hole)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI)
    ctx.fillStyle = "#1f2937" // gray-800
    ctx.fill()

    // Draw total in center
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`Total: ${currency}${total.toFixed(2)}`, centerX, centerY)
  }, [expenses, currency])

  if (expenses.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-purple-400">Distribución de Gastos</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[200px] text-gray-400">
          Agrega gastos para ver el gráfico
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl text-purple-400">Distribución de Gastos</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <canvas ref={canvasRef} width={300} height={200} className="max-w-full" />
      </CardContent>
    </Card>
  )
}

