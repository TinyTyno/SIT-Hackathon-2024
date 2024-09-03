import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import './index.css'

import View_Ind_Stock from './pages/Stocks/View_Ind_Stock'
import Homepage from './pages/homepage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/stock/:symbol' element={<View_Ind_Stock />} />
        <Route path='/' element={<Homepage/>} />
      </Routes>
    </Router>
  )
}

export default App
