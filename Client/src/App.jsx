import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import './index.css'

import View_Ind_Stock from './pages/Stocks/View_Ind_Stock'
import Homepage from './pages/homepage'
import QuestionArea from './pages/Comments/Comments'

import AI from './pages/AI/AI'
import ViewStock from './pages/stockPage/viewStock'
import BuyStock from './pages/stockPage/buyStock'
import SellStock from './pages/stockPage/sellStock'
import Stock_homepage from './pages/Stocks/Stock_homepage'
import ViewOrder from './pages/stockPage/viewOrder'


import UserContext from './contexts/UserContext'
import http from './http';
import UserCreate from './pages/user/userCRUD/userCreate'
import UserView from './pages/user/userCRUD/userView'
import UserUpdate from './pages/user/userCRUD/userUpdate'

import login from './pages/login/LoginPage'
import forgotPassword from './pages/login/forgotPassword'
import resetPassword from './pages/login/resetPassword'
import resetSuccess from './pages/login/resetSuccess'
import forgetSuccess from './pages/login/forgetSuccess'
import changePassword from './pages/login/changePassword'
import changePasswordSuccess from './pages/login/changePasswordSuccess'
import SearchStock from './pages/stockPage/searchStock'
import Questions from './pages/Questionnaire/questions'


function App() {
	const [count, setCount] = useState(0)
	const [user, setUser] = useState(null)


	useEffect(() => {
		if (localStorage.getItem("accessToken")) {
			http.get('/user/auth').then((res) => {
				setUser(res.data.user);
			});
		}
	}, []);


  return (
    <UserContext.Provider value={{ user, setUser }}>
        <Router>
            <Routes>
                <Route path="/qna" Component={QuestionArea} />
                <Route path="/AI" Component={AI} />
                {/* <Route path='/stock/:symbol' element={<View_Ind_Stock />} /> */}
                <Route path='/' element={<Homepage />} />


                <Route path='/user/userCreate' Component={UserCreate} />
                <Route path='/user/view' Component={UserView} />
                <Route path='/user/userUpdate' Component={UserUpdate} />
                <Route path='/login' Component={login} />

                {/* password reset */}
                <Route path='/forgotPassword' Component={forgotPassword} />
                <Route path='/resetPassword/:id/:token' Component={resetPassword} />
                <Route path='/changePassword/:id' Component={changePassword} />
                <Route path='/forgetSuccess' Component={forgetSuccess} />
                <Route path='/resetSuccess' Component={resetSuccess} />
                <Route path='/changePasswordSuccess' Component={changePasswordSuccess} />

                <Route path='/search/:query' element={<SearchStock />} />
                <Route path='/dashboard' element={<Stock_homepage/>} />
                <Route path='/stock/:symbol' element={<ViewStock />} />
                <Route path='/buyStock/:symbol' element={<BuyStock />} />
                <Route path='/sellStock/:symbol' element={<SellStock />} />
                <Route path='/orders' element={<ViewOrder />} />
                <Route path='/questionnaire' element={<Questions />} />
                {/* <Route path='/test' element={<View_Ind_Stock />} /> */}
            </Routes>
        </Router>
    </UserContext.Provider>
  )
}

export default App
