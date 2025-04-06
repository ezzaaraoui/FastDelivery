require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const Order = require("./models/Order");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/fastdelivery-orders", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/commande/ajouter", async (req, res) => {
  try {
    const { produits, client_id } = req.body;
    let prix_total = 0;

    for (const item of produits) {
      try {
        const productResponse = await axios.get(
          `http://localhost:3002/produit/${item.produit_id}`
        );
        const product = productResponse.data;

        if (product.stock < item.quantite) {
          return res.status(400).json({
            message: `Stock insuffisant pour le produit ${product.nom}`,
          });
        }

        prix_total += product.prix * item.quantite;

        await axios.patch(
          `http://localhost:3002/produit/${item.produit_id}/stock`,
          {
            stock: product.stock - item.quantite,
          }
        );
      } catch (error) {
        return res.status(400).json({
          message: `Erreur lors de la verification du produit ${item.produit_id}`,
        });
      }
    }

    const order = new Order({
      produits,
      client_id,
      prix_total,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/commande/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvee" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/commande/:id/statut", async (req, res) => {
  try {
    const { statut } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    if (!["En attente", "Confirmee", "Expediee"].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    order.statut = statut;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
