import { AnimatePresence, motion } from "framer-motion"
import {
  Link,
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ReactNode, useContext, useRef, useState } from "react"

import DashboardIcon from '@mui/icons-material/Dashboard';
import { Hamburger } from "./hambergerIcon"
import { MenuItem } from "./menuItem"
import { Tooltip } from "./tooltip"

// import { TbReportAnalytics } from 'react-icons/'

const Header = ({ open, headSize }: any) => {
  const domRef = useRef<any>()
  const navigate = useNavigate();
const logout = () =>{

  localStorage.clear();
  navigate("/");
}
  return (
    <motion.div
      // style={{width: `calc(100vw - ${headSize})`}}
      initial={{
        width: `calc(100vw - ${"64px"})`,
      }}
      animate={{
        
        width: `calc(100vw - ${headSize})`,
        maxWidth: `calc(100vw - ${headSize})`,
      }}
    >
      <motion.div
        className={`flex bg-red-400 items-center  h-16   justify-between `}
      >
        <p className="ml-4 text-lg">EGAT</p>
        <div
          className="flex items-center mr-4 cursor-pointer"
          onClick={() => logout()}
        >
          {/* <AiOutlineLogout size={32} className="mr-1 " />  */}
          Logout
        </div>
      </motion.div>
    </motion.div>
  )
}

const Sidebar = ({ children }: any) => {
  const [open, setOpen] = useState(false)
  const openWidth = open ? "192px" : "64px"
  return (
    <div className="flex max-h-screen ">
      <motion.div
        className={` h-screen bg-orange-600
      } flex flex-col `}
        initial={{ width: '64px', }}

        animate={{
          maxWidth: openWidth,
          width : openWidth
        }}
      >
        {/* <AnimatePresence> */}

        <Hamburger
          onClick={() => setOpen(!open)}
          className={`mt-6 mb-6  ml-auto mr-2  cursor-pointer ${open && ""} `}
          open={open}
          color="black"
          size={24}
        />
        {/* </AnimatePresence> */}
        <MenuItem path='/' open={open} label={"Booking"}>
          <DashboardIcon className=' w-6' />
        </MenuItem>
        {/* <MenuItem path='/test' open={open} label={"test"}>
          <DashboardIcon className=' w-6' />
        </MenuItem> */}
      </motion.div>
      <div>
        <div className={`flex flex-col  w`}>
          <Header open={open} headSize={openWidth} />
          <div
            style={{
              overflow : 'auto',
              // here
              maxWidth: `calc(100vw - ${openWidth}) `,
              maxHeight: `calc(100vh - 64px)`,
            //   width: `calc(100vw - ${openWidth}) `,
             height: `calc(100vh - 64px)`,
              // here
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
const Layout = ({ children }: any) => {
  return (
    <div>
      <Sidebar>{children}</Sidebar>
    </div>
  )
}

export default Layout
