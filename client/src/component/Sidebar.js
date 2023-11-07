import React,{useState, useEffect} from "react";
import { apiGetCategories } from "../apis/app";
import {NavLink} from 'react-router-dom'
import {createSlug} from '../ultils/helpers' 
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";

const Slidebar = () =>{
    const {categories} = useSelector(state => state.app)
    return(
        <div className="flex flex-col border">
            {categories?.map(el => (
                <NavLink
                key={createSlug(el.tiltle)}
                to={createSlug(el.tiltle)}
                className={({isActive})=> isActive? 'bg-main text-white px-5 pt-[15px] pb[14px] text-sm hover:text-main':'px-5 pt-[15px] pb[14px] text-sm hover:text-main'}
                >
                    {el.tiltle}
                </NavLink>
            ))}
        </div>
    )
}

export default Slidebar