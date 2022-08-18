import {Link} from "react-router-dom"
import { Tooltip } from "./tooltip"
import { motion } from "framer-motion"

export const MenuItem = ({ open, label, children ,path}: any) => {
  return (
    <>
  
      {open ? (
        <Link to={path}>
          <div className="flex py-4 pl-5 mr-auto items-center  min-w-[calc(100%-1.25rem)]   cursor-pointer hover:bg-gray-400">
            {children}
            {open && <label>&nbsp;{label}</label>}
          </div>
        </Link>
      ) : (
        <Tooltip message={label} className=''>
          <Link to={path}>
            <div className="flex py-4    ">
              {/* <TbReportAnalytics className=" " size="24" /> */}
              
              {children}
          {/* {label} */}
            </div>
          </Link>
        </Tooltip>
      )}
    </>
  )
}
