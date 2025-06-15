-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-05-2025 a las 15:57:14
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sanitaria brisas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(100) NOT NULL,
  `descripcion_producto` text DEFAULT NULL,
  `precio_producto` decimal(10,2) NOT NULL,
  `stock_producto` int(11) NOT NULL,
  `categoria_producto` varchar(50) NOT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre_producto`, `descripcion_producto`, `precio_producto`, `stock_producto`, `categoria_producto`) VALUES
(1, 'Cemento Portland', 'Bolsa de cemento de 25 kg ideal para obras estructurales.', 350.00, 100, 'Construcción'),
(2, 'Arena fina', 'Metro cúbico de arena lavada para revoques y mezclas.', 200.00, 50, 'Construcción'),
(3, 'Ladrillo común', 'Ladrillo cocido estándar, ideal para muros interiores.', 15.00, 1000, 'Construcción'),
(4, 'Hierro del 8', 'Barra de hierro de 12 metros para estructuras de hormigón.', 220.00, 300, 'Construcción'),
(5, 'Cal hidratada', 'Bolsa de 20 kg utilizada en mezclas y pinturas a la cal.', 180.00, 80, 'Construcción'),
(6, 'Bloque de hormigón', 'Bloque para paredes exteriores, 39x19x14 cm.', 55.00, 600, 'Construcción'),
(7, 'Teja colonial', 'Teja cerámica tradicional para techos.', 65.00, 400, 'Techos'),
(8, 'Chapa galvanizada', 'Chapa ondulada galvanizada de 3 metros.', 900.00, 150, 'Techos'),
(9, 'Pintura latex blanca', 'Balde de 20 litros de pintura interior lavable.', 1200.00, 30, 'Pinturas'),
(10, 'Cinta métrica 5m', 'Cinta retráctil metálica con traba y clip.', 180.00, 75, 'Herramientas');

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `email`, `telefono`) VALUES
(1, 'Juan Pérez', 'juan.perez@example.com', '123456789'),
(2, 'Ana Gómez', 'ana.gomez@example.com', '987654321'),
(3, 'Luis Rodríguez', 'luis.rodriguez@example.com', '555123456'),
(4, 'María López', 'maria.lopez@example.com', '666789123'),
(5, 'Carlos Martínez', 'carlos.martinez@example.com', '777654321'),
(6, 'Sofía Sánchez', 'sofia.sanchez@example.com', '888321456'),
(7, 'Pedro Fernández', 'pedro.fernandez@example.com', '999432789'),
(8, 'Laura Díaz', 'laura.diaz@example.com', '111222333'),
(9, 'Miguel Torres', 'miguel.torres@example.com', '444555666'),
(10, 'Elena Morales', 'elena.morales@example.com', '222333444');

CREATE TABLE pedido (
  id_pedido INT(11) NOT NULL AUTO_INCREMENT,
  id_usuario INT(11) NOT NULL,
  fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',  -- Ej: pendiente, enviado, entregado, cancelado
  PRIMARY KEY (id_pedido),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
);

INSERT INTO `pedido` (`id_prestamos`, `id_libro`, `id_usuario`, `fecha_prestamos`, `fecha_devolucion`) VALUES
(1, 1, 1, '2025-03-01', '2025-03-15'),
(2, 2, 2, '2025-03-02', '2025-03-16'),
(3, 3, 3, '2025-03-03', '2025-03-17'),
(4, 4, 4, '2025-03-04', '2025-03-18'),
(5, 5, 5, '2025-03-05', '2025-03-19'),
(6, 6, 6, '2025-03-06', '2025-03-20'),
(7, 7, 7, '2025-03-07', '2025-03-21'),
(8, 8, 8, '2025-03-08', '2025-03-22'),
(9, 9, 9, '2025-03-09', '2025-03-23'),
(10, 10, 10, '2025-03-10', '2025-03-24');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

