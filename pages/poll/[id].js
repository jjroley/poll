import { CheckCircleIcon } from '@heroicons/react/outline'
import React, { useState, useEffect } from 'react'
import ChartComponent from "../../components/Chart"

const data = {
  title: "What is you favorite online coding platform?",
  votes: [
    { uid: 1, pick: 'replit', date: Date.now() },
    { uid: 1, pick: 'replit', date: Date.now() },
    { uid: 1, pick: 'replit', date: Date.now() },
    { uid: 1, pick: 'replit', date: Date.now() },
    { uid: 2, pick: 'codepen', date: Date.now() },
    { uid: 2, pick: 'codesandbox', date: Date.now() },
    { uid: 2, pick: 'jsfiddle', date: Date.now() },
    { uid: 3, pick: 'Cloud9', date: Date.now() }
  ],
  options: ['Replit','Codepen','jsfiddle','CodeSandbox','StackBlitz','Cloud9','Other'],
  author: 'jjroley'
}


var a = 100
const pct = data.options.map(() => {
  var num = Math.round(Math.random() * Math.min(50, a))
  a -= num
  return num
}) 

// var d =  Object.values(data.votes.reduce((a, b) => {
//   var pick = b.pick.toLowerCase()
//   return {...a, [pick]: a[pick] + 1 }
// }, optionsObj))

export default function PollPage() {
  const [chartData, setChartData] = useState()
  const [selected, setSelected] = useState()

  useEffect(() => {
    const optionsObj = data.options.reduce((a, b) => ({ ...a, [b.toLowerCase()]: 0 }), {})
    setChartData({
        labels: data.options,
        label: data.title,
        data: pct
    })
  }, [])

  return (
    <React.Fragment>
      <div className='container mx-auto p-3 md:p-0'>
        <h1 className='text-2xl font-bold mt-10'>{data.title}</h1>
        <p className='text-lg font-extralight mb-10'>{data.author}</p>
        <div className='flex flex-col md:flex-row'>
          {
            /* 229, 192, 127 */
            chartData && 
            <React.Fragment>
              <div className='w-full md:w-2/3 max-w-[700px]'>
                <ChartComponent data={chartData} />
              </div>
              <div className='grow relative rounded-md flex flex-col'>
                <div className='font-bold text-2xl m-2'>Cast your vote</div>
                <div className='flex flex-wrap mb-2'>
                  {
                    data.options.map(option => {
                      const isSelected = selected === option
                      return (
                        <div 
                          key={option} 
                          className={`flex items-center gap-1 px-3 py-2 m-1 font-thin rounded-md border border-sky-800 ${ isSelected ? 'bg-green-500 shadow-green-300 text-white border-transparent' : 'bg-sky-800 text-white hover:bg-white hover:text-black' } transition-all shadow-lg  cursor-pointer`}
                          onClick={() => setSelected(option)}
                        >
                          {option}
                        </div>
                      )
                    })
                  }
                </div>
                <button className='m-2 mt-auto px-4 py-2 rounded-md text-white bg-green-500 shadow-lg shadow-green-300 transition-all disabled:shadow-none disabled:text-slate-500 disabled:bg-slate-200' disabled={!selected}>Submit</button>
              </div>
            </React.Fragment>
          } 
        </div>
      </div>
    </React.Fragment>

  )
}

export function getServerSideProps(ctx) {
  console.log(ctx)
  return {
    props: {}
  }
}