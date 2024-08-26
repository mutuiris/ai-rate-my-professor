"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
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
import DeleteIcon from "@mui/icons-material/Delete";
import Chat from "../components/Chat";
import History from "../components/History";
import SentimentDashboard from "../components/SentimentAnalysis";
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
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  borderRadius: "8px",
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
  const { userId } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatName, setCurrentChatName] = useState("New Chat");
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentProfessor, setCurrentProfessor] = useState(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (userId) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/history?userId=${userId}`
        );
        const data = await response.json();
        setChatHistory(data.chatHistory);
      }
    };

    fetchChatHistory();
  }, [userId]);

  const updateChatName = (messages) => {
    if (messages.length > 1) {
      const context = messages[1].text.split(" ").slice(0, 3).join(" ");
      const newName = `Chat: ${context}...`;
      setCurrentChatName(newName);
      setChatHistory((prevHistory) =>
        prevHistory.map((chat) =>
          chat.id === currentChatId ? { ...chat, name: newName } : chat
        )
      );
    }
  };

  const handleNewChat = () => {
    const newChatId = Date.now();
    setCurrentChatName("New Chat");
    setCurrentChatId(newChatId);
    setChatHistory((prevHistory) => [
      { id: newChatId, name: "New Chat", messages: [] },
      ...prevHistory,
    ]);
  };

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

  const handleChatSelect = (chatId) => {
    const selectedChat = chatHistory.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatName(selectedChat.name);
      setCurrentChatId(chatId);
      setCurrentProfessor(selectedChat.professorName);
    }
  };

  const handleDeleteChat = (chatId) => {
    setChatHistory((prevHistory) =>
      prevHistory.filter((chat) => chat.id !== chatId)
    );
    if (currentChatId === chatId) {
      handleNewChat();
    }
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
          <ListItem disablePadding>
            <ListItemButton onClick={handleNewChat}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="New Chat" />
            </ListItemButton>
          </ListItem>
          {chatHistory.map((chat, index) => (
            <ListItem key={chat.id} disablePadding>
              <ListItemButton onClick={() => handleChatSelect(chat.id)}>
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText primary={chat.name || `Chat ${index + 1}`} />
              </ListItemButton>
              <IconButton onClick={() => handleDeleteChat(chat.id)}>
                <DeleteIcon />
              </IconButton>
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
          <History chatHistory={chatHistory} />
          <SentimentDashboard professorName={currentProfessor} />
        </Box>
      </Drawer>
      <Main open={menuOpen}>
        <DrawerHeader />
        <Chat updateChatName={updateChatName} currentChatId={currentChatId} />
      </Main>
    </Box>
  );
}
