import React, { useEffect } from "react";
import clsx from "clsx";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";

import HomeIcon from "@material-ui/icons/Home";
import BuildIcon from '@material-ui/icons/Build';
import MedicationIcon from '@mui/icons-material/Medication';
import HistoryIcon from '@mui/icons-material/History';
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import ViewListIcon from '@material-ui/icons/ViewList';
import LabelIcon from '@mui/icons-material/Label';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import AddAlertTwoToneIcon from "@material-ui/icons/AddAlertTwoTone";
import AirportShuttleIcon from "@material-ui/icons/AirportShuttle";


import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Prescription from "./components/Prescription";
import PrescriptHistory from "./components/PrescriptHistory";
import MedicineLabel from "./components/MedicineLabel";
import MedicineLabelCreate from "./components/MedicineLabelCreate";
import Medicine_disbursement from "./components/Medicine_disbursement";
import Medicine_disbursementCreate from "./components/Medicine_disbursementCreate";
import Medicine_receive from "./components/receive";
import Receive from "./components/receiveCreate";
import BillCreate from "./components/BillCreate";
import Bills from "./components/Bills";
import Dispense_MedicineCreate from "./components/Dispense_MedicineCreate";
import Dispense_Medicines from "./components/Dispense_Medicines";

import { AuthoritiesInterface } from "./models/IAuthority";
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    title: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    a: {
      textDecoration: "none",
      color: "inherit",
    },
  })
);

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState<String>("");
  const [authorities, setAuthority] = React.useState<AuthoritiesInterface>();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //Get Data
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
  };
  const getAuthority = async () => {
   let uid = localStorage.getItem("uid");
   fetch(`${apiUrl}/authority/${uid}`, requestOptions)
     .then((response) => response.json())
     .then((res) => {
       console.log("authority",res.data);
       if (res.data) {
         setAuthority(res.data);
       } else {
         console.log("else");
       }
     });
 };

  const menu = [
    { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },
    { name: "การสั่งยา", icon: <ShoppingBasketIcon />, path: "/prescription" },
    { name: "บันทึกข้อมูลฉลากยา", icon: <LabelIcon />, path: "/medicineLabels" },
    { name: "เบิกยา", icon: <AssignmentIndIcon />, path: "/disbursementCreate" },
    { name: "ใบรับยา", icon: <WarehouseIcon />, path: "/listreceived" },
    { name: "ใบชำระเงินค่ายา", icon: <AddAlertTwoToneIcon />, path: "/bill/create" },
    { name: "การจ่ายยา", icon: <AirportShuttleIcon />, path: "/dispense_medicine/create" },
  
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    getAuthority();
    if (token) {
      setToken(token);
    }
  }, []);

  if (!token) {
    return <SignIn />;
  }

  const signout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        {token && (
          <>
            <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
              })}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  className={clsx(classes.menuButton, {
                    [classes.hide]: open,
                  })}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  ระบบห้องยา
                </Typography>

                <Button color="inherit" style={{ backgroundColor: '#DAF1FE', fontSize: 'verdana', color: '#7EA6BF' }}>
                  <AccountCircleTwoToneIcon/> 
                  {authorities?.FirstName + " " +authorities?.LastName}
                </Button>

                <Button color="inherit" onClick={signout}>
                  ออกจากระบบ <LoginTwoToneIcon/>
                </Button>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              })}
              classes={{
                paper: clsx({
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
                }),
              }}
            >
              <div className={classes.toolbar}>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </div>
              <Divider />
              <List>
                {menu.map((item, index) => (
                  <Link to={item.path} key={item.name} className={classes.a}>
                    <ListItem button>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.name} />
                    </ListItem>
                  </Link>
                ))}
              </List>
            </Drawer>
          </>
        )}

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/prescript_history" component={PrescriptHistory} />
              <Route exact path="/prescription" component={Prescription} />
              <Route exact path="/medicineLabels" component={MedicineLabel} />
              <Route exact path="/medicineLabels/create" component={MedicineLabelCreate} />
              <Route exact path="/disbursements" component={Medicine_disbursement} />
              <Route exact path="/disbursementCreate" component={Medicine_disbursementCreate} />
              <Route exact path="/listreceived" component={Medicine_receive} />
              <Route exact path="/receive" component={Receive} />
              <Route exact path="/bills" component={Bills} />
              <Route exact path="/bill/create" component={BillCreate}/>
              <Route exact path="/dispense_medicines" component={Dispense_Medicines} />
              <Route exact path="/dispense_medicine/create" component={Dispense_MedicineCreate}/>
            </Switch>
          </div>
        </main>
      </Router>
    </div>
  );
}
