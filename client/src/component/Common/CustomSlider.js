import React,{memo} from "react";
import Slider from 'react-slick'
import {Product} from '..'


const settings = {
    dots: false,
    infinite: true,
    // speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: false
  };

const CustomSlider = ({products,activeTab,normal}) =>{
    return(
        <>
        {products && <Slider className="custom-slider" {...settings}>
        {products?.map((el,index) => (
            <Product
                key={index}
                pid={el.id}
                productData={el}
                isNew={activeTab === 1 ? false : true }
                normal={normal}
            />
        ))}
    </Slider>}
        </>
    )
}

export default memo(CustomSlider)