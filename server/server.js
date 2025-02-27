

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running! Use POST /calculate-distance to get distances.");
});

// API to calculate real-world distance
app.post("/calculate-distance", async (req, res) => {
  try {
    const { source, destination } = req.body;
    if (!source || !destination) {
      return res.status(400).json({ error: "Source and destination are required" });
    }

    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${source.lng},${source.lat};${destination.lng},${destination.lat}?overview=false`;

    const response = await axios.get(osrmUrl);
    const distance = response.data.routes[0].distance / 1000; // Convert to km

    res.json({ distance: `${distance.toFixed(2)} km` });

  } catch (error) {
    console.error("OSRM error:", error);
    res.status(500).json({ error: "Error calculating route" });
  }
});

// const PORT = process.env.PORT || 5001; // Change 5000 to 5001
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open in browser: \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
});

