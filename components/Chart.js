import { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'

const palette = ["#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"]
const tealPalette = ["#bce4d8","#aedcd5","#a1d5d2","#95cecf","#89c8cc","#7ec1ca","#72bac6","#66b2c2","#59acbe","#4ba5ba","#419eb6","#3b96b2","#358ead","#3586a7","#347ea1","#32779b","#316f96","#2f6790","#2d608a","#2c5985"]
const skyPalette = ['#073779', '#8fd9fb', '#ffcc00', '#eb6615', '#c76402', '#b523b4']
const classicPalette = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']

const brightPalette = ['rgb(255, 99, 132)','rgb(255, 159, 64)','rgb(255, 205, 86)','rgb(75, 192, 192)','rgb(54, 162, 235)','rgb(153, 102, 255)','rgb(201, 203, 207)']

const CHART_CONFIG = {
  type: 'doughnut',
  
  options: {
    plugins: {
      tooltip: {
        displayColors: false
      },
      legend: {
        position: 'left'
      }
    },
    aspectRatio: 1.5
  }
}

export default function ChartComponent({ data }) {
  const [chart, setChart] = useState()
  const chartRef = useRef()

  useEffect(() => {
    if(chart) return

    setChart(prev => {
      if(prev) return prev
      return new Chart(chartRef.current, { 
        ...CHART_CONFIG, 
        data: {
          labels: data.labels,
          datasets: [{
            label: data.label,
            data: data.data,
            cutout: '60%',
            backgroundColor: brightPalette
          }],
        }
      })
    })
  }, [ chart, data ])

  useEffect(() => {
    if(!chart || !data) return
    setChart(prev => {
      prev.data.datasets[0].data = data.data
      prev.update()
      return prev
    })
  }, [ chart, data ])

  return (
    <div className='max-w-[700px]'>
      <canvas ref={chartRef}></canvas>  
    </div>
  )
}

export function getChartImage(data) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 200
  var chart = new Chart(canvas, { ...CHART_CONFIG, data })
  return chart.canvas.toDataURL()
}