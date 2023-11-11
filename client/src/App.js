import React,{useEffect} from 'react';
import {Route,Routes} from 'react-router-dom'
import {Login,Home,Public,FAQ,DetailProduct,Blogs,Services,Products} from './pages/publics'
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

        </Route>
        <Route path={path.LOGIN} element={<Login/>}/>
      </Routes>
    </div>
  );
}

export default App;
