import React from "react";
import {Banner,Sidebar,BestSeller,DealDaily} from '../../component'


const Home = () =>{
    return(
        <>
            <div className='w-main flex'>
                <div className="flex flex-col gap-5 w-[25%] flex-auto">
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto ">
                    <Banner />
                    <BestSeller />
                </div>
                <div className="h-[1500px]"></div>
            </div>
        </>
    )
}

export default Home