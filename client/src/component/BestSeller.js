import React,{useEffect, useState} from "react";
import {apiGetProducts} from "../apis/product";
import {Product} from './'
import Slider from 'react-slick'



const tabs = [
    { id:1 , name:'best sellers'},
    { id:2 , name:'new arrivals'},
    // { id:3 , name:'tablets'},
]

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

const BestSeller = () =>{
    const [bestSellers,setBestSeller] = useState(null)
    const [newProducts,setNewProducts] = useState(null)
    const [activeTab , setActiveTab] = useState(1)
    const [products, setProducts] = useState(null)

    const fecthProducts= async() =>{
        const response = await Promise.all([apiGetProducts({sort: '-sold'}),apiGetProducts({sort: '-createdAt'})])
        if (response[0]?.success) {
            setBestSeller(response[0].products)
            setProducts(response[0].products)
        }
        if (response[1]?.success) setNewProducts(response[1].products)
        setProducts(response[0].products)
    }

    useEffect(()=>{
        fecthProducts()
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
                <Slider {...settings}>
                    {products?.map(el => (
                        <Product
                            key={el.id}
                            pid={el.id}
                            productData={el}
                            isNew={activeTab === 1 ? false : true }
                        />
                    ))}
                </Slider>
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

export default BestSeller