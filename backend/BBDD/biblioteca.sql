/*
 * Base de datos: biblioteca
 * Autor: [Tu Nombre]
 * Fecha: 10-04-2025
 * Descripción: Script SQL para crear y poblar la base de datos por si ejecuto el proyecto en otro dispositivo.
 
 ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-04-2025 a las 21:34:25
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `biblioteca`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `id_libro` int(11) NOT NULL,
  `titulo` varchar(45) NOT NULL,
  `autor` varchar(45) NOT NULL,
  `año_publicacion` date NOT NULL,
  `disponible` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`id_libro`, `titulo`, `autor`, `año_publicacion`, `disponible`) VALUES
(1, 'Cien años de soledad', 'Gabriel García Márquez', '0000-00-00', 0),
(2, 'Don Quijote de la Mancha', 'Miguel de Cervantes', '0000-00-00', 0),
(3, '1984', 'George Orwell', '0000-00-00', 0),
(4, 'El amor en los tiempos del cólera', 'Gabriel García Márquez', '0000-00-00', 0),
(5, 'Orgullo y prejuicio', 'Jane Austen', '0000-00-00', 0),
(6, 'La sombra del viento', 'Carlos Ruiz Zafón', '0000-00-00', 0),
(7, 'Matar a un ruiseñor', 'Harper Lee', '0000-00-00', 0),
(8, 'Crimen y castigo', 'Fiódor Dostoyevski', '0000-00-00', 0),
(9, 'Cumbres Borrascosas', 'Emily Brontë', '0000-00-00', 0),
(10, 'El gran Gatsby', 'F. Scott Fitzgerald', '0000-00-00', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamos`
--

CREATE TABLE `prestamos` (
  `id_prestamos` int(11) NOT NULL,
  `id_libro` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_prestamos` date NOT NULL,
  `fecha_devolucion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prestamos`
--

INSERT INTO `prestamos` (`id_prestamos`, `id_libro`, `id_usuario`, `fecha_prestamos`, `fecha_devolucion`) VALUES
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

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

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`id_libro`);

--
-- Indices de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD PRIMARY KEY (`id_prestamos`),
  ADD KEY `libro_prestamo` (`id_libro`),
  ADD KEY `usuario_prestamo` (`id_usuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `id_libro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  MODIFY `id_prestamos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD CONSTRAINT `libro_prestamo` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`),
  ADD CONSTRAINT `usuario_prestamo` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
