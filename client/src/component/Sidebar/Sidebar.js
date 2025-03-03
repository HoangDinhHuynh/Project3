import React,{ memo } from "react";
import {NavLink} from 'react-router-dom'
import {createSlug} from 'ultils/helpers' 
import { useSelector } from "react-redux/es/hooks/useSelector";

const Sidebar = () =>{
    const {categories} = useSelector(state => state.app)
    return(
        <div className="flex flex-col border gap-2">
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

export default memo(Sidebar)