import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import AuthForm from './pages/AuthForm'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home/>} />
        <Route path='/login' element={<AuthForm/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App