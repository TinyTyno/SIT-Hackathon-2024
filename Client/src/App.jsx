import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import './index.css'

import View_Ind_Stock from './pages/Stocks/View_Ind_Stock'
import Homepage from './pages/homepage'
import ViewStock from './pages/stockPage/viewStock'
import BuyStock from './pages/stockPage/buyStock'
import SellStock from './pages/stockPage/sellStock'
import Stock_homepage from './pages/Stocks/Stock_homepage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        {/* <Route path='/stock/:symbol' element={<View_Ind_Stock />} /> */}
        <Route path='/' element={<Homepage/>} />
        <Route path='/dashboard' element={<Stock_homepage/>} />
        <Route path='/stock/:symbol' element={<ViewStock />} />
        <Route path='/buyStock/:symbol' element={<BuyStock />} />
        <Route path='/sellStock/:symbol' element={<SellStock />} />
        <Route path='/test' element={<View_Ind_Stock />} />
      </Routes>
    </Router>
  )
}

export default App
