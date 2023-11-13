import React from 'react'
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from 'react-router-dom';
import {IoIosArrowForward} from 'react-icons/io'



const Breadcrumb = ({tiltle , category}) => {
    const routes = [
        { path: "/:category", breadcrumb: category },
        { path: "/", breadcrumb: "Home" },
        { path: "/:category/:pid/:tiltle", breadcrumb: tiltle},
    ];
    const breadcrumb = useBreadcrumbs(routes)
  return (
    <div className='text-sm flex items-center gap-1'>
        {breadcrumb?.filter(el => !el.match.route === false).map(({ match, breadcrumb },index,self) => (
        <Link className='flex gap-1 items-center ' key={match.pathname} to={match.pathname}>
          <span className='hover:text-main capitalize'>{breadcrumb}</span>
          {index !== self.length - 1 && <IoIosArrowForward/>} 
        </Link>
      ))}
    </div>
  )
}

export default Breadcrumb