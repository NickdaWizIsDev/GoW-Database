DROP DATABASE IF EXISTS gow_weapons;
CREATE DATABASE gow_weapons;
USE gow_weapons;


CREATE TABLE `Player` (
        `id_player` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
        `user_name` VARCHAR(255) NOT NULL,
        `points` INTEGER NOT NULL,
        `id_weapon` INTEGER NOT NULL,
        PRIMARY KEY(`id_player`)
);




CREATE TABLE `Weapon` (
        `id_weapon` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
        `name_weapon` VARCHAR(255) NOT NULL,
        `damage` FLOAT NOT NULL,
        `range` FLOAT NOT NULL,
        `cooldown` FLOAT NOT NULL,
        `id_sprite` INTEGER NOT NULL,
        `id_material` INTEGER NOT NULL,
        `id_skill` INTEGER NOT NULL,
        `id_type_weapon` INTEGER NOT NULL,
        `id_level` INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY(`id_weapon`)
);




CREATE TABLE `Sprite` (
        `id_sprite` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
        `path_sprite` VARCHAR(255) NOT NULL,
        PRIMARY KEY(`id_sprite`)
);




CREATE TABLE `Material` (
        `id_material` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
        `path_material` VARCHAR(255) NOT NULL,
        PRIMARY KEY(`id_material`)
);




CREATE TABLE `Type_Weapon` (
        `id_type_weapon` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
        `name_type_weapon` VARCHAR(255) NOT NULL,
        PRIMARY KEY(`id_type_weapon`)
);




CREATE TABLE `Level` (
        `id_level` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
        `multiplier_damage` FLOAT NOT NULL DEFAULT 1,
        `multiplier_range` FLOAT NOT NULL DEFAULT 1,
        `multiplier_cooldown` FLOAT NOT NULL DEFAULT 1,
        PRIMARY KEY(`id_level`)
);




CREATE TABLE `Skill` (
        `id_skill` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
        `skill_name` VARCHAR(255) NOT NULL,
        `active` BOOLEAN NOT NULL DEFAULT false,
        PRIMARY KEY(`id_skill`)
);


id_type_weaponid_type_weapon

