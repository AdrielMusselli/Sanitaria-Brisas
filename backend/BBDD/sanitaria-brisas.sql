-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-11-2025 a las 16:50:55
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
-- Base de datos: `sanitaria-brisas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha` date NOT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `direccion_envio` varchar(255) DEFAULT NULL,
  `precio_total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id_pedido`, `id_usuario`, `fecha`, `estado`, `direccion_envio`, `precio_total`) VALUES
(2, 2, '2025-08-26', 'Enviado', 'Av. Italia 456, Montevideo', 4800.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `imagenes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre`, `categoria`, `precio`, `stock`, `descripcion`, `imagenes`) VALUES
(41, 'tenaza', 'Herramientas', 1500.00, 100, 'La tenaza es una herramienta manual resistente y versátil, fabricada en acero de alta calidad, ideal para trabajos de construcción, carpintería y uso general en el hogar. Diseñada para ofrecer un agarre firme y preciso, permite sujetar, torcer y cortar alambres con facilidad. Su mango ergonómico proporciona comodidad y control durante el uso prolongado, convirtiéndola en una herramienta indispensable para profesionales y aficionados.', 'assets/69166ac80b17c_descarga.jfif'),
(43, 'serrucho', 'Herramientas', 2000.00, 200, 'El serrucho es una herramienta manual indispensable para realizar cortes rápidos y precisos en madera. Su hoja de acero al carbono, afilada y resistente, ofrece un rendimiento óptimo incluso en trabajos exigentes. El mango ergonómico proporciona un agarre cómodo y seguro, facilitando el control durante el uso. Perfecto para carpintería, bricolaje y tareas de construcción, el serrucho combina durabilidad, eficiencia y facilidad de manejo.', 'assets/69166b3b60954_serrucho.jfif'),
(44, 'taladro', 'Herramientas', 3000.00, 100, 'El taladro es una herramienta eléctrica indispensable para perforar madera, metal, plástico y mampostería con precisión y rapidez. Equipado con un motor potente y múltiples velocidades, permite adaptarse a distintos tipos de trabajo. Su diseño ergonómico y liviano brinda mayor comodidad y control, reduciendo la fatiga durante el uso prolongado. Ideal para profesionales y usuarios domésticos, el taladro ofrece versatilidad, potencia y durabilidad en todo tipo de proyectos.', 'assets/69166b8703a24_taladro.jfif'),
(45, 'sierra', 'Herramientas', 4500.00, 50, 'La sierra es una herramienta esencial para cortes precisos en madera, plástico y otros materiales. Fabricada con una hoja de acero templado de alta resistencia, garantiza un corte limpio y uniforme. Su diseño ergonómico permite un manejo cómodo y seguro, reduciendo la fatiga en trabajos prolongados. Ideal para carpinteros, técnicos y usuarios domésticos que buscan calidad, durabilidad y rendimiento en cada proyecto.', 'assets/69166bca8e618_sierra.jfif'),
(46, 'IsoPanel', 'Techos', 2000.00, 400, 'El isopanel para techos es un panel termoaislante compuesto por dos láminas de acero galvanizado y un núcleo de espuma rígida de poliuretano o poliestireno, diseñado para brindar excelente aislamiento térmico y acústico. Su estructura liviana, resistente y de alta durabilidad lo convierte en una solución ideal para viviendas, galpones, comercios e instalaciones industriales. Además, ofrece una instalación rápida y limpia, con un acabado estético moderno y gran resistencia a la humedad y la corrosión. Perfecto para quienes buscan eficiencia energética, confort y larga vida útil en sus construcciones.', 'assets/69166e5ce4de7_isopanel.jfif'),
(47, 'Chapa', 'Techos', 1500.00, 150, 'La chapa para techo es una solución resistente y duradera para la cobertura de viviendas, galpones, comercios y estructuras rurales. Fabricada en acero galvanizado o prepintado, ofrece alta protección contra la corrosión, gran capacidad de drenaje y excelente comportamiento frente a las inclemencias del tiempo. Su diseño acanalado o trapezoidal brinda rigidez estructural y facilita la instalación, asegurando un techado liviano, económico y de larga vida útil. Ideal para proyectos que requieren fortaleza, practicidad y bajo mantenimiento.', 'assets/69166e9a9fff5_chapa.jfif'),
(48, 'Pintura', 'Pinturas', 1500.00, 250, 'La pintura es un recubrimiento de alta calidad diseñado para proteger y embellecer superficies interiores y exteriores. Formulada con componentes duraderos, ofrece excelente adherencia, cobertura uniforme y resistencia al desgaste. Disponible en una amplia variedad de colores y acabados, permite renovar paredes, metales, maderas y otras superficies con resultados profesionales. Su secado rápido y fácil aplicación la convierten en una opción ideal tanto para usuarios domésticos como para trabajos profesionales.', 'assets/69166ee615b77_pintura.jfif'),
(49, 'Ladrillos', 'Construccion', 150.00, 1000, 'Los ladrillos son materiales de construcción resistentes y duraderos, fabricados con arcilla cocida o cemento, ideales para levantar muros, tabiques y estructuras sólidas. Su diseño uniforme permite una colocación rápida y precisa, garantizando estabilidad y un excelente comportamiento estructural. Ofrecen aislamiento térmico, buena resistencia a la humedad y larga vida útil, convirtiéndolos en una opción confiable tanto para obras nuevas como para remodelaciones. Disponibles en diversos formatos, los ladrillos se adaptan a todo tipo de proyectos, desde viviendas hasta construcciones comerciales.', 'assets/69166f47124a4_ladrillo.jfif'),
(50, 'Portland', 'Construccion', 500.00, 200, 'El cemento Portland es un material de construcción esencial, elaborado a partir de clinker y yeso, diseñado para obtener concreto y mortero de alta resistencia. Su rápida fraguabilidad y excelente adherencia lo hacen ideal para obras civiles, construcción de viviendas, pavimentos y reparaciones en general. Garantiza durabilidad, estabilidad estructural y resistencia a la compresión, convirtiéndolo en la opción confiable para proyectos que requieren solidez y larga vida útil. Disponible en sacos de distintas capacidades, facilita el manejo y almacenamiento en obra.', 'assets/69166f92b304e_porlan.jfif'),
(51, 'serruchito', 'Herramientas', 20000.00, 2222, 'sadasda', 'assets/69174eb244830_aaaa.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reseña`
--

CREATE TABLE `reseña` (
  `id_reseña` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `comentario` text DEFAULT NULL,
  `puntuacion` int(11) DEFAULT NULL CHECK (`puntuacion` between 1 and 5),
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `contraseña` varchar(255) NOT NULL,
  `admin` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `email`, `telefono`, `contraseña`, `admin`) VALUES
(1, 'Administrador', 'admin@gmail.com', NULL, 'sanitariabrisas23', 1),
(2, 'María López', 'marialopez@gmail.com', '092345678', 'hashed456', NULL),
(3, 'Carlos Silva', 'csilva@gmail.com', '093456789', '$2y$10$3bYro.Hs/9Mu4/khxkK7mOorQWZXOUsMQPwxZ4fuaVvHrj/0U21xu', NULL),
(5, 'emiliano', 'marquez@gmail.com', '098709908', '$2y$10$PdT3GTdPGREZOsNV4mo28uwR/oKKt6fQ0Liadgrgl5WSKLRuTZ3/e', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `reseña`
--
ALTER TABLE `reseña`
  ADD PRIMARY KEY (`id_reseña`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `reseña`
--
ALTER TABLE `reseña`
  MODIFY `id_reseña` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `reseña`
--
ALTER TABLE `reseña`
  ADD CONSTRAINT `reseña_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `reseña_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
