import React from "react";
import "./App.css";
import { shadows } from "@material-ui/system";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Box,
  Link,
  Button
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            CSS Sprite Maker
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant="h2" color="inherit">
          Drag and Drop
        </Typography>
        <Typography variant="h6" color="inherit">
          Drag multiple Images to make Sprite
        </Typography>
        <Container>
          <Box id="dropZone" boxShadow={3}>
            <Typography id="drop-box-text" variant="h6" color="inherit">
              Drag your files here
            </Typography>
          </Box>
        </Container>
        <Container id="button-container">
          <Link id="data-btn" mx="auto"><Button id="data-btn" mx="auto" color="primary" variant="contained" className="action-button">Download Data File</Button></Link>
          <Link id="img-btn" mx="auto"><Button id="data-btn" mx="auto" color="primary" variant="contained" className="action-button">Download Image File</Button></Link>
        </Container>
      </Container>

      {/* <img id="canva" src="" alt="Canva"/> */}
    </div>
  );
}

export default App;
