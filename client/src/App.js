import React,{useEffect} from 'react';
import {Route,Routes} from 'react-router-dom'
import {
  Login,
  Home,
  Public,
  FAQ,
  DetailProduct,
  Blogs,
  Services,
  Products,
  FinalRegister,
  ResetPassword,
  DetailCart 
} from 'pages/publics'
import { 
  AdminLayout,
  ManageOrder,
  ManageUser,
  ManageProducts,
  Dashboard,
  CreateProducts,
} from 'pages/admin'
import { MemberLayout,Personal,History,MyCart,WishList, Checkout } from 'pages/member'
import path from 'ultils/path'
import {getCategories} from 'store/app/asyncAction'
import {useDispatch,useSelector} from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Cart, Modal} from 'component'
import { showCart } from 'store/app/appSlice';

function App() {
  const dispatch = useDispatch()
  const {isShowModal ,modalChildren, isShowCart} = useSelector(state => state.app)

  useEffect(()=>{
    dispatch(getCategories())
  },[dispatch])
  return (
    <div className="font-main h-screen">
      {isShowCart && <div onClick={()=>dispatch(showCart())} className='absolute inset-0 bg-overlay z-50 flex justify-end'>
        <Cart />
      </div>}
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>

        <Route path={path.CHECKOUT} element={<Checkout/>}/>
        <Route path={path.PUBLIC} element={<Public />}>

            <Route path={path.HOME} element={<Home/>}/>
            <Route path={path.BLOGS} element={<Blogs/>}/>
            <Route path={path.FAQ} element={<FAQ/>}/>
            <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TILTLE} element={<DetailProduct/>}/>
            <Route path={path.OUR_SERVICES} element={<Services/>}/>
            <Route path={path.PRODUCTS__CATEGORY} element={<Products/>}/>
            <Route path={path.RESET_PASSWORD} element={<ResetPassword/>}/>
            <Route path={path.ALL} element={<Home/>}/>
        </Route>
        <Route path={path.ADMIN} element={<AdminLayout />}>
            <Route path={path.DASHBOARD} element={<Dashboard />}/>
            <Route path={path.MANAGE_ORDER} element={<ManageOrder />}/>
            <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />}/>
            <Route path={path.MANAGE_USER} element={<ManageUser />}/>
            <Route path={path.CREATE_PRODUCTS} element={<CreateProducts />}/>
        </Route>
        <Route path={path.MEMBER} element={<MemberLayout />}>
            <Route path={path.PERSONAL} element={<Personal />}/>
            <Route path={path.MY_CART} element={<DetailCart/>}/>
            <Route path={path.WISHLIST} element={<WishList />}/>
            <Route path={path.HISTORY} element={<History />}/>
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister/>}/>
        <Route path={path.LOGIN} element={<Login/>}/>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        />
        {/* Same as */}
      <ToastContainer />
    </div>
  );
}

export default App;
