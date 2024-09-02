import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Test from './pages/test'
import QuestionArea from './pages/Comments'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    
      <Router>
       <Routes>
       
        <Route path="/qna" Component={QuestionArea} />

        </Routes>
        </Router>
  )
}

export default App
