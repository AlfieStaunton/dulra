-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dulra_db
-- ------------------------------------------------------
-- Server version	9.4.0

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
-- Table structure for table `butterfly_species`
--

DROP TABLE IF EXISTS `butterfly_species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `butterfly_species` (
  `id` int NOT NULL AUTO_INCREMENT,
  `common_name` varchar(100) NOT NULL,
  `scientific_name` varchar(100) NOT NULL,
  `image_url` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `common_name` (`common_name`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `butterfly_species`
--

LOCK TABLES `butterfly_species` WRITE;
/*!40000 ALTER TABLE `butterfly_species` DISABLE KEYS */;
INSERT INTO `butterfly_species` VALUES (1,'Speckled Wood','Pararge Aegeria',NULL),(2,'Painted Lady','Vanessa Cardui',NULL),(3,'Large White','Pieris Brassicae',NULL),(4,'Green-veined White','Pieris Napi',NULL),(5,'Small White','Pieris Rapae',NULL),(6,'Orange-tip','Anthocharis Cardamines',NULL),(7,'Meadow Brown','Maniola Jurtina',NULL),(8,'Holly Blue','Celastrina Argiolus',NULL),(9,'Red Admiral','Vanessa Atalanta',NULL),(10,'Ringlet','Aphantopus Hyperantus',NULL),(11,'Small Tortoiseshell','Aglais Urticae',NULL),(12,'Peacock','Aglais Io',NULL),(13,'Common Blue','Polyommatus Icarus',NULL),(14,'Wood White','Leptidea Sinapis',NULL),(15,'Comma','Polygonia C-album',NULL),(16,'Brimstone','Gonepteryx Rhamni',NULL),(17,'Small Copper','Lycaena Phlaeas',NULL),(18,'Silver-washed Fritillary','Argynnis Paphia',NULL),(19,'Wall','Lasiommata Megera',NULL),(20,'Essex Skipper','Thymelicus Lineola',NULL),(21,'Small Heath','Coenonympha Pamphilus',NULL),(22,'Unidentified Butterfly','Unidentified Butterfly',NULL);
/*!40000 ALTER TABLE `butterfly_species` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `site_id` int DEFAULT NULL,
  `session_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `temperature` int NOT NULL,
  `sunshine_level` varchar(50) DEFAULT NULL,
  `wind_level` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `site_id` (`site_id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sessions_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,3,NULL,'2026-07-28','10:54:00','11:09:00',15,'Partial cloud cover','Smoke rises vertically','2026-07-28 10:10:01'),(2,6,4,'2026-07-29','20:37:00','20:52:00',15,'partial','Wind felt on face, leaves rustle','2026-07-29 19:58:07'),(3,8,6,'2026-07-29','21:14:00','21:29:00',15,'Partial cloud cover','Leaves and twigs in slight motion','2026-07-29 20:30:16'),(4,8,6,'2026-07-29','21:16:00','21:31:00',15,'partial','Wind felt on face, leaves rustle','2026-07-29 20:31:21');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sightings`
--

DROP TABLE IF EXISTS `sightings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sightings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `species_id` int DEFAULT NULL,
  `count_quantity` int DEFAULT '1',
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `photo_url` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `species_id` (`species_id`),
  CONSTRAINT `sightings_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sightings_ibfk_2` FOREIGN KEY (`species_id`) REFERENCES `butterfly_species` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sightings`
--

LOCK TABLES `sightings` WRITE;
/*!40000 ALTER TABLE `sightings` DISABLE KEYS */;
INSERT INTO `sightings` VALUES (1,1,4,4,NULL,NULL,NULL),(2,1,10,4,NULL,NULL,NULL),(3,1,12,4,NULL,NULL,NULL),(4,1,15,2,NULL,NULL,NULL),(5,1,16,1,NULL,NULL,NULL),(6,1,20,2,NULL,NULL,NULL),(7,2,7,1,NULL,NULL,NULL),(8,2,15,1,NULL,NULL,NULL),(9,2,20,1,NULL,NULL,NULL),(10,4,3,5,NULL,NULL,NULL),(11,4,13,1,NULL,NULL,NULL),(12,4,15,2,NULL,NULL,NULL),(13,4,16,3,NULL,NULL,NULL);
/*!40000 ALTER TABLE `sightings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sites`
--

DROP TABLE IF EXISTS `sites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `site_name` varchar(100) NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sites`
--

LOCK TABLES `sites` WRITE;
/*!40000 ALTER TABLE `sites` DISABLE KEYS */;
INSERT INTO `sites` VALUES (1,3,'g1',53.372970,-6.262877),(2,5,'garden',53.367849,-6.233352),(3,5,'g1',53.367849,-6.233352),(4,6,'Back Garden',53.372868,-6.262792),(5,7,'garden back',53.372868,-6.262792),(6,8,'garden',53.372868,-6.262792);
/*!40000 ALTER TABLE `sites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Alfie','alfie.st@outlook.om','$2b$10$JVQUQDbaDLIl/INEitZTqOw6ArTXex7DM/Di0d6fKpSyU2OiKrKKG','2026-07-03 21:30:02'),(2,'Alfred','alfie.st@outloo.com','$2b$10$be4jywkyDkRCjhDXSxI94e8CIilPLhvvVyjAMIHTn7h1/S1EkYkN2','2026-07-11 17:04:35'),(3,'Bob','bob.st@outlook','$2b$10$KtnbZq2UIIthm0.XmdeqL.Ijq9SnxW38r75VeHob5h8wHqhruBJ4G','2026-07-28 08:42:33'),(4,'Billy','Billybob.st@outlook','$2b$10$j8nhnpv7PeBhW9tgwBDgleO5dx1wHteD0BNL1CxnX.MsYPIkdkCQq','2026-07-28 10:57:22'),(5,'Frank','frank@outlook.co','$2b$10$1.uJd3qHYMkIUMMam4RzYOYYP2YItVUhM/IgClO1wi1WesFTm8Vb.','2026-07-29 18:23:46'),(6,'Memphis','memphis@outlook.co','$2b$10$tpK76v3VCcnSPLNcNaY6ku.pzk7O9XeeT8FZpr1T9M1QE2Zxpee/y','2026-07-29 18:37:43'),(7,'Freddie','freddie@outlook.co','$2b$10$fiLxDIEGblQ6X7vSLNG7xuMu8XM8AQRRWW/0p0NhCLHqtp04WHxBe','2026-07-29 19:58:53'),(8,'alfredzo','alfred.st@outlook.co','$2b$10$YkmBqkPVrXF8duN1vvd7AOnBBuyG/BdNI13cJ3kdd1dCy7U9i753W','2026-07-29 20:16:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-30  9:34:33
