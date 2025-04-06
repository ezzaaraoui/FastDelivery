require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const Delivery = require("./models/Delivery");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/fastdelivery-deliveries", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/livraison/ajouter", async (req, res) => {
  try {
    const { commande_id, transporteur_id, adresse_livraison } = req.body;

    try {
      await axios.get(`http://localhost:3003/commande/${commande_id}`);
    } catch (error) {
      return res.status(400).json({ message: "Commande non trouvee" });
    }

    const delivery = new Delivery({
      commande_id,
      transporteur_id,
      adresse_livraison,
    });

    await delivery.save();
    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/livraison/:id", async (req, res) => {
  try {
    const { statut } = req.body;
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: "Livraison non trouvee" });
    }

    if (!["En attente", "En cours", "Livree"].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    delivery.statut = statut;
    await delivery.save();

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Delivery service running on port ${PORT}`);
});
