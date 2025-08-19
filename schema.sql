-- phpMyAdmin SQL Dump
-- version 4.9.11
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 19. Aug 2025 um 14:27
-- Server-Version: 10.11.13-MariaDB-0ubuntu0.24.04.1-log
-- PHP-Version: 7.4.33-nmm7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `d043fb41`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Abteilung`
--

CREATE TABLE `Abteilung` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Angebot`
--

CREATE TABLE `Angebot` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `subtitle` varchar(191) DEFAULT NULL,
  `date_start` datetime(3) NOT NULL,
  `date_stop` datetime(3) NOT NULL,
  `link` varchar(191) NOT NULL,
  `image` varchar(191) NOT NULL,
  `anzeigen` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Ansprechpartner`
--

CREATE TABLE `Ansprechpartner` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `telefon` varchar(191) DEFAULT NULL,
  `mobil` varchar(191) DEFAULT NULL,
  `mail` varchar(191) DEFAULT NULL,
  `lieferantId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Aussteller`
--

CREATE TABLE `Aussteller` (
  `id` int(11) NOT NULL,
  `Artikelnummer` varchar(191) NOT NULL,
  `Artikelname` varchar(191) NOT NULL,
  `Specs` text NOT NULL,
  `Preis` float NOT NULL,
  `Bild` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Einkauf`
--

CREATE TABLE `Einkauf` (
  `id` varchar(191) NOT NULL,
  `Paypal` tinyint(1) NOT NULL DEFAULT 0,
  `Abonniert` tinyint(1) NOT NULL DEFAULT 0,
  `Geld` varchar(191) DEFAULT NULL,
  `Pfand` varchar(191) DEFAULT NULL,
  `Dinge` text NOT NULL,
  `Abgeschickt` datetime(3) NOT NULL,
  `Bild1` text DEFAULT NULL,
  `Bild2` text DEFAULT NULL,
  `Bild3` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Jobs`
--

CREATE TABLE `Jobs` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `online` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Lieferant`
--

CREATE TABLE `Lieferant` (
  `id` varchar(191) NOT NULL,
  `Firma` varchar(191) NOT NULL,
  `Kundennummer` varchar(191) DEFAULT NULL,
  `Webseite` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Mitarbeiter`
--

CREATE TABLE `Mitarbeiter` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `short` varchar(191) DEFAULT NULL,
  `image` tinyint(1) NOT NULL DEFAULT 0,
  `sex` varchar(191) DEFAULT NULL,
  `focus` varchar(191) DEFAULT NULL,
  `mail` varchar(191) DEFAULT NULL,
  `abteilungId` varchar(191) DEFAULT NULL,
  `einkaufId` varchar(191) DEFAULT NULL,
  `Azubi` tinyint(1) NOT NULL DEFAULT 0,
  `Geburtstag` datetime(3) DEFAULT NULL,
  `Gruppenwahl` varchar(191) DEFAULT NULL,
  `HomeOffice` varchar(191) DEFAULT NULL,
  `Mobil_Business` varchar(191) DEFAULT NULL,
  `Mobil_Privat` varchar(191) DEFAULT NULL,
  `Telefon_Business` varchar(191) DEFAULT NULL,
  `Telefon_Intern_1` varchar(191) DEFAULT NULL,
  `Telefon_Intern_2` varchar(191) DEFAULT NULL,
  `Telefon_Privat` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Partner`
--

CREATE TABLE `Partner` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `link` varchar(191) NOT NULL,
  `image` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Pdfs`
--

CREATE TABLE `Pdfs` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `body` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Referenzen`
--

CREATE TABLE `Referenzen` (
  `id` varchar(191) NOT NULL,
  `Name` varchar(191) NOT NULL,
  `Webseite` varchar(191) NOT NULL,
  `Bild` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Status`
--

CREATE TABLE `Status` (
  `id` int(11) NOT NULL,
  `status` varchar(191) NOT NULL,
  `since` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `User`
--

CREATE TABLE `User` (
  `id` varchar(191) NOT NULL,
  `Username` varchar(191) NOT NULL,
  `Mail` varchar(191) NOT NULL,
  `Password` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Warenlieferung`
--

CREATE TABLE `Warenlieferung` (
  `Name` varchar(191) NOT NULL,
  `angelegt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `geliefert` datetime(3) DEFAULT NULL,
  `AlterPreis` float(65,30) DEFAULT NULL,
  `NeuerPreis` float(65,30) DEFAULT NULL,
  `Preis` datetime(3) DEFAULT NULL,
  `Artikelnummer` varchar(191) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `Abteilung`
--
ALTER TABLE `Abteilung`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Angebot`
--
ALTER TABLE `Angebot`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Ansprechpartner`
--
ALTER TABLE `Ansprechpartner`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Ansprechpartner_lieferantId_fkey` (`lieferantId`);

--
-- Indizes für die Tabelle `Aussteller`
--
ALTER TABLE `Aussteller`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Einkauf`
--
ALTER TABLE `Einkauf`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Jobs`
--
ALTER TABLE `Jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Lieferant`
--
ALTER TABLE `Lieferant`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Mitarbeiter`
--
ALTER TABLE `Mitarbeiter`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Mitarbeiter_name_key` (`name`),
  ADD UNIQUE KEY `Mitarbeiter_mail_key` (`mail`),
  ADD UNIQUE KEY `Mitarbeiter_einkaufId_key` (`einkaufId`),
  ADD KEY `Mitarbeiter_abteilungId_fkey` (`abteilungId`);

--
-- Indizes für die Tabelle `Partner`
--
ALTER TABLE `Partner`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Pdfs`
--
ALTER TABLE `Pdfs`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Referenzen`
--
ALTER TABLE `Referenzen`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Status`
--
ALTER TABLE `Status`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_Username_key` (`Username`),
  ADD UNIQUE KEY `User_Mail_key` (`Mail`);

--
-- Indizes für die Tabelle `Warenlieferung`
--
ALTER TABLE `Warenlieferung`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `Pdfs`
--
ALTER TABLE `Pdfs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Status`
--
ALTER TABLE `Status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `Ansprechpartner`
--
ALTER TABLE `Ansprechpartner`
  ADD CONSTRAINT `Ansprechpartner_lieferantId_fkey` FOREIGN KEY (`lieferantId`) REFERENCES `Lieferant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `Mitarbeiter`
--
ALTER TABLE `Mitarbeiter`
  ADD CONSTRAINT `Mitarbeiter_abteilungId_fkey` FOREIGN KEY (`abteilungId`) REFERENCES `Abteilung` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Mitarbeiter_einkaufId_fkey` FOREIGN KEY (`einkaufId`) REFERENCES `Einkauf` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
