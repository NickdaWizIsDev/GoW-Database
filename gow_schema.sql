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
(3, 'ESPADAS DE ATENEA.PNG'),
(4, 'ESPADA DE ARTEMISA.PNG'),
(5, 'ESPADA DEL OLIMPO.PNG'),
(6, 'MARTILLO BARBARO.PNG'),
(7, 'LANZA DEL DESTINO.PNG'),
(8, 'CESTUS DE NEMEA.PNG'),
(9, 'ESPADAS DE ESPARTA.PNG'),
(10, 'ARCO DE APOLO.PNG'),
(11, 'GARRAS DE HADES.PNG'),
(12, 'LLAMAS DE ARES.PNG');

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
("LLAMAS DE ARES", 26, 1.8, 3, 12, 3, 3, 2, 1);
