import React,{useEffect, useState,memo} from "react";
import {apiGetProducts} from "../../apis/product";
import {CustomSlider} from '..'
import {getNewProducts} from '../../store/products/asyncActions'
import {useDispatch, useSelector} from 'react-redux'


const tabs = [
    { id:1 , name:'best sellers'},
    { id:2 , name:'new arrivals'},
    // { id:3 , name:'tablets'},
]



const BestSeller = () =>{

    const [bestSellers,setBestSeller] = useState(null)
    const [activeTab , setActiveTab] = useState(1)
    const [products, setProducts] = useState(null)
    const dispacth = useDispatch()
    const {newProducts} = useSelector(state => state.products)
    


    const fecthProducts= async() =>{
        const response = await apiGetProducts({sort: '-sold'})
        if (response?.success) {
            setBestSeller(response.products)
            setProducts(response.products)
        }
        
    }

    useEffect(()=>{
        fecthProducts()
        dispacth(getNewProducts())
    },[])
    useEffect(()=>{
        if(activeTab === 1) setProducts(bestSellers)
        if(activeTab === 2) setProducts(newProducts)
    },[activeTab])
    return(
       <div>
            <div className="flex text[20px]   ml-[-32px]">
                {tabs.map(el =>(
                     <span 
                        key={el.id} 
                        className={`font-semibold uppercase px-8 cursor-pointer border-r text-gray-400 ${activeTab === el.id?'text-gray-900':''}`}
                        onClick={()=> setActiveTab(el.id)}
                     >{el.name}</span>
                ))}
            </div>
            <div className="mt-4 mx-[-10px] border-t-2 border-main pt-4">
                <CustomSlider products={products} activeTab={activeTab} />
            </div>
            <div className="w-full flex gap-4 mt-4">
                <img 
                src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657" 
                alt="" 
                className="flex-1 object-contain"
                />
                <img 
                src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657" 
                alt="" 
                className="flex-1 object-contain"
                />
            </div>
        </div>
    )
}

export default memo(BestSeller)