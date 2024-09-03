import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Test from './pages/test'
import QuestionArea from './pages/Comments'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AI from './pages/AI'

function App() {
  const [count, setCount] = useState(0)

  return (
    
      <Router>
       <Routes>
       
        <Route path="/qna" Component={QuestionArea} />
        <Route path="/AI" Component={AI}  />

        </Routes>
        </Router>
  )
}

export default App
