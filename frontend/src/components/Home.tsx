import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import logo from '../image/pramacy4.jpg';
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    container: {
      marginTop: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    tableSpace: {
      marginTop: 20,
    },
  })
);

function Home() {
  const classes = useStyles();

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <h1 style={{ textAlign: "center" }}>ระบบห้องยา</h1>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              <img style={{width:"600px"}} className="img" src={logo}/>
            </Typography>
          </div>
        <h4></h4>
        <p>
        
        </p>
      </Container>
    </div>
  );
}
export default Home;
