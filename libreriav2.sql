CREATE DATABASE  IF NOT EXISTS `libreria_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `libreria_db`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: libreria_db
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `zona` varchar(20) NOT NULL,
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'nelly','Hostal Las Carolinas, 9-49, 10a Avenida, Zona 1, Colonia La Palmita, Ciudad de Guatemala, Zona 11, Departamento de Guatemala, 01001, Guatemala','Zona 1'),(2,'Nelly','34 Avenida A, Zona 5, Colonia Arrivillaga, Ciudad de Guatemala, Zona 4, Departamento de Guatemala, 01005, Guatemala','Zona 5'),(3,'Nelly','Colonia Arco 3, Zona 5, Ciudad de Guatemala, Zona 11, Departamento de Guatemala, 01005, Guatemala','Zona 5'),(4,'Wilber','12 Avenida, Colonia Mariscal, Zona 11, Ciudad de Guatemala, Zona 10 Mixco, Departamento de Guatemala, 01011, Guatemala','Zona 11'),(5,'Alejandro','11 Calle, Residenciales Santa Delfina de Signé, Zona 2, Ciudad de Guatemala, Departamento de Guatemala, 01002, Guatemala','Zona 2'),(6,'Anita','1a Calle, Colonia Betancur, Zona 4 de Villa Nueva, Villa Nueva, Zona 9, Departamento de Guatemala, 01064, Guatemala','Zona 16'),(7,'Tom','10a Avenida, Colonia Roosevelt, Zona 11, Ciudad de Guatemala, Zona 10 Mixco, Departamento de Guatemala, 01011, Guatemala','Zona 11'),(8,'Makki Tejada','Instituto Normal Central de Señoritas Belén, 13 Calle, Barrio Gerona, Zona 1, Colonia La Trinidad, Ciudad de Guatemala, Zona 11, Departamento de Guatemala, 01001, Guatemala','Zona 1'),(9,'Brigitte','23 Avenida, Zona 5, Colonia La Palmita, Ciudad de Guatemala, Zona 4, Departamento de Guatemala, 01005, Guatemala','Zona 5'),(10,'Luis Alvarez','15 Calle A, Barrio Gerona, Zona 1, Colonia La Palmita, Ciudad de Guatemala, Zona 11, Departamento de Guatemala, 01001, Guatemala','Zona 1'),(11,'Ronald','Palacio Arzobispal, 6-21, 7a Calle, Zona 1, Ciudad de Guatemala, Zona 1, Departamento de Guatemala, 01001, Guatemala','Zona 1'),(12,'Cristian Alvarez Obando','5a Calle, Zona 1, Colonia La Trinidad, Ciudad de Guatemala, Zona 11, Departamento de Guatemala, 01001, Guatemala','Zona 1'),(13,'nnnnn','35 Calle E, Colonia Sakerti 2, Zona 7, Ciudad de Guatemala, Departamento de Guatemala, 01001, Guatemala','Zona 7');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensajeros`
--

DROP TABLE IF EXISTS `mensajeros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajeros` (
  `id_mensajero` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `id_sucursal` int DEFAULT NULL,
  PRIMARY KEY (`id_mensajero`),
  KEY `fk_mensajero_sucursal` (`id_sucursal`),
  CONSTRAINT `fk_mensajero_sucursal` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id_sucursal`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajeros`
--

LOCK TABLES `mensajeros` WRITE;
/*!40000 ALTER TABLE `mensajeros` DISABLE KEYS */;
INSERT INTO `mensajeros` VALUES (4,'Carlos López','5551-2233',4),(5,'María Pérez','5552-3344',5),(6,'José Ramírez','5553-4455',6);
/*!40000 ALTER TABLE `mensajeros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_detalle`
--

DROP TABLE IF EXISTS `pedido_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_detalle` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int NOT NULL,
  `titulo_libro` varchar(150) NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) GENERATED ALWAYS AS ((`cantidad` * `precio_unitario`)) STORED,
  PRIMARY KEY (`id_detalle`),
  KEY `id_pedido` (`id_pedido`),
  CONSTRAINT `pedido_detalle_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_detalle`
--

LOCK TABLES `pedido_detalle` WRITE;
/*!40000 ALTER TABLE `pedido_detalle` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `id_sucursal` int NOT NULL,
  `id_mensajero` int DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `tarifa_envio` decimal(10,2) NOT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` int DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_sucursal` (`id_sucursal`),
  KEY `id_mensajero` (`id_mensajero`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id_sucursal`),
  CONSTRAINT `pedidos_ibfk_3` FOREIGN KEY (`id_mensajero`) REFERENCES `mensajeros` (`id_mensajero`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (3,3,4,6,155.00,15.00,'2025-11-02 02:00:56',2),(4,4,4,5,300.00,15.00,'2025-11-02 02:09:40',2),(5,5,6,6,110.00,25.00,'2025-11-02 02:11:49',0),(6,6,4,4,130.00,15.00,'2025-11-02 02:20:30',1),(7,7,4,5,185.00,15.00,'2025-11-02 02:43:05',2),(8,8,4,5,255.00,15.00,'2025-11-02 05:35:33',2),(9,9,4,4,165.00,15.00,'2025-11-02 05:49:46',2),(10,10,4,4,175.00,15.00,'2025-11-02 13:21:35',0),(11,11,4,4,375.00,15.00,'2025-11-02 20:32:18',4),(12,12,4,4,1465.00,15.00,'2025-11-11 02:09:09',3),(255,13,6,6,295.00,25.00,'2025-11-11 02:47:04',3);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sucursales`
--

DROP TABLE IF EXISTS `sucursales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sucursales` (
  `id_sucursal` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `zona` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_sucursal`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sucursales`
--

LOCK TABLES `sucursales` WRITE;
/*!40000 ALTER TABLE `sucursales` DISABLE KEYS */;
INSERT INTO `sucursales` VALUES (4,'Sucursal Zona 1','6ª avenida 10-45, Ciudad de Guatemala','Zona 1'),(5,'Sucursal Zona 10','12 calle 2-45, Edificio Géminis, local 104, Zona 10','Zona 10'),(6,'Sucursal Boca del Monte','Calzada Principal 4-22, centro comercial Paseo del Monte, Boca del Monte','Boca del Monte');
/*!40000 ALTER TABLE `sucursales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'libreria_db'
--

--
-- Dumping routines for database 'libreria_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-11 20:09:34
