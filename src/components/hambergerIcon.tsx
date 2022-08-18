import { motion } from "framer-motion"

export const Hamburger = ({ size = 64, color = 'black', open, ...props } : any) => {
  const draw = {
    // hidden: { pathLength: 0, opacity: 0 },

    visible: (i : number) => {
      const delay = i * 0.5;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
          opacity: { delay, duration: 0.00 }
        }
      };
    },
    tranform: (i : boolean) => {
      return {
        // opacity: i ? 0 : 1,
        rotate: i ? 360 : 0,
        // scale: i ? 0 : 1,
        // transitionEnd:  {
        //   display: !i ? 'block': "none",
        // },
      }
    }
  };
  // style={{transform :"rotate(0deg)"}}
  return (
    <>

      <motion.div
        {...props} >
        {/* <motion.div animate='tranform' custom={open} variants={draw}> */}

        {/* </motion.div> */}
        <motion.div animate='tranform' custom={open} variants={draw}>

          <motion.svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial="hidden"
          // animate={"visible"}
          // animate={!open ?"visible" : 'hidden'}
          >
            {
              open ?
                <path d="M10 10L55.2548 55.2548" stroke={color} strokeWidth="18" strokeLinecap="round" />
                : <line
                  x1="23.7176"
                  y1="9"
                  x2="55"
                  y2="9"
                  stroke={color}
                  strokeWidth="18"
                  strokeLinecap="round"
                // variants={draw}
                // custom={0.3}
                />
            }
            {
              open ?
                <path d="M10.012 55.309L55.2668 10.0541" stroke={color} strokeWidth="18" strokeLinecap="round" />

                : <motion.line
                  x1="23.7176"
                  y1="32"
                  x2="55"
                  y2="32"
                  stroke={color}
                  strokeWidth="18"
                  strokeLinecap="round"
                // variants={draw}
                // custom={0.3}
                />
            }
            {
              open ?
                <path d="M10.012 55.309L55.2668 10.0541" stroke={color} strokeWidth="18" strokeLinecap="round" />

                : <line
                  x1="23.7176"
                  y1="55"
                  x2="55"
                  y2="55"
                  stroke={color}
                  strokeWidth="18"
                  strokeLinecap="round"

                />
            }
            {/* <motion.line
              x1="23.7176"
              y1="55"
              x2="55"
              y2="55"
              stroke={color}
              strokeWidth="18"
              strokeLinecap="round"
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              // variants={draw}
              // custom={0.3}
            /> */}
            {
              !open &&
              <>
                <motion.ellipse
                  cx="5.88706"
                  cy="8.94624"
                  rx="5.88706"
                  ry="8.94624"
                  fill={color}
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                variants={draw}
                custom={0.3}
                />

                <motion.ellipse
                  cx="5.88706"
                  cy="32.3441"
                  rx="5.88706"
                  ry="8.94624"

                  fill={color}
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                // variants={draw}
                // custom={0.3}
                />
                <motion.ellipse
                  cx="5.88706"
                  cy="55.0538"
                  rx="5.88706"
                  ry="8.94624"
                  fill={color}
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                // variants={draw}
                // custom={0.3}
                />
              </>
            }
          </motion.svg>
        </motion.div>
      </motion.div>
    </>
  );
};
