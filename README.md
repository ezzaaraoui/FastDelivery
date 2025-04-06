# FastDelivery Microservices

Une application de gestion de livraison basée sur une architecture microservices.

## Services

1. Service d'Authentification (Port 3001)
2. Service de Produits (Port 3002)
3. Service de Commandes (Port 3003)
4. Service de Livraisons (Port 3004)

## Prérequis

- Node.js (v14 ou supérieur)
- MongoDB
- Postman (pour tester les APIs)

## Installation

1. Clonez le repository
2. Pour chaque service, allez dans le dossier correspondant et installez les dépendances :

```bash
cd auth-service && npm install
cd ../product-service && npm install
cd ../order-service && npm install
cd ../delivery-service && npm install
```

3. Démarrez MongoDB localement

4. Lancez chaque service dans un terminal différent :

```bash
# Terminal 1
cd auth-service && npm run dev

# Terminal 2
cd product-service && npm run dev

# Terminal 3
cd order-service && npm run dev

# Terminal 4
cd delivery-service && npm run dev
```

## Tests Postman

### Service d'Authentification (Port 3001)

1. Inscription d'un utilisateur

```http
POST http://localhost:3001/auth/register
Content-Type: application/json

{
    "nom": "John Doe",
    "email": "john@example.com",
    "mot_de_passe": "password123"
}
```

2. Connexion

```http
POST http://localhost:3001/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "mot_de_passe": "password123"
}
```

3. Obtenir le profil

```http
GET http://localhost:3001/auth/profil
Authorization: Bearer <votre_token_jwt>
```

### Service de Produits (Port 3002)

1. Ajouter un produit

```http
POST http://localhost:3002/produit/ajouter
Content-Type: application/json

{
    "nom": "Smartphone XYZ",
    "description": "Un super smartphone",
    "prix": 499.99,
    "stock": 50
}
```

2. Obtenir un produit

```http
GET http://localhost:3002/produit/:id
```

3. Mettre à jour le stock

```http
PATCH http://localhost:3002/produit/:id/stock
Content-Type: application/json

{
    "stock": 45
}
```

### Service de Commandes (Port 3003)

1. Créer une commande

```http
POST http://localhost:3003/commande/ajouter
Content-Type: application/json

{
    "produits": [
        {
            "produit_id": "id_du_produit",
            "quantite": 2
        }
    ],
    "client_id": "id_du_client"
}
```

2. Obtenir une commande

```http
GET http://localhost:3003/commande/:id
```

3. Mettre à jour le statut

```http
PATCH http://localhost:3003/commande/:id/statut
Content-Type: application/json

{
    "statut": "Confirmée"
}
```

### Service de Livraisons (Port 3004)

1. Créer une livraison

```http
POST http://localhost:3004/livraison/ajouter
Content-Type: application/json

{
    "commande_id": "id_de_la_commande",
    "transporteur_id": "id_du_transporteur",
    "adresse_livraison": "123 Rue Example, Ville"
}
```

2. Mettre à jour le statut

```http
PUT http://localhost:3004/livraison/:id
Content-Type: application/json

{
    "statut": "En cours"
}
```

## Notes

- Assurez-vous que MongoDB est en cours d'exécution avant de lancer les services
- Les services communiquent entre eux via HTTP
- Chaque service a sa propre base de données MongoDB
- Les mots de passe sont hachés avant d'être stockés
- Les tokens JWT sont utilisés pour l'authentification
