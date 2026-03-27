CREATE DATABASE reciclaje;

USE reciclaje;

CREATE TABLE materiales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL CHECK (cantidad >= 0),
  unidad VARCHAR(20) NOT NULL
);

INSERT INTO materiales (nombre,cantidad,unidad) VALUES
('Vidrio',100,'kg'),
('Hierro',200,'kg'),
('Baterías',10,'unidades'),
('Aceite de girasol',2,'m3');