ALTER TABLE `Player`
ADD FOREIGN KEY(`id_weapon`) REFERENCES `Weapon`(`id_weapon`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `Weapon`
ADD FOREIGN KEY(`id_material`) REFERENCES `Material`(`id_material`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `Weapon`
ADD FOREIGN KEY(`id_sprite`) REFERENCES `Sprite`(`id_sprite`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `Weapon`
ADD FOREIGN KEY(`id_skill`) REFERENCES `Skill`(`id_skill`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `Weapon`
ADD FOREIGN KEY(`id_type_weapon`) REFERENCES `Type_Weapon`(`id_type_weapon`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `Weapon`
ADD FOREIGN KEY(`id_level`) REFERENCES `Level`(`id_level`)
ON UPDATE NO ACTION ON DELETE NO ACTION;


INSERT INTO SPRITE(id_sprite, path_sprite) VALUES
(1, 'ESPADAS DEL CAOS.PNG'),
(2, 'ESPADAS DEL EXILIO.PNG'),
(3, 'ESPADAS DE ATENA.PNG'),
(4, 'ESPADA DE ARTEMISA.PNG'),
(5, 'ESPADA DEL OLIMPO.PNG'),
(6, 'MARTILLO BARBARO.PNG'),
(7, 'LANZA DEL DESTINO.PNG'),
(8, 'CESTUS DE NEMEA.PNG'),
(9, 'ESPADAS DE ESPARTA.PNG'),
(10, 'ARCO DE APOLO.PNG'),
(11, 'GARRAS DE HADES.PNG'),
(12, 'LLAMAS DE ARES.PNG'),
(13, 'LANZA DE ODÍN.PNG'),
(14, 'ESPADA DE ZEUS.PNG'),
(15, 'DRAUPNIR SPEAR.PNG'),
(16, 'HACHA DEL LEVIATÁN.PNG'),
(17, 'BLADES OF CHAOS - RAGNAROK.PNG'),
(18, 'ARCO DE TIFÓN.PNG'),
(19, 'BOTAS DE HERMES.PNG'),
(20, 'AMULETO DE UROBOROS.PNG'),
(21, 'IRA DE LOS DIOSES.PNG'),
(22, 'FURIA DE ZEUS.PNG'),
(23, 'IRA DE POSEIDÓN.PNG'),
(24, 'MIRADA DE MEDUSA.PNG'),
(25, 'EJÉRCITO DE HADES.PNG'),
(26, 'CABEZA DE EURYALE.PNG'),
(27, 'IRA DE CRONOS.PNG'),
(28, 'FURIA DE TIFÓN.PNG'),
(29, 'MAGIA DE GAIA.PNG'),
(30, 'MAGIA DE HERMES.PNG'),
(31, 'MAGIA DE ATLAS.PNG'),
(32, 'INVOCACIÓN DE LOS MUERTOS.PNG'),
(33, 'MAGIA DE ESPARTA.PNG'),
(34, 'IRA DE ESPARTA.PNG'),
(35, 'LLAMAS DEL INFIERNO.PNG'),
(36, 'MAGIA DE NEMEA.PNG'),
(37, 'MAGIA DE HELIOS.PNG'),
(38, 'LLAMAS DE ARES.PNG'),
(39, 'MAGIA RÚNICA - HIELO.PNG'),
(40, 'MAGIA RÚNICA - FUEGO.PNG'),
(41, "LÁTIGOS DE NÉMESIS.PNG" ),
(42, "ESPADA DEL CAOS - FUEGO DE ARES.PNG" ),
(43, "ESPADA DEL CAOS - HIELO DE POSEIDÓN.PNG" ),
(44, "ESPADA DEL CAOS - RAYO DE ZEUS.PNG" ),
(45, "ESPADA DEL CAOS - ALMAS DE HADES.PNG" ),
(46, "VELLOCINO DE ORO.PNG" ),
(47, "CABEZA DE HELIOS.PNG" ),
(48, "ESCUDO DE HELIOS.PNG" ),
(49, "ALAS DE ÍCARO.PNG"),
(50, "ESCUDO DEL GUARDIÁN.PNG");

INSERT INTO MATERIAL(id_material, path_material) VALUES
(1, "ORO"),
(2, "METAL"),
(3, "MAGIA"),
(4, "RUNAS"),
(5, "HIERRO");


INSERT INTO SKILL(skill_name)VALUES
("GOLPE FUERTE"),
("GOLPE DÉBIL"),
("GOLPE EN EL AIRE"),
("GOLPE CON PUÑOS");

INSERT INTO LEVEL(multiplier_damage, multiplier_range, multiplier_cooldown) VALUES
(1, 1, 5),
(2, 2, 4),
(3, 3, 3),
(4, 4, 2),
(5, 5, 1);

INSERT INTO TYPE_WEAPON(name_type_weapon) VALUES
("ARMA"),
("MAGIA"),
("EXTRA");


INSERT INTO WEAPON(name_weapon, damage, `range`, cooldown, id_sprite, id_material, id_skill, id_type_weapon, id_level) VALUES 
("ESPADAS DEL CAOS", 20, 1.5, 2, 1, 5, 1, 1, 1),
("ESPADAS DEL EXILIO", 25, 1.5, 1, 2, 2, 3, 1, 1),
("ESPADAS DE ATENA", 25, 1.6, 1, 3, 1, 3, 1, 1),
("ESPADA DE ARTEMISA", 15, 1.2, 2, 4, 2, 2, 1, 1),
("ESPADA DEL OLIMPO", 35, 1.5, 3, 5, 5, 1, 1, 1),
("MARTILLO BÁRBARO", 19, 1.4, 3, 6, 2, 2, 1, 1),
("LANZA DEL DESTINO", 18, 2.0, 2, 7, 2, 3, 1, 1),
("CESTUS DE NEMEA", 30, 1.0, 3, 8, 5, 4, 1, 1),
("ESPADAS DE ESPARTA", 24, 1.5, 1, 9, 1, 1, 1, 1),
("ARCO DE APOLO", 15, 3.0, 2, 10, 3, 3, 1, 1),
("GARRAS DE HADES", 28, 1.6, 2, 11, 4, 1, 1, 1),
("LLAMAS DE ARES", 26, 1.8, 3, 12, 3, 3, 2, 1),
("LANZA DE ODÍN", 22, 2.5, 3, 13, 1, 3, 1, 1),
("ESPADA DE ZEUS", 35, 1.4, 4, 14, 1, 2, 1, 1),
("DRAUPNIR SPEAR", 30, 2.5, 4, 15, 5, 3, 1, 1),
("HACHA DEL LEVIATÁN", 32, 1.3, 2, 16, 2, 1, 1, 1),
("BLADES OF CHAOS - RAGNAROK", 28, 1.7, 2, 17, 3, 3, 1, 1),
("ARCO DE TIFÓN", 20, 3.5, 2, 18, 3, 1, 1, 1),
("BOTAS DE HERMES", 0, 0, 1, 19, 2, 4, 3, 1),
("AMULETO DE UROBOROS", 0, 0, 3, 20, 4, 4, 3, 1),
("IRA DE LOS DIOSES", 50, 1.5, 5, 21, 3, 1, 2, 1),
("FURIA DE ZEUS", 45, 1.4, 4, 22, 3, 1, 2, 1),
("IRA DE POSEIDÓN", 48, 2.0, 3, 23, 3, 3, 2, 1),
("MIRADA DE MEDUSA", 35, 1.0, 3, 24, 3, 2, 2, 1),
("EJÉRCITO DE HADES", 40, 2.5, 5, 25, 3, 3, 2, 1),
("CABEZA DE EURYALE", 30, 1.5, 3, 26, 3, 2, 2, 1),
("IRA DE CRONOS", 42, 2.0, 4, 27, 3, 1, 2, 1),
("FURIA DE TIFÓN", 33, 2.2, 3, 28, 3, 3, 2, 1),
("MAGIA DE GAIA", 25, 1.8, 2, 29, 3, 1, 2, 1),
("MAGIA DE HERMES", 20, 2.0, 2, 30, 3, 2, 2, 1),
("MAGIA DE ATLAS", 28, 2.1, 3, 31, 3, 3, 2, 1),
("INVOCACIÓN DE LOS MUERTOS", 30, 1.5, 3, 32, 3, 2, 2, 1),
("MAGIA DE ESPARTA", 32, 2.0, 3, 33, 3, 3, 2, 1),
("IRA DE ESPARTA", 38, 1.8, 3, 34, 3, 1, 2, 1),
("LLAMAS DEL INFIERNO", 35, 2.0, 4, 35, 3, 1, 2, 1),
("MAGIA DE NEMEA", 30, 2.2, 3, 36, 3, 2, 2, 1),
("MAGIA DE HELIOS", 28, 2.5, 3, 37, 3, 2, 2, 1),
("LLAMAS DE ARES", 30, 2.0, 3, 38, 3, 2, 2, 1),
("MAGIA RÚNICA - HIELO", 27, 2.2, 3, 39, 4, 2, 2, 1),
("MAGIA RÚNICA - FUEGO", 29, 2.2, 3, 40, 4, 2, 2, 1),
("LÁTIGOS DE NÉMESIS", 26, 1.6, 3, 41, 2, 3, 1, 1),
("ESPADA DEL CAOS - FUEGO DE ARES", 33, 1.7, 3, 42, 3, 1, 1, 1),
("ESPADA DEL CAOS - HIELO DE POSEIDÓN", 33, 1.7, 3, 43, 3, 2, 1, 1),
("ESPADA DEL CAOS - RAYO DE ZEUS", 33, 1.7, 3, 44, 3, 3, 1, 1),
("ESPADA DEL CAOS - ALMAS DE HADES", 33, 1.7, 3, 45, 3, 1, 1, 1),
("VELLOCINO DE ORO", 0, 0, 1, 46, 1, 4, 3, 1),
("CABEZA DE HELIOS", 0, 0, 2, 47, 3, 4, 3, 1),
("ESCUDO DE HELIOS", 0, 0, 2, 48, 5, 4, 3, 1),
("ALAS DE ÍCARO", 0, 0, 1, 49, 3, 4, 3, 1),
("ESCUDO DEL GUARDIÁN", 0, 0, 2, 50, 2, 4, 3, 1);
