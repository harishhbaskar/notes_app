import SignUp from './pages/SignUp.js'
import SignIn from './pages/SignIn'
import Home from './pages/Home.js'
import {Routes , Route} from 'react-router-dom'
import DashBoard from './pages/DashBoard.js'

function App() {
  

  return (
    <>
      <div className="bg-[#111827] min-h-screen flex flex-col">
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="signin" element={<SignIn/>}/>
            <Route path="signup" element={<SignUp/>}/>
            <Route path="dashboard" element={<DashBoard/>}/>
        </Routes>

      </div>
    </>
  )
}

export default App
