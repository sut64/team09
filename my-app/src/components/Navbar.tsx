import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import moment from "moment";
 
const useStyles = makeStyles((theme) => ({
 root: {flexGrow: 1},
 menuButton: {marginRight: theme.spacing(2)},
 title: {flexGrow: 1},
 navlink: {color: "white",textDecoration: "none"},
}));


 
function Navbar() {
 const classes = useStyles();
 const [time ,setTime] = useState(moment().format("HH:mm:ss")); 
 const UpdateTime = async () =>  {
    setTime(moment().format("HH:mm:ss"))
 }
 setInterval(UpdateTime,1000)

 return (
   <div className={classes.root}>
     <AppBar position="static">
       <Toolbar>
         <IconButton
           edge="start"
           className={classes.menuButton}
           color="inherit"
           aria-label="menu"
         >
           <MenuIcon />
         </IconButton>
         <Link className={classes.navlink} to="/">
           <Typography variant="h6" className={classes.title}>
           Software Engineering ทำงานวันที่ {moment().format("DD เดือน MM ปี YY")} ขณะนี้เวลา {time}
           </Typography>
         </Link>
       </Toolbar>
     </AppBar>
   </div>
 );
}
export default Navbar;
