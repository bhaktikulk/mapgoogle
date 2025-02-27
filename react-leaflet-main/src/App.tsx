
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import axios from "axios";

function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");

  const getCoordinates = async (location: string) => {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
    );
    if (response.data.length === 0) throw new Error("Invalid location");
    return {
      lat: parseFloat(response.data[0].lat),
      lng: parseFloat(response.data[0].lon),
    };
  };

  const calculateDistance = async () => {
  try {
    const sourceCoords = await getCoordinates(source);
    const destinationCoords = await getCoordinates(destination);

    const response = await axios.post("https://mapgoogle-end.vercel.app/calculate-distance", {
      source: sourceCoords,
      destination: destinationCoords,
    });

    setDistance(response.data.distance);
  } catch (error) {
    console.error("Error calculating distance:", error);
    setDistance("Error fetching distance");
  }
};


  const switchLocations = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        backgroundColor: "black",
        padding: "20px",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          textShadow: "0px 0px 10px rgba(255, 255, 255, 0.8)",
          marginBottom: "10px",
        }}
      >
        🚗 Distance Calculator
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#bbb",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        Enter your source and destination to calculate the driving distance and
        estimated time. Plan your journey with ease!
      </p>

      <div style={{ margin: "20px auto", display: "flex", justifyContent: "center", gap: "10px" }}>
        <input
          type="text"
          placeholder="Enter Source City"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #555",
            outline: "none",
            backgroundColor: "#222",
            color: "white",
          }}
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <button
          onClick={switchLocations}
          style={{
            padding: "10px 15px",
            backgroundColor: "#ff9800",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#0056b3")}
onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#007bff")}

        >
          🔄 Switch
        </button>
        <input
          type="text"
          placeholder="Enter Destination City"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #555",
            outline: "none",
            backgroundColor: "#222",
            color: "white",
          }}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <button
        onClick={calculateDistance}
        style={{
          padding: "12px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "1rem",
          cursor: "pointer",
          marginTop: "10px",
          transition: "all 0.3s",
          boxShadow: "0px 0px 15px rgba(0, 123, 255, 0.5)",
        }}
        onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#007bff")}
        
      >
        Share Journey 🚀
      </button>

      <p
        style={{
          fontSize: "1.4rem",
          color: "#27ae60",
          marginTop: "15px",
          fontWeight: "bold",
          textShadow: "0px 0px 10px rgba(39, 174, 96, 0.8)",
        }}
      >
        {distance}
      </p>

      {/* Map Container with bigger size */}
      <div style={{ marginTop: "30px", width: "100%", height: "60vh" }}>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={false}
          style={{
            height: "100%",
            width: "80%",
            margin: "0 auto",
            filter: "brightness(80%)",
            borderRadius: "10px",
            boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.2)",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              <span style={{ fontWeight: "bold", color: "black" }}>
                Source: {source} <br /> Destination: {destination}
              </span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
