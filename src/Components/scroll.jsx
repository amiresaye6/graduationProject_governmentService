import { KeyboardArrowUp } from "@mui/icons-material";
import { Fab, useScrollTrigger, Zoom } from "@mui/material";
import React, { useCallback } from "react";

const Scroll = () =>{

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, [])

    const trigger = useScrollTrigger({
        // Number of pixels needed to scroll to toggle `trigger` to `true`.
        threshold: 100,
    })
    
      
    return(
        <div>
        <Zoom in={trigger}>
            <Fab
                onClick={scrollToTop}
                color="primary"
                size="small"
                aria-label="Scroll back to top"
                sx={{position:"fixed" , bottom:"33px" , right:"33px"}}
            >
            <KeyboardArrowUp fontSize="medium" />
            </Fab>
        </Zoom>
        </div>
    )
}
export default Scroll;