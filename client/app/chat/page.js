"use client";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HistoryIcon from "@mui/icons-material/History";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChatIcon from "@mui/icons-material/Chat";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import Chat from "../components/Chat";
import History from "../components/History"; // Import your History component
import { useRouter } from "next/navigation";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    background:
      "linear-gradient(180deg, rgba(218,235,253,1) 0%, rgba(255,255,255,1) 35%, rgba(255,255,255,1) 100%)",
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Slight shadow for depth
  borderRadius: "8px", // Rounded corners
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const router = useRouter();
  const theme = useTheme();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setMenuOpen(true);
  };

  const handleDrawerClose = () => {
    setMenuOpen(false);
  };

  const toggleHistoryDrawer = () => {
    setHistoryOpen(!historyOpen);
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={menuOpen}
        sx={{
          width: { xs: "calc(100% - 32px)", sm: "calc(100% - 64px)" },
          ml: { xs: "16px", sm: "32px" },
          mr: { xs: "16px", sm: "32px" },
          mt: 2,
          borderRadius: "30px",
          backgroundColor: "#E7F2FE",
          color: "#000",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(menuOpen && {
            width: `calc(100% - ${drawerWidth}px - 64px)`,
            ml: `${drawerWidth}px`,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(menuOpen && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Professora AI
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open history"
            onClick={toggleHistoryDrawer}
            edge="end"
            sx={{ ml: "auto" }}
          >
            <HistoryIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 2,
            backgroundColor: "#f0f0f0",
          },
        }}
        variant="persistent"
        anchor="left"
        open={menuOpen}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ flexGrow: 1 }}>
          {["New Chat", "Chat 1", "Chat 2", "Chat 3"].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                sx={{
                  "&:hover": {
                    backgroundColor: "#e0e0e0", // Darker on hover
                  },
                }}
              >
                <ListItemIcon>
                  {text === "New Chat" ? <AddIcon /> : <ChatIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleProfileClick}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Drawer anchor="right" open={historyOpen} onClose={toggleHistoryDrawer}>
        <Box
          sx={{ width: 350 }}
          role="presentation"
          onClick={toggleHistoryDrawer}
          onKeyDown={toggleHistoryDrawer}
        >
          <History /> {/* Render History component here */}
        </Box>
      </Drawer>
      <Main open={menuOpen}>
        <DrawerHeader />
        <Chat /> {/* Render ChatPage here */}
      </Main>
    </Box>
  );
}
