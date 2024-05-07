import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import logo from "../images/logo.png";
import { ReactComponent as LogoSvg } from "../images/logo.svg";

const drawerWidth = 240;

const DrawerAppBar = (props) => {
  const { window, navItems } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Button
        href="/"
        sx={{
          my: 2,
        }}
      >
        <img src={logo} height={32} />
      </Button>
      <Divider />
      <List>
        {navItems?.map((item) => (
          <ListItem key={item[0]} disablePadding>
            <ListItemButton href={item[1]} sx={{ textAlign: "center" }}>
              <ListItemText primary={item[0]} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" color="background" sx={{ boxShadow: "none" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Button
            href="/"
            sx={{
              display: { xs: "none", sm: "block" },
              height: 30,
              padding: 0,
            }}
          >
            <LogoSvg style={{ height: "100%", width: "100%" }} />
          </Button>
          <Box sx={{ display: { xs: "none", sm: "block" }, ml: "auto" }}>
            {navItems?.map((item) => (
              <Button
                key={item[0]}
                href={item[1]}
                variant="text"
                sx={{ textTransform: "lowercase", marginLeft: 2 }}
              >
                {item[0]}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

export default DrawerAppBar;
