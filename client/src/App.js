import React,{useEffect} from 'react';
import {Route,Routes} from 'react-router-dom'
import {Login,Home,Public,FAQ,DetailProduct,Blogs,Services,Products,FinalRegister,ResetPassword } from './pages/publics'
import path from './ultils/path'
import {getCategories} from './store/app/asyncAction'
import {useDispatch} from 'react-redux'

function App() {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(getCategories())
  },[dispatch])
  return (
    <div className="min-h-screen font-main">
      <Routes>

        <Route path={path.PUBLIC} element={<Public />}>

            <Route path={path.HOME} element={<Home/>}/>
            <Route path={path.BLOGS} element={<Blogs/>}/>
            <Route path={path.FAQ} element={<FAQ/>}/>
            <Route path={path.DETAIL_PRODUCT__PID__TILTLE} element={<DetailProduct/>}/>
            <Route path={path.OUR_SERVICES} element={<Services/>}/>
            <Route path={path.PRODUCTS} element={<Products/>}/>
            <Route path={path.RESET_PASSWORD} element={<ResetPassword/>}/>

        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister/>}/>
        <Route path={path.LOGIN} element={<Login/>}/>
      </Routes>
    </div>
  );
}

export default App;
