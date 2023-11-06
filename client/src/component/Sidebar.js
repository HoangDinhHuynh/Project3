import React,{useState, useEffect} from "react";
import { apiGetCategories } from "../apis/app";
import {NavLink} from 'react-router-dom'

const Slidebar = () =>{
    const [categories, setCategories] = useState(null)
    const fetchCategories = async () => {
        const response = await apiGetCategories()
        if (response.success) setCategories(response.AllProductCategory)
    }
    useEffect(()=>{
        fetchCategories()
    },[])
    // console.log(categories)
    return(
        <div>Slidebar</div>
    )
}

export default Slidebar