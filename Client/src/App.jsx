import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'

import View_Ind_Stock from './pages/Stocks/View_Ind_Stock'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/stock/:symbol' element={<View_Ind_Stock />} />
      </Routes>
    </Router>
  )
}

export default App
