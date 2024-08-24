import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SentimentDashboard from "./SentimentAnalysis";

function History() {
  const { userId } = useAuth;
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (userId) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/history?userId=${userId}`);
        const data = await response.json();
        setChatHistory(data.chatHistory);
      }
    };

    fetchChatHistory();
  }, [userId]);

  const professionalTier = {
    title: "Professional",
    price: "15",
    description: [
      "Help center access",
      "Priority email support",
      "Best deals",
    ],
    buttonText: "Start now",
    buttonVariant: "contained",
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col space-y-6">
      <div className="history-component p-4 bg-gray-100 rounded-md shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Chat History
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {chatHistory.map((chat, index) => (
            <li 
              key={chat.id} 
              className="text-gray-600 hover:text-gray-900 transition duration-300 cursor-pointer"
              onClick={() => setSelectedProfessor(chat.professorName)}
            >
              {chat.name || `Chat ${index + 1}`}
            </li>
          ))}
        </ul>
      </div>
      
      {selectedProfessor && (
        <div className="sentiment-dashboard p-4 bg-gray-100 rounded-md shadow-lg">
          <SentimentDashboard professorName={selectedProfessor} />
        </div>
      )}

      <div className="pricing-component bg-white bg-opacity-50 backdrop-blur-md rounded-full shadow-lg border border-gray-300">
        <Card
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#032D58",
            border: "none",
            boxShadow: "none",
            borderRadius: "25px",
          }}
        >
          <CardContent>
            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color:
                  professionalTier.title === "Professional" ? "grey.100" : "",
              }}
            >
              <Typography component="h3" variant="h6">
                {professionalTier.title}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                color:
                  professionalTier.title === "Professional"
                    ? "grey.50"
                    : undefined,
              }}
            >
              <Typography component="h3" variant="h2">
                ${professionalTier.price}
              </Typography>
              <Typography component="h3" variant="h6">
                &nbsp; per month
              </Typography>
            </Box>
            <Divider
              sx={{
                my: 2,
                opacity: 0.2,
                borderColor: "grey.500",
              }}
            />
            {professionalTier.description.map((line) => (
              <Box
                key={line}
                sx={{
                  py: 1,
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                <CheckCircleRoundedIcon
                  sx={{
                    width: 20,
                    color:
                      professionalTier.title === "Professional"
                        ? "primary.light"
                        : "primary.main",
                  }}
                />
                <Typography
                  component="text"
                  variant="subtitle2"
                  sx={{
                    color:
                      professionalTier.title === "Professional"
                        ? "grey.200"
                        : undefined,
                  }}
                >
                  {line}
                </Typography>
              </Box>
            ))}
          </CardContent>
          <CardActions>
            <Button
              fullWidth
              variant={professionalTier.buttonVariant}
              component="a"
              href="#"
              sx={{ borderRadius: "30px" }}
            >
              {professionalTier.buttonText}
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}

export default History;
