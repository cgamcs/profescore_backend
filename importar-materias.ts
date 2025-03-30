import mongoose from 'mongoose';
import Department from './src/models/Department';  // Asegúrate de exportar el modelo y schema correctamente
import Subject from './src/models/Subject';        // Asegúrate de exportar el modelo y schema correctamente

// Función para normalizar nombres
const normalizeName = (name: string): string => {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Configuración
const FACULTY_ID = '67e759804ae0525d4b081c9b';
const MONGO_URI = 'mongodb+srv://profedb:UrNhDffzbpGqEy9f20hw@cluster0.mtyzq.mongodb.net/profescore_mern';

// Interface para los datos de las materias
interface Materia {
  MATERIA: string;
  DEPARTAMENTO: string;
  CREDITOS: number;
  DESCRIPCION: string;
}

// Datos de todas las materias
const materias: Materia[] = [
  {
    "MATERIA": "Liderazgo, Emorendimiento e Innovación",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 2,
    "DESCRIPCION": "Habilidades para gestión de proyectos, creación de startups y desarrollo de soluciones innovadoras."
  },
  {
    "MATERIA": "Contabilidad y Costos",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 3,
    "DESCRIPCION": "Principios contables, análisis de costos y presupuestos para la toma de decisiones en proyectos técnicos y empresariales."
  },
  {
    "MATERIA": "Liderazgo",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 2,
    "DESCRIPCION": "Habilidades para gestión de equipos, comunicación efectiva y motivación en entornos técnicos."
  },
  {
    "MATERIA": "Mercadotecnia para el comercio internacional",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 2,
    "DESCRIPCION": "Técnicas de marketing digital, logística global y análisis de mercados internacionales."
  },
  {
    "MATERIA": "Administración",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 3,
    "DESCRIPCION": "Principios de gestión empresarial: planificación, organización y control de recursos para optimizar procesos organizacionales."
  },
  {
    "MATERIA": "Economía",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 3,
    "DESCRIPCION": "Fundamentos de micro/macroeconomía: oferta-demanda, políticas fiscales y análisis de mercados."
  },
  {
    "MATERIA": "Mercadotecnia",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 3,
    "DESCRIPCION": "Estrategias de posicionamiento, segmentación de mercados y herramientas digitales para gestión de marcas."
  },
  {
    "MATERIA": "Administración Financiera",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 3,
    "DESCRIPCION": "Análisis de estados financieros, presupuestos y técnicas de inversión para maximizar rentabilidad."
  },
  {
    "MATERIA": "Formación de emprendedores",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 2,
    "DESCRIPCION": "Metodologías para crear startups: modelos de negocio, financiamiento y planes de comercialización."
  },
  {
    "MATERIA": "Modelos, Procesos y Estándares Administrativos",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 3,
    "DESCRIPCION": "Implementación de modelos administrativos (BPM, ISO) para optimizar procesos organizacionales y garantizar calidad."
  },
  {
    "MATERIA": "Ingeniería Económica de Proyectos",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 4,
    "DESCRIPCION": "Evaluación financiera de proyectos: VAN, TIR y análisis de rentabilidad para decisiones de inversión."
  },
  {
    "MATERIA": "Administración de Negocios",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 2,
    "DESCRIPCION": "Gestión de recursos, planificación estratégica y modelos de negocio para emprendimientos tecnológicos."
  },
  {
    "MATERIA": "Comportamiento Organizacional",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 2,
    "DESCRIPCION": "Dinámicas de grupos, motivación laboral y gestión del cambio en entornos corporativos."
  },
  {
    "MATERIA": "Desarrollo Organizacional",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 2,
    "DESCRIPCION": "Estrategias para transformación cultural, mejora continua y alineación de equipos multidisciplinarios."
  },
  {
    "MATERIA": "Administración de Recursos Humanos y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 4,
    "DESCRIPCION": "Gestión de talento: reclutamiento, capacitación y desarrollo organizacional. Simulaciones de casos prácticos."
  },
  {
    "MATERIA": "Organización Empresarial",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 2,
    "DESCRIPCION": "Estructuras organizacionales, cultura corporativa y alineación estratégica de recursos humanos."
  },
  {
    "MATERIA": "Técnicas Legales",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb6",
    "CREDITOS": 3,
    "DESCRIPCION": "Marco jurídico empresarial: contratos, regulaciones laborales y cumplimiento normativo en operaciones."
  },
  {
    "MATERIA": "Ciencia de los Materiales",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "En esta unidad de aprendizaje, la cual se encuentra dividida en 5 etapas el estudiante durante la primera de ellas podrá distinguir los diferentes tipos de materiales según el grupo al que pertenezcan en base a sus propiedades, así como identificar los enlaces químicos, estructuras cristalinas y mecanismo de cristalización."
  },
  {
    "MATERIA": "Tecnología de los Materiales",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "En esta unidad de aprendizaje, la cual se encuentra dividida en 5 etapas el estudiante durante la primera de ellas podrá distinguir los diferentes tipos de materiales según el grupo al que pertenezcan en base a sus propiedades, así como identificar los enlaces químicos, estructuras cristalinas y mecanismo de cristalización."
  },
  {
    "MATERIA": "Química Orgánica y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 4,
    "DESCRIPCION": "Síntesis y análisis de compuestos orgánicos, con enfoque en aplicaciones en polímeros y biomateriales."
  },
  {
    "MATERIA": "Metalurgia Física",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Relación entre microestructura, procesamiento y propiedades mecánicas de metales. Diagramas de fase."
  },
  {
    "MATERIA": "Polímeros",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Síntesis, caracterización y aplicaciones de materiales poliméricos. Comportamiento térmico y mecánico."
  },
  {
    "MATERIA": "Metalurgia Ferrosa Básica",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Fundamentos de producción y procesamiento de hierro y acero: desde mineral hasta aleaciones básicas."
  },
  {
    "MATERIA": "Cerámicos",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Propiedades, fabricación (sinterización) y usos de materiales cerámicos en alta temperatura y entornos críticos."
  },
  {
    "MATERIA": "Metalurgia Mecánica",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Efecto de deformación plástica en propiedades mecánicas. Endurecimiento por trabajo en frío."
  },
  {
    "MATERIA": "Metalurgia Ferrosa Avanzada",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Aceros especiales (inoxidables, herramientas), procesos de refinamiento y control de inclusiones."
  },
  {
    "MATERIA": "Cemento y Concreto",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Composición, propiedades mecánicas y durabilidad de concretos. Aditivos y técnicas de curado."
  },
  {
    "MATERIA": "Tecnología del Vidrio",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Procesos de fusión, moldeo y templado de vidrio. Aplicaciones en óptica, construcción y envases."
  },
  {
    "MATERIA": "Materiales Nanoestructurados",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Síntesis y propiedades de materiales con estructura nanométrica: nanopartículas, nanocompuestos."
  },
  {
    "MATERIA": "Nanotecnología",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Aplicaciones de nanomateriales en electrónica, medicina y energía. Técnicas de caracterización."
  },
  {
    "MATERIA": "Corrosión y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 4,
    "DESCRIPCION": "Mecanismos de oxidación, protección (pinturas, inhibidores) y ensayos acelerados en laboratorio."
  },
  {
    "MATERIA": "Ingeniería de Materiales y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Análisis de propiedades, selección y procesamiento de materiales (metales, polímeros, cerámicos), complementado con ensayos mecánicos, térmicos y microscopía en laboratorio."
  },
  {
    "MATERIA": "Materiales Compuestos I  y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Fabricación y caracterización de composites (fibra de carbono). Ensayos mecánicos y térmicos."
  },
  {
    "MATERIA": "Fisicoquímica de Materiales",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Termodinámica y cinética en procesos materiales: difusión, transformaciones de fase y reacciones sólido-gas."
  },
  {
    "MATERIA": "Taller de Materiales I",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Prácticas básicas de caracterización: ensayos mecánicos, microscopía óptica y preparación de muestras."
  },
  {
    "MATERIA": "Materiales Refractarios Estructurales",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño y aplicaciones de refractarios en hornos industriales: resistencia térmica y química."
  },
  {
    "MATERIA": "Tópicos Selectos de Céramicos",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Avances en cerámicos técnicos: materiales compuestos, superconductores o aplicaciones biomédicas."
  },
  {
    "MATERIA": "Propiedades Electromagnéticas de los Materiales",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Estudio de conductores, semiconductores y materiales magnéticos. Aplicaciones en dispositivos electrónicos."
  },
  {
    "MATERIA": "Reología de Polímeros y Lab",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Comportamiento viscoelástico de polímeros. Ensayos de fluidez, viscosidad y deformación en laboratorio."
  },
  {
    "MATERIA": "Taller de Materiales II",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Técnicas avanzadas: difracción de rayos X, microscopía electrónica y ensayos de fatiga."
  },
  {
    "MATERIA": "Aleaciones no Ferrosas",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Producción y aplicaciones de aleaciones de aluminio, cobre, titanio y magnesio en la industria."
  },
  {
    "MATERIA": "Procesamiento de Polimeros",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Técnicas de moldeo por inyección, extrusión y termoconformado. Control de parámetros de procesamiento."
  },
  {
    "MATERIA": "Tópicos Selectos de Metales",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Aleaciones avanzadas (superaleaciones, metales amorfos) y técnicas de manufactura innovadoras."
  },
  {
    "MATERIA": "Tratamientos Térmicos",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Procesos de temple, revenido y recocido para modificar dureza, tenacidad y estructura de metales."
  },
  {
    "MATERIA": "Taller de Materiales III",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Fabricación de composites y materiales nanoestructurados. Técnicas de pulvimetalurgia."
  },
  {
    "MATERIA": "Taller de Materiales IV",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Proyectos aplicados: selección, procesamiento y validación de materiales para casos industriales."
  },
  {
    "MATERIA": "Selección de Materiales",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Criterios técnicos, económicos y ambientales para elegir materiales en diseño ingenieril."
  },
  {
    "MATERIA": "Alumnio y sus Aleaciones",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Aleaciones ligeras, tratamientos térmicos y aplicaciones en aeronáutica y automoción."
  },
  {
    "MATERIA": "Tratamientos Térmicos del Acero",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 3,
    "DESCRIPCION": "Ciclos de tratamiento (carburización, nitruración) para mejorar resistencia al desgaste y fatiga."
  },
  {
    "MATERIA": "Tópicos Selectos de Ciencias de la Ingeniería I",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 2,
    "DESCRIPCION": "Tecnologías emergentes: computación cuántica, bioingeniería o nanotecnología."
  },
  {
    "MATERIA": "Tópicos Selectos de Ciencias de la Ingeniería II y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 4,
    "DESCRIPCION": "Aplicaciones avanzadas en mecatrónica, energía renovable o materiales inteligentes."
  },
  {
    "MATERIA": "Tópicos Selectos de Ciencias de la Ingeniería III y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca1",
    "CREDITOS": 4,
    "DESCRIPCION": "Innovaciones en IA ética, robótica colaborativa o sistemas autónomos sostenibles."
  },
  {
    "MATERIA": "Física I y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 4,
    "DESCRIPCION": "La unidad de aprendizaje Física I es impartida a estudiantes de primer ingreso de la FIME, por lo que deberán contar con conocimientos básicos de las principales teorías, leyes y conceptos de la Física adquiridos en el nivel medio superior."
  },
  {
    "MATERIA": "Álgebra para Ingeniería",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "En esta unidad de aprendizaje en una primera fase analizaremos los números complejos, su representación gráfica así como sus transformaciones lo cual nos permita realizar operaciones con los mismos."
  },
  {
    "MATERIA": "Matemáticas I",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje consta de dos fases, la primera se refiere al análisis de funciones de una variable y la segunda al análisis de funciones de varias variables."
  },
  {
    "MATERIA": "Química General y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 4,
    "DESCRIPCION": "En esta unidad de aprendizaje el estudiante podrá diferenciar la materia en base a sus propiedades así como identificar el reactivo limitante y el exceso en una reacción lo que nos permita realizar cálculos estequiométricos, podrá diferenciar los tipos de soluciones y concentración para aplicarlos en procesos de titulación."
  },
  {
    "MATERIA": "Física II y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 4,
    "DESCRIPCION": "La física es una ciencia que le permite al estudiante modelar, comprender y predecir el comportamiento de fenómenos que se presentan en la naturaleza, por lo que esta unidad de aprendizaje le brindará al estudiante una introducción sobre tres grandes fases."
  },
  {
    "MATERIA": "Matemáticas II",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje contribuye a desarrollar en el estudiante su capacidad para analizar funciones de una y varias variables, lo que le permitirá formular y resolver integrales definidas e indefinidas en la solución de problemas de ingeniería."
  },
  {
    "MATERIA": "Física III y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 4,
    "DESCRIPCION": "Una gran parte de los fenómenos físicos que tenemos a nuestro alrededor, son de origen electromagnético. La aplicación de las leyes del electromagnetismo ha permitido a la humanidad el desarrollo de gran cantidad de tecnologías industriales."
  },
  {
    "MATERIA": "Matemáticas III",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje fortalece las habilidades para la solución de problemas lógicos-matemáticos y su relación con las diferentes unidades de aprendizaje básicas y de especialidad, para contribuir con el desarrollo integral del estudiante."
  },
  {
    "MATERIA": "Termodinámica Básica y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje está dividida en 5 unidades temáticas, en la primera se estudia el lenguaje utilizado en la ingeniería termodinámica. En la segunda unidad se estudian los conceptos de conservación de la masa y la energía. En la tercera unidad se estudian las sustancias puras, y se analizan mediante la primera ley de la termodinámica sus aplicaciones en dispositivos térmicos."
  },
  {
    "MATERIA": "Matemáticas IV",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje fortalece las habilidades para la solución de problemas lógicos-matemáticos y su relación con las diferentes unidades de aprendizaje básicas y de especialidad, para contribuir con el desarrollo integral del estudiante."
  },
  {
    "MATERIA": "Termodinámica de Gases y Vapores y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "La unidad de aprendizaje Termodinámica de Gases y Vapores centra el estudio de las propiedades termodinámicas de gases y vapores desde un punto de vista de la segunda ley de la termodinámica."
  },
  {
    "MATERIA": "Física IV y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 4,
    "DESCRIPCION": "Esta unidad de aprendizaje le proporcionará al estudiante la capacidad de identificar los principios básicos del funcionamiento de algunos equipos de la industria moderna, como el láser, la microscopía y la energía nuclear, logrando así relacionarlo con los conceptos y principios esenciales de la ciencia moderna."
  },
  {
    "MATERIA": "Probabilidad y Estadística",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "En esta unidad de aprendizaje conocerán las diferentes herramientas matemáticas que nos ayudan a determinar eventos cotidianos como saber la probabilidad de que su equipo favorito quede campeón en el próximo torneo. El tiempo promedio en que los estudiantes culminan su carrera."
  },
  {
    "MATERIA": "Métodos numéricos",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Algoritmos computacionales para resolver ecuaciones diferenciales, integración y matrices."
  },
  {
    "MATERIA": "Cálculo Diferencial",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Límites, derivadas y aplicaciones en modelado de fenómenos físicos y técnicos."
  },
  {
    "MATERIA": "Cálculo Integral",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Integrales definidas/indefinidas, aplicadas a áreas, volúmenes y ecuaciones diferenciales básicas."
  },
  {
    "MATERIA": "Ecuaciones Diferenciales",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Modelado de sistemas dinámicos en ingeniería: ecuaciones ordinarias y parciales."
  },
  {
    "MATERIA": "Transformadas de Laplace y Series de Fourier",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Herramientas matemáticas para análisis de señales y sistemas en ingeniería."
  },
  {
    "MATERIA": "Matemáticas Discretas",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Lógica, teoría de grafos, combinatoria y álgebra booleana aplicadas a ciencias de la computación."
  },
  {
    "MATERIA": "Combustión y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Procesos de combustión en motores a reacción. Experimentos en cámaras de combustión y análisis de emisiones."
  },
  {
    "MATERIA": "Álgebra Lineal",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Matrices, espacios vectoriales y sistemas de ecuaciones lineales aplicados a ingeniería."
  },
  {
    "MATERIA": "Procesos Estocásticos",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Modelos probabilísticos para análisis de sistemas aleatorios en biología y medicina."
  },
  {
    "MATERIA": "Teoría Electromagnética",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Campos electromagnéticos, ondas y aplicaciones en dispositivos médicos (MRI, sensores)."
  },
  {
    "MATERIA": "Introducción a la Física del Estado Soólido",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 3,
    "DESCRIPCION": "Estructura cristalina, defectos y propiedades electrónicas de materiales. Teoría de bandas."
  },
  {
    "MATERIA": "Mecánica Vectorial",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9c",
    "CREDITOS": 2,
    "DESCRIPCION": "Estática y dinámica de partículas y cuerpos rígidos: equilibrio, fuerzas, momentos y análisis cinemático."
  },
  {
    "MATERIA": "Dibujo para Ingeniería",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 4,
    "DESCRIPCION": "Esta unidad de aprendizaje, permite al estudiante el conocimiento y la aplicación del dibujo como lenguaje gráfico universal, a través de las Normas: Oficial Mexicana (NOM), International Standards Organization (ISO) y American National Standards Institute (ANSI) proporcionándole la capacidad de interpretación de gráficos."
  },
  {
    "MATERIA": "Aplicación de las Tecnologías de Infromación",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Las Tecnologías de Información representan uno de los factores determinantes para el desarrollo y crecimiento económico de los países. Un factor que requiere de infraestructura y de personas que dominen competencias que les permitan hacer uso eficiente de esta tecnología de alcance global"
  },
  {
    "MATERIA": "Técnicas de CAD/CAM y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 3,
    "DESCRIPCION": "En esta unidad de aprendizaje se divide en tres fases, donde en la primera fase el estudiante desarrollará la destreza para aplicar una herramienta computacional en el diseño, en la siguiente fase identificará la metodología necesaria para la ingeniería del diseño y la optimización en la manufactura de un producto."
  },
  {
    "MATERIA": "Probabilidad Estocástica",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 3,
    "DESCRIPCION": "En esta unidad de aprendizaje conocerán las diferentes herramientas matemáticas que nos ayudan a determinar eventos cotidianos como saber la probabilidad de que su equipo favorito quede campeón en el próximo torneo. El tiempo promedio en que los estudiantes culminan su carrera."
  },
  {
    "MATERIA": "Programación Estructurada",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje contribuye a identificar los elementos básicos necesarios para la solución de problemas representando el mismo a través de un diagrama de flujo."
  },
  {
    "MATERIA": "Programación Visual",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje proporcionará al estudiante conocimientos básicos de programación, que aplicados a un lenguaje visual le permitirá\r\nel desarrollo de interfaces gráficas, con la finalidad de crear él mismo sus propias herramientas de software en la solución de problemas de\r\ncomplejidad media o proyectos."
  },
  {
    "MATERIA": "Lenguaje ANSI c",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Fundamentos de programación en C: sintaxis, estructuras de datos y aplicaciones en sistemas embebidos."
  },
  {
    "MATERIA": "Taller Programación",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Sesiones prácticas de codificación, resolución de problemas y depuración en múltiples lenguajes."
  },
  {
    "MATERIA": "Algoritmos Computacionales y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Diseño y análisis de algoritmos (ordenamiento, búsqueda) con implementación práctica en laboratorio."
  },
  {
    "MATERIA": "Estructura de Datos y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Estudio de listas, árboles, grafos y tablas hash. Laboratorios con implementación y optimización."
  },
  {
    "MATERIA": "Programación Web y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Desarrollo frontend/backend: HTML, CSS, JavaScript y frameworks. Prácticas en proyectos web dinámicos."
  },
  {
    "MATERIA": "Tópicos Selectos de Programación y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Enfoque en paradigmas avanzados (funcional, concurrente) con laboratorios de aplicaciones específicas."
  },
  {
    "MATERIA": "Lenguajes de Programación y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Comparación de paradigmas (OOP, funcional) y laboratorios con sintaxis y semántica de lenguajes."
  },
  {
    "MATERIA": "Sistemas Digitales y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño de circuitos lógicos, sistemas combinacionales y secuenciales con prácticas en FPGA."
  },
  {
    "MATERIA": "Arquitectura de Computadoras",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 2,
    "DESCRIPCION": "Componentes de hardware: CPU, memoria, buses. Ensamblador y análisis de rendimiento."
  },
  {
    "MATERIA": "Programación Orientada a Objetos",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Principios de encapsulación, herencia y polimorfismo en Java/C++. Diseño de clases."
  },
  {
    "MATERIA": "Taller de Programación Orientada a Objetos",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 2,
    "DESCRIPCION": "Proyectos prácticos aplicando OOP: desarrollo de aplicaciones y patrones de diseño."
  },
  {
    "MATERIA": "Programación de Sistemas Adaptativos y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Sistemas autónomos con machine learning. Laboratorios en ajuste dinámico de parámetros."
  },
  {
    "MATERIA": "Seguridad de la Información y Criptografía",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Algoritmos de cifrado (AES, RSA), PKI y protocolos seguros (SSL/TLS)."
  },
  {
    "MATERIA": "Visión Computacional y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Procesamiento de imágenes, detección de objetos y prácticas con OpenCV/Python."
  },
  {
    "MATERIA": "Programación Básica",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Introducción a lógica y sintaxis en lenguajes como Python/C++. Resolución de problemas simples."
  },
  {
    "MATERIA": "Programación Avanzada",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Desarrollo de software para aplicaciones biomédicas: algoritmos, bases de datos y APIs."
  },
  {
    "MATERIA": "Inteligencia Artificial",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Aplicaciones de IA en diagnóstico médico, análisis de imágenes y predicción de enfermedades."
  },
  {
    "MATERIA": "Programación de Estructura de Datos",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Implementación de estructuras (árboles, grafos) en código, optimización de algoritmos y manejo de memoria."
  },
  {
    "MATERIA": "Base de Datos y Lenguajes",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Diseño de bases relacionales, consultas SQL y uso de lenguajes como PL/SQL para gestión de datos."
  },
  {
    "MATERIA": "Administración de Bases de Datos",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Optimización, seguridad y replicación de bases de datos. Uso de herramientas como Oracle o MySQL."
  },
  {
    "MATERIA": "Redes Computacionales y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Diseño de redes LAN/WAN, protocolos TCP/IP y prácticas en configuración de routers/switches."
  },
  {
    "MATERIA": "Seguridad de la Información",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 2,
    "DESCRIPCION": "Protección de datos: cifrado, firewalls y políticas de seguridad acordes a normativas (ISO 27001)."
  },
  {
    "MATERIA": "Programación con Matlab",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Desarrollo de algoritmos para análisis numérico, simulación y visualización de datos en entornos técnicos."
  },
  {
    "MATERIA": "Inteligencia Artificial y Redes Neuronales",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Aplicación de algoritmos de IA (aprendizaje supervisado) y redes neuronales en sistemas mecatrónicos."
  },
  {
    "MATERIA": "Arquitectura de Robots y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño mecánico y electrónico de robots: cinemática, actuadores y sistemas de navegación autónoma."
  },
  {
    "MATERIA": "Transmisión y Comunicación de Datos y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Protocolos TCP/IP, redes LAN/WAN. Laboratorios con configuración de routers y análisis de tráfico."
  },
  {
    "MATERIA": "Tópicos Selectos de la Ingeniería de Software",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Agile, DevOps y patrones de diseño. Casos de estudio en proyectos escalables."
  },
  {
    "MATERIA": "Sistemas Operativos",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Gestión de procesos, memoria y archivos. Programación de kernels y sincronización."
  },
  {
    "MATERIA": "Interacción Humano-Computadora y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Diseño de interfaces UX/UI, pruebas de usabilidad y prototipado en herramientas como Figma."
  },
  {
    "MATERIA": "Temas Selectos de Software y Calidad",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 2,
    "DESCRIPCION": "Estándares ISO, métricas de calidad y pruebas de software (unitarias, de integración)."
  },
  {
    "MATERIA": "Ingeniería de Dispositivos Móviles y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Desarrollo de apps móviles nativas/híbridas. Laboratorios con Android Studio/Xcode."
  },
  {
    "MATERIA": "Sistemas Distribuidos y Paralelos y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Arquitecturas cliente-servidor, computación en cluster y prácticas con MPI/Spark."
  },
  {
    "MATERIA": "Redes Neuronales Artificiales",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 2,
    "DESCRIPCION": "Arquitecturas (CNN, RNN), entrenamiento con TensorFlow/PyTorch y laboratorios de modelos."
  },
  {
    "MATERIA": "Verificación y Validación de Software",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Técnicas de testing (caja negra/blanca) y herramientas como Selenium/JUnit."
  },
  {
    "MATERIA": "Temas Selectos de TI y Software I",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Tendencias en cloud computing, blockchain y ciberseguridad. Implementaciones prácticas."
  },
  {
    "MATERIA": "Sistemas Autómatas y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Teoría de autómatas finitos, máquinas de Turing y prácticas con lenguajes formales."
  },
  {
    "MATERIA": "Procesos y Métodos de Ingeniería de Software",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 2,
    "DESCRIPCION": "Ciclo de vida del software (SDLC), modelos en cascada, iterativos y ágiles."
  },
  {
    "MATERIA": "Temas Selectos de TI y Software II",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Big Data, IoT y herramientas avanzadas (Hadoop, Kubernetes). Casos de uso industrial."
  },
  {
    "MATERIA": "Calidad en el Software",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Estándares de calidad (CMMI, TMMi), pruebas de software y métricas para garantizar fiabilidad y rendimiento."
  },
  {
    "MATERIA": "Diseño y Especificación de Software",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Documentación técnica (UML), patrones de diseño y especificación de requisitos funcionales."
  },
  {
    "MATERIA": "Tecnologías Emergentes",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Exploración de IoT, inteligencia artificial y realidad aumentada aplicadas a soluciones innovadoras."
  },
  {
    "MATERIA": "Interfases Gráficas",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Desarrollo de GUIs (Graphical User Interfaces) usando herramientas como Python/Tkinter o LabVIEW."
  },
  {
    "MATERIA": "Reconocimiento de Patrones y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Algoritmos de clasificación (SVM, redes neuronales) para identificación de señales biomédicas o industriales."
  },
  {
    "MATERIA": "Tópicos Selectos de BD",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Enfoque en bases de datos especializadas (NoSQL, tiempo real) para sistemas IoT o aplicaciones médicas."
  },
  {
    "MATERIA": "Diseño de Experimentos",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Métodos estadísticos para planificación experimental, ANOVA y validación de hipótesis."
  },
  {
    "MATERIA": "Temas Selectos de Optimización",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Algoritmos genéticos, enjambre de partículas y optimización multiobjetivo."
  },
  {
    "MATERIA": "Cómputo Integrado y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Integración de hardware/software en sistemas embebidos. Prácticas con Raspberry Pi/Arduino."
  },
  {
    "MATERIA": "Temas Selectos de IA",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 2,
    "DESCRIPCION": "Aplicaciones de IA: chatbots, sistemas expertos y consideraciones éticas en algoritmos."
  },
  {
    "MATERIA": "Temas Selectos de Sistemas Inteligentes y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Aplicaciones de IA en robótica, visión computacional y laboratorios con datasets reales."
  },
  {
    "MATERIA": "Teoría de la Información y Métodos de Codificación",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 3,
    "DESCRIPCION": "Entropía, compresión de datos (Huffman, LZW) y corrección de errores (CRC, Hamming)."
  },
  {
    "MATERIA": "Redes de Telecomunicaciones y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9f",
    "CREDITOS": 4,
    "DESCRIPCION": "Diseño de redes 5G, fibra óptica y prácticas con protocolos VoIP y configuración de switches."
  },
  {
    "MATERIA": "Plantas generadoras de vapor y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ef",
    "CREDITOS": 3,
    "DESCRIPCION": "Operación de calderas, ciclos termodinámicos y eficiencia. Prácticas en medición de presión, temperatura y flujo."
  },
  {
    "MATERIA": "Refrigeración y psicometría y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ef",
    "CREDITOS": 3,
    "DESCRIPCION": "Sistemas de refrigeración, propiedades del aire húmedo y diagramas psicrométricos. Prácticas en ciclos de enfriamiento."
  },
  {
    "MATERIA": "Sistemas HVAC",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ef",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño de sistemas de climatización: cargas térmicas, ventilación y equipos. Normativas ASHRAE y eficiencia."
  },
  {
    "MATERIA": "Ahorro de energía eléctrica",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ef",
    "CREDITOS": 3,
    "DESCRIPCION": "Estrategias para optimizar consumo energético: auditorías, tecnologías eficientes y normativas internacionales."
  },
  {
    "MATERIA": "Competencia Comunicativa",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Actualmente exigen ingenieros capaces no sólo de solucionar problemas “de ingeniería y/o pensar numéricamente”, sino, capaces de comunicar sus necesidades, las de la empresa, y las de la sociedad de manera efectiva, con diferentes sectores de la población y de la empresa, que debido a la globalización pueden pertenecer a diferentes culturas."
  },
  {
    "MATERIA": "Apreciación a las Artes",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "La Formación Integral de los estudiantes de Licenciatura es fundamentalmente, ampliar la cultura de los jóvenes estudiantes, estrechando el vínculo de la formación científica y técnica con las ciencias sociales y las humanidades y un conocimiento amplio y consciente de las actitudes y valores universitarios formándolo."
  },
  {
    "MATERIA": "Cultura de paz",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Enfoque en resolución pacífica de conflictos, derechos humanos y construcción de entornos colaborativos."
  },
  {
    "MATERIA": "Cultura inglesa",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Estudio de tradiciones, historia y valores socioculturales del Reino Unido y su influencia global."
  },
  {
    "MATERIA": "Cultura alemana",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Exploración de costumbres, arte y estructura social de Alemania en contextos históricos y modernos."
  },
  {
    "MATERIA": "Cultura regional",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Identidad y manifestaciones culturales de regiones específicas: arte, gastronomía y tradiciones locales."
  },
  {
    "MATERIA": "Culturas indígenas mexicanas",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Legado, cosmovisión y desafíos contemporáneos de los pueblos originarios de México."
  },
  {
    "MATERIA": "Derechos humanos",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Fundamentos éticos y legales de los derechos universales, con enfoque en equidad y justicia social."
  },
  {
    "MATERIA": "Cultura de calidad",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Promoción de valores organizacionales centrados en excelencia, mejora continua y satisfacción del cliente."
  },
  {
    "MATERIA": "Equidad de género",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Políticas y prácticas para eliminar desigualdades de género en ámbitos laborales, educativos y sociales."
  },
  {
    "MATERIA": "Psicología y desarrollo profesional",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Aplicación de teorías psicológicas en gestión de equipos, motivación y crecimiento laboral."
  },
  {
    "MATERIA": "Ambiente y Sustentabilidad",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Principios de sostenibilidad, impacto ambiental de proyectos y regulaciones para soluciones ecoeficientes en ingeniería."
  },
  {
    "MATERIA": "Contexto Social de la Profesión",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Rol del ingeniero en la sociedad: ética profesional, responsabilidad social y vinculación con problemáticas globales."
  },
  {
    "MATERIA": "Ética, Sociedad y Profesión",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Reflexión sobre dilemas éticos, responsabilidad social y rol profesional en el desarrollo tecnológico."
  },
  {
    "MATERIA": "Metodología de la Investigación",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 3,
    "DESCRIPCION": "Técnicas para diseño experimental, redacción científica y análisis de datos en proyectos técnicos."
  },
  {
    "MATERIA": "Responsabilidad Social y Desarrollo Sustentable",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Impacto social y ambiental de proyectos técnicos. Estrategias para sostenibilidad."
  },
  {
    "MATERIA": "Bioética",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 3,
    "DESCRIPCION": "Debates éticos en investigación biomédica: consentimiento informado, privacidad y uso de datos."
  },
  {
    "MATERIA": "Derecho Informático",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 4,
    "DESCRIPCION": "Legislación en protección de datos, propiedad intelectual y responsabilidades legales en TI."
  },
  {
    "MATERIA": "Normatividad ",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 3,
    "DESCRIPCION": "Estándares técnicos (ISO, ASTM) y regulaciones aplicadas a procesos industriales y de calidad."
  },
  {
    "MATERIA": "Antropología social",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Análisis de estructuras comunitarias, rituales y dinámicas culturales en sociedades humanas."
  },
  {
    "MATERIA": "Métodos alternos de solución de controversias",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Técnicas de mediación, arbitraje y negociación para resolver conflictos sin litigio judicial."
  },
  {
    "MATERIA": "Autocuidado y estilos de vida saludable",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Estrategias para equilibrio físico-emocional: nutrición, manejo de estrés y actividad física."
  },
  {
    "MATERIA": "Desarrollo humano y competitividad profesional",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Habilidades blandas: comunicación, trabajo en equipo y adaptabilidad para destacar en entornos laborales."
  },
  {
    "MATERIA": "Educación fisica",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Prácticas deportivas y hábitos para mantener salud física, coordinación y bienestar integral."
  },
  {
    "MATERIA": "Estrategias de aprendizaje autónomo de lenguas",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Técnicas y herramientas digitales para dominio de idiomas mediante autoestudio y práctica constante."
  },
  {
    "MATERIA": "Metodología cientifica",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Enfoque sistemático para investigación: formulación de hipótesis, recolección de datos y análisis crítico."
  },
  {
    "MATERIA": "Propiedad intelectual y sus aplicaciones",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Protección legal de patentes, marcas y derechos de autor en contextos empresariales e innovación."
  },
  {
    "MATERIA": "Pensamiento creativo",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ed",
    "CREDITOS": 2,
    "DESCRIPCION": "Técnicas para generar ideas innovadoras: brainstorming, design thinking y solución de problemas disruptivos."
  },
  {
    "MATERIA": "Introducción a la Ciencia Aeroespacial",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca2",
    "CREDITOS": 3,
    "DESCRIPCION": "Fundamentos de aeronáutica y astronáutica: historia, principios de vuelo y sistemas aeroespaciales básicos."
  },
  {
    "MATERIA": "Aleaciones Aeroespaciales",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca2",
    "CREDITOS": 2,
    "DESCRIPCION": "Estudio de metales ligeros y aleaciones resistentes a altas temperaturas para aplicaciones en fuselajes y motores."
  },
  {
    "MATERIA": "Flujo Compresible y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca2",
    "CREDITOS": 3,
    "DESCRIPCION": "Dinámica de gases a alta velocidad (ondas de choque, toberas). Laboratorios con túneles de viento y simulación CFD."
  },
  {
    "MATERIA": "Aerodinámica I y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca2",
    "CREDITOS": 3,
    "DESCRIPCION": "Principios de flujo alrededor de perfiles alares y cuerpos. Prácticas en medición de fuerzas aerodinámicas."
  },
  {
    "MATERIA": "Mecánica de Estructuras Aeroespaciales y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca2",
    "CREDITOS": 3,
    "DESCRIPCION": "Análisis de esfuerzos en fuselajes y alas. Laboratorios con ensayos de resistencia y fatiga en materiales."
  },
  {
    "MATERIA": "Sistemas Electrónicos de Aeronaves y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca2",
    "CREDITOS": 3,
    "DESCRIPCION": "Aviónica: navegación, comunicaciones y sistemas de control. Prácticas con simuladores de cabina."
  },
  {
    "MATERIA": "Sistemas de Propulción y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca2",
    "CREDITOS": 3,
    "DESCRIPCION": "Motores de turbina, cohetes y propulsores. Laboratorios de rendimiento y eficiencia termodinámica."
  },
  {
    "MATERIA": "Aeroelasticidad y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca2",
    "CREDITOS": 3,
    "DESCRIPCION": "Interacción entre fuerzas aerodinámicas y deformaciones estructurales. Simulación de fenómenos como flutter."
  },
  {
    "MATERIA": "Dinámica de Vuelo y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca2",
    "CREDITOS": 3,
    "DESCRIPCION": "Modelado matemático de trayectorias, estabilidad y control de aeronaves. Simuladores de vuelo."
  },
  {
    "MATERIA": "Diseño de Estructuras Aeroespaciales",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca2",
    "CREDITOS": 3,
    "DESCRIPCION": "Optimización de estructuras ligeras usando FEM y criterios de resistencia/fatiga para cargas extremas."
  },
  {
    "MATERIA": "Introducción a la Ingeniería Biomédica",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 4,
    "DESCRIPCION": "Bases de dispositivos médicos, biomecánica y aplicaciones de ingeniería en salud."
  },
  {
    "MATERIA": "Biomateriales I y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 4,
    "DESCRIPCION": "Materiales biocompatibles (polímeros, cerámicos). Ensayos de degradación y respuesta celular."
  },
  {
    "MATERIA": "Fisiología",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 4,
    "DESCRIPCION": "Funcionamiento de sistemas corporales (cardiaco, nervioso) y su relación con tecnología médica."
  },
  {
    "MATERIA": "Señales Biomédicas",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Adquisición y procesamiento de ECG, EEG y EMG. Filtrado y análisis espectral."
  },
  {
    "MATERIA": "Métodos numéricos para Ingeniería Biomédica",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Algoritmos para simulación de sistemas fisiológicos y procesamiento de datos médicos."
  },
  {
    "MATERIA": "Instrumentación Biomédica y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 4,
    "DESCRIPCION": "Diseño de equipos médicos (monitores, ventiladores). Prácticas con sensores y calibración."
  },
  {
    "MATERIA": "Procesamiento Digital de Señales y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 4,
    "DESCRIPCION": "Técnicas de filtrado, transformada wavelet y aplicaciones en señales biomédicas."
  },
  {
    "MATERIA": "Procesamiento Digital de Imágenes y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 4,
    "DESCRIPCION": "Algoritmos para mejora, segmentación y análisis de imágenes médicas usando MATLAB/Python."
  },
  {
    "MATERIA": "Telemedicina",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Tecnologías para atención médica remota: plataformas, monitoreo y transmisión segura de datos."
  },
  {
    "MATERIA": "Fisiología y Anatomía para Ingenieros y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Fundamentos de sistemas corporales y su relación con dispositivos médicos. Prácticas con modelos anatómicos."
  },
  {
    "MATERIA": "Prótesis y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño y fabricación de prótesis biomecánicas: ergonomía, materiales biocompatibles y control mioeléctrico."
  },
  {
    "MATERIA": "Caracterización de Materiales y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 4,
    "DESCRIPCION": "Técnicas microscópicas/espectroscópicas para análisis de propiedades físicas y químicas."
  },
  {
    "MATERIA": "Bioestadística",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Análisis estadístico de datos médicos: pruebas de hipótesis, regresión y estudios clínicos."
  },
  {
    "MATERIA": "Metrología Clínica",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Calibración y mantenimiento de instrumentos médicos. Normativas de precisión y seguridad."
  },
  {
    "MATERIA": "Biodiseño e Innovación en Tecnología Médica I",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 4,
    "DESCRIPCION": "Metodologías para diseño de dispositivos médicos: identificación de necesidades y prototipado."
  },
  {
    "MATERIA": "Modalidades de Imagen Médica",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Principios de rayos X, ultrasonido, MRI y tomografía. Interpretación de imágenes clínicas."
  },
  {
    "MATERIA": "Regulación de Dispositivos Médicos",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Normativas FDA/CE, procesos de certificación y control de calidad en tecnología médica."
  },
  {
    "MATERIA": "Procesos de Tecnología Médica",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Ciclo de vida de dispositivos médicos: diseño, manufactura, validación clínica y comercialización."
  },
  {
    "MATERIA": "Biomecánica y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Análisis mecánico de sistemas biológicos: movimiento humano, prótesis y modelos de tejidos blandos."
  },
  {
    "MATERIA": "Ingeniería Médica y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Desarrollo de dispositivos médicos: desde diseño regulatorio hasta pruebas de biocompatibilidad."
  },
  {
    "MATERIA": "Crecimiento Biológico y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Modelado matemático de procesos biológicos (tejidos, células) y su aplicación en ingeniería médica."
  },
  {
    "MATERIA": "Diseño Geométrico Biológico y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Modelado 3D de estructuras anatómicas para prótesis personalizadas o implantes médicos."
  },
  {
    "MATERIA": "Dinámica de Cuerpos Vivos y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Simulación de movimientos humanos o animales mediante modelos multibody y sensores inerciales (IMU)."
  },
  {
    "MATERIA": "Mioelectricidad y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 3,
    "DESCRIPCION": "Adquisición y análisis de señales electromiográficas (EMG) para control de prótesis o interfaces neurales."
  },
  {
    "MATERIA": "Bioquímica y biología molecular",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 4,
    "DESCRIPCION": "Fundamentos de biomoléculas, ADN y procesos celulares para aplicaciones en ingeniería biomédica."
  },
  {
    "MATERIA": "Anatomía Humana",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca0",
    "CREDITOS": 6,
    "DESCRIPCION": "Estructura y función de sistemas corporales, con enfoque en aplicaciones de dispositivos médicos."
  },
  {
    "MATERIA": "Circuitos Eléctricos I y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 4,
    "DESCRIPCION": "Esta unidad de aprendizaje permite que el estudiante aplique para la solución de problemas la forma en que se comportan los elementos eléctricos activos, pasivos, lineales y bilaterales que son alimentados con corriente directa y excitación transitoria para la transformación de energía eléctrica en otros tipos de energía."
  },
  {
    "MATERIA": "Circuitos Eléctricos II y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 4,
    "DESCRIPCION": "Esta unidad de aprendizaje permite que el estudiante aplique las técnicas de análisis de circuitos eléctricos de corriente alterna de acuerdo a las leyes fundamentales de la electricidad, desarrollara y comprenderá soluciones a problemas de potencia eléctrica referente a los circuitos eléctricos monofásicos y trifásicos."
  },
  {
    "MATERIA": "Máquinas Eléctricas I y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Estudio de principios y aplicaciones de máquinas eléctricas (transformadores, motores, generadores), con laboratorios prácticos en mediciones, ensamblaje y análisis de sistemas energéticos."
  },
  {
    "MATERIA": "Máquinas Eléctricas II y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 4,
    "DESCRIPCION": "Estudio avanzado de máquinas eléctricas (motores trifásicos, generadores sincrónicos), con laboratorios de simulación y pruebas de eficiencia."
  },
  {
    "MATERIA": "Máquinas Eléctricas III y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 4,
    "DESCRIPCION": "Aplicaciones especializadas (motores de alta eficiencia, generadores renovables) con laboratorios de diagnóstico y control."
  },
  {
    "MATERIA": "Subestaciones Eléctricas y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño y operación de subestaciones (transformadores, interruptores). Laboratorios con simulación de fallas y protecciones."
  },
  {
    "MATERIA": "Sistemas de Generación Eléctrica y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Tecnologías de generación (térmica, hidroeléctrica, renovable). Laboratorios con simulación de operación de plantas."
  },
  {
    "MATERIA": "Líneas de Transmisión y Distribución y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño de redes eléctricas: cálculo de pérdidas, soportes y aislamiento. Simulación de flujos de potencia en laboratorio."
  },
  {
    "MATERIA": "Máquinas Eléctricas y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Funcionamiento y control de motores, generadores y transformadores. Prácticas de medición y eficiencia."
  },
  {
    "MATERIA": "Control Moderno y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 4,
    "DESCRIPCION": "Teoría de control avanzado (LQR, robusto) y prácticas con sistemas en tiempo real usando MATLAB/Simulink."
  },
  {
    "MATERIA": "Sistemas de Control Electrónico y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño de controladores PID y sistemas en lazo cerrado para regulación de variables físicas."
  },
  {
    "MATERIA": "Alumbrado e Instalaciones Eléctricas y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño de instalaciones eléctricas residenciales e industriales, normativas y eficiencia energética. Prácticas en cableado y mediciones."
  },
  {
    "MATERIA": "Diseño de transformadores",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Cálculo de núcleos, devanados y pérdidas en transformadores. Simulación de parámetros eléctricos y térmicos."
  },
  {
    "MATERIA": "Sistemas de Protección Eléctrica y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Coordinación de relés, interruptores y esquemas de protección. Prácticas en configuración y respuesta a fallas."
  },
  {
    "MATERIA": "Mantenimiento de subestaciones",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Protocolos para inspección, pruebas y reparación en subestaciones. Seguridad y gestión de activos eléctricos."
  },
  {
    "MATERIA": "Ingeniería electrónica y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño de sistemas embebidos, microcontroladores y comunicación digital. Laboratorios con prototipado de circuitos."
  },
  {
    "MATERIA": "Circuitos Análogos y Digitales y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 4,
    "DESCRIPCION": "Diseño de amplificadores, filtros y circuitos lógicos. Simulación en Multisim/Proteus."
  },
  {
    "MATERIA": "Electrónica I y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 4,
    "DESCRIPCION": "Circuitos básicos, amplificadores operacionales. Prácticas con montajes y mediciones."
  },
  {
    "MATERIA": "Electrónica Digital y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 4,
    "DESCRIPCION": "Diseño de circuitos lógicos, microcontroladores básicos. Laboratorios con FPGA/Arduino."
  },
  {
    "MATERIA": "Electrónica II y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 4,
    "DESCRIPCION": "Circuitos avanzados: fuentes de alimentación, conversores A/D. Proyectos integradores."
  },
  {
    "MATERIA": "Ingeniería Eléctrica y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Circuitos eléctricos, motores y sistemas de potencia. Prácticas con medición de parámetros."
  },
  {
    "MATERIA": "Técnicas de Diseño Electrónica",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 3,
    "DESCRIPCION": "Metodologías para diseño de circuitos impresos (PCB), selección de componentes y simulación en software."
  },
  {
    "MATERIA": "Diseño de Sistemas Electrónicos de Potencia y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9e",
    "CREDITOS": 4,
    "DESCRIPCION": "Conversores DC/AC, control de motores y gestión térmica. Laboratorios con MOSFETs, IGBTs y drivers."
  },
  {
    "MATERIA": "Estudio del Trabajo",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje se divide en tres etapas de las cuales en la Primera parte, se encuentran los contenidos básicos: Productividad, estudio del trabajo y factor humano, Segunda parte, se establecen los conceptos que tienen que ver con el Estudio de métodos, Tercera parte, se proporcionan los conocimientos de Medición del trabajo."
  },
  {
    "MATERIA": "Ingeniería Industrial",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje se divide en tres etapas de las cuales en la primera parte se encuentran los contenidos básicos: productividad, estudio del trabajo y factor humano, en la segunda parte se establecen los conceptos que tienen que ver con predicciones y así como las bases para segur la metodología para pronosticar."
  },
  {
    "MATERIA": "Procesos de Manufactura y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Curso que enseña a diseñar, analizar e inspeccionar los procesos de producción"
  },
  {
    "MATERIA": "Lubricación industrial y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Selección de lubricantes, técnicas de aplicación y análisis de desgaste. Ensayos de viscosidad y tribología en laboratorio."
  },
  {
    "MATERIA": "Electrónica Industrial y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Circuitos de potencia, control de motores y variadores. Prácticas con dispositivos electrónicos y mediciones."
  },
  {
    "MATERIA": "Optimización",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Técnicas matemáticas (programación lineal, simplex) para maximizar eficiencia en sistemas."
  },
  {
    "MATERIA": "Modelado y Simulación de Sistemas",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 2,
    "DESCRIPCION": "Herramientas (Arena, Simulink) para simular procesos industriales, logísticos o empresariales."
  },
  {
    "MATERIA": "Control Estadístico de la Calidad",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Herramientas SPC (gráficos de control, Six Sigma) para monitoreo y mejora de procesos."
  },
  {
    "MATERIA": "Hornos Industriales",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño y operación de hornos para fundición, tratamiento térmico y procesos cerámicos."
  },
  {
    "MATERIA": "Investigación de Operaciones",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Modelos de optimización (programación lineal, teoría de colas) para resolver problemas logísticos y productivos."
  },
  {
    "MATERIA": "Administración de la Producción I",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 4,
    "DESCRIPCION": "Planificación de procesos productivos: gestión de inventarios, capacidad y sistemas Lean Manufacturing."
  },
  {
    "MATERIA": "Administración de la Producción II",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Optimización de cadenas de suministro, logística y modelos Just-in-Time (JIT) para eficiencia operativa."
  },
  {
    "MATERIA": "Análisis de Sistemas de Producción",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Evaluación de eficiencia mediante KPIs, balanceo de líneas y simulación de procesos industriales."
  },
  {
    "MATERIA": "Evaluación y Administración de Proyectos",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "1. Metodologías para gestión de proyectos: planeación, presupuestos, riesgos y herramientas como CPM/PERT."
  },
  {
    "MATERIA": "Modelado y Simulación de Sistemas Dinámicos",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Herramientas (MATLAB, Simulink) para simular sistemas físicos, industriales o biológicos."
  },
  {
    "MATERIA": "Análisis de Sistemas",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 2,
    "DESCRIPCION": "Metodologías para identificar requisitos, modelar procesos y diseñar soluciones tecnológicas integradas."
  },
  {
    "MATERIA": "Admon. De Operaciones de Manufactura I",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Gestión de producción, planificación de capacidad y sistemas Lean Manufacturing."
  },
  {
    "MATERIA": "Calidad Aplicada a Manufactura",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Implementación de Six Sigma, DOE y herramientas Kaizen para reducción de defectos."
  },
  {
    "MATERIA": "Admon. De Operaciones de Manufactura II",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Gestión de cadena de suministro, logística y modelos de producción Just-in-Time (JIT)."
  },
  {
    "MATERIA": "Calidad Total para la Manufactura de clase Mundial",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Principios TQM, benchmarking y estrategias para excelencia operativa en manufactura."
  },
  {
    "MATERIA": "Sistemas de Aseguramiento de la Calidad",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Implementación de ISO 9001, auditorías internas y gestión de no conformidades."
  },
  {
    "MATERIA": "Administración de Mantenimiento",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Estrategias TPM, RCM y gestión de repuestos para maximizar disponibilidad de equipos."
  },
  {
    "MATERIA": "Metodologías Aplicadas en los Procesos de Manufactura",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Lean, Agile y teoría de restricciones (TOC) para optimización de procesos productivos."
  },
  {
    "MATERIA": "Proyecto de Implementación de Sistema de Calidad",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño e implantación de un sistema de gestión de calidad acorde a normativas internacionales."
  },
  {
    "MATERIA": "Administración de la Calidad Total",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 2,
    "DESCRIPCION": "Implementación de metodologías TQM, ISO y Six Sigma para mejora continua en procesos productivos."
  },
  {
    "MATERIA": "Mantenimiento insdustrial",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Estrategias de mantenimiento (correctivo, preventivo, predictivo). Análisis de confiabilidad y gestión de repuestos."
  },
  {
    "MATERIA": "Sistemas Dinámicos y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Modelado de vibraciones y respuesta dinámica en aeronaves. Simulación de perturbaciones y estabilidad."
  },
  {
    "MATERIA": "Técnicas de Medida y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Instrumentación para medición de presión, temperatura y flujo. Calibración y análisis de datos en laboratorio."
  },
  {
    "MATERIA": "Transductores y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 4,
    "DESCRIPCION": "Sensores y actuadores en aplicaciones médicas. Prácticas de conversión energía-señal."
  },
  {
    "MATERIA": "Microcontroladores y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 4,
    "DESCRIPCION": "Programación de sistemas embebidos para automatización de equipos biomédicos."
  },
  {
    "MATERIA": "Sistemas de Información",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 4,
    "DESCRIPCION": "Arquitecturas empresariales (ERP, CRM) y su rol en la integración de procesos organizacionales."
  },
  {
    "MATERIA": "Inter Redes I",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 4,
    "DESCRIPCION": "Configuración avanzada de redes: VLANs, enrutamiento dinámico (OSPF, BGP) y seguridad básica."
  },
  {
    "MATERIA": "Seminario de Sistemas I",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 4,
    "DESCRIPCION": "Análisis de casos de estudio en TI: tendencias, fracasos y buenas prácticas en proyectos reales."
  },
  {
    "MATERIA": "Inter Redes II",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 4,
    "DESCRIPCION": "Redes definidas por software (SDN), seguridad avanzada (IDS/IPS) y QoS en entornos empresariales."
  },
  {
    "MATERIA": "Seminario de Sistemas II",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 4,
    "DESCRIPCION": "Discusión de tecnologías disruptivas (blockchain, AI) y su impacto en modelos de negocio."
  },
  {
    "MATERIA": "Interfaces Computacionales",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 4,
    "DESCRIPCION": "Diseño de interfaces humano-máquina (HMI) y experiencia de usuario (UX) para sistemas técnicos."
  },
  {
    "MATERIA": "Metodología del Diseño",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Enfoque sistemático para diseño de productos: desde conceptualización hasta validación."
  },
  {
    "MATERIA": "Herramientas Básicas de Calidad en la Manufactura",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Diagramas de Ishikawa, Pareto y 5S para identificación y solución de problemas."
  },
  {
    "MATERIA": "Diseño de Mecanismos de Precisión y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081ca3",
    "CREDITOS": 3,
    "DESCRIPCION": "Síntesis de mecanismos (engranajes, levas) para aplicaciones de alta exactitud en robótica o medicina."
  },
  {
    "MATERIA": "Estática",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje se divide en tres fases, en la primera el estudiante podrá mediante la aplicación de las leyes de Newton del movimiento resolver problemas para determinar las fuerzas que actúan en una partícula en equilibrio, durante la segunda fase aplicará los conceptos de los momentos producidos por fuerzas y en la tercera fase resolverá problemas de cuerpos rígidos en equilibrio, en casos particulares en estructuras en un plano."
  },
  {
    "MATERIA": "Mecánica de Fluidos y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje se divide en 6 fases, en la primera fase se hace un análisis dimensional relacionado con los sistemas de unidades absoluto y técnico; en la segunda fase el estudiante podrá diferenciar las propiedades de los fluidos y establecer su relación para su aplicación en el estudio del comportamiento de los mismos. En la tercera fase se estudiarán los fluidos en condiciones estáticas realizando cálculos de presiones."
  },
  {
    "MATERIA": "Mecánica de Materiales y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje se divide en 4 fases, en la primera fase se verán los esfuerzos originados en un elemento cuando esta sometido a fuerzas axiales, en la segunda fase, las deformaciones que se producen en un elemento cuando se somete a carga axial, en la tercera fase se estudiará los esfuerzos y deformaciones y en la cuarta fase los esfuerzos de flexión en diferentes tipos vigas."
  },
  {
    "MATERIA": "Potencia Fluida y Lab",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Esta unidad de aprendizaje se divide en 6 fases, en la primera fase se hace una introducción general relacionado con los sistemas de unidades absoluto y técnico, en la segunda fase se estudiaran los principios tanto de potencia hidráulica como neumática, en la tercera fase se dará a conocer la simbología estandarizada de los elementos que forman un circuito."
  },
  {
    "MATERIA": "Dinámica y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 4,
    "DESCRIPCION": "Estudio de movimiento, fuerzas y sistemas mecánicos, integrando laboratorios con análisis de vibraciones, cinemática y dinámica de cuerpos rígidos mediante simulaciones y experimentos."
  },
  {
    "MATERIA": "Transferencia de Calor y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Fundamentos de conducción, convección y radiación térmica. Laboratorios enfocados en mediciones de flujo de calor, intercambiadores y aplicaciones en sistemas de enfriamiento/calefacción."
  },
  {
    "MATERIA": "Diseño de Elementos de Máquinas y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño de componentes mecánicos (engranes, ejes, rodamientos), validando resistencia y fatiga mediante software y ensayos en laboratorio."
  },
  {
    "MATERIA": "Vibraciones Mecánicas y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Análisis de vibraciones en sistemas mecánicos: amortiguación, resonancia y métodos de control. Prácticas con sensores y software especializado."
  },
  {
    "MATERIA": "Turbomaquinaria y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Principios de turbinas, bombas, compresores y ventiladores. Laboratorios prácticos en análisis de rendimiento, curvas características y eficiencia en aplicaciones energéticas y fluidodinámicas."
  },
  {
    "MATERIA": "Motores de Combustión Interna y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Estudio de ciclos termodinámicos, eficiencia y emisiones. Prácticas con ensamblaje y diagnóstico de motores."
  },
  {
    "MATERIA": "Servofluidos y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Sistemas hidráulicos y neumáticos: diseño, componentes y control. Prácticas en laboratorio con circuitos, válvulas y actuadores para automatización de maquinaria industrial."
  },
  {
    "MATERIA": "Análisis y síntesis de mecanismos y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Teoría de mecanismos (cinemática, trayectorias) y laboratorios con síntesis de sistemas articulados mediante herramientas CAD."
  },
  {
    "MATERIA": "Diseño de mecanismos y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Enfoque práctico en diseño de mecanismos (levas, engranajes) usando simulación computacional y prototipos en laboratorio."
  },
  {
    "MATERIA": "Diseño avanzado de elementos de máquinas y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Enfoque en fatiga, fractura y métodos computacionales (FEM) para diseño óptimo. Validación experimental en laboratorio."
  },
  {
    "MATERIA": "Análisis de vibración aplicado al mantenimiento",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Técnicas predictivas: medición de vibraciones, análisis espectral y diagnóstico de fallas en maquinaria."
  },
  {
    "MATERIA": "Selección de transmisiones",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Criterios para elegir sistemas de transmisión (cadena, correa, engranajes) según carga, velocidad y aplicación."
  },
  {
    "MATERIA": "Diseño mecánico moderno",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Aplicación de herramientas CAD/CAE, manufactura aditiva y optimización topológica en diseño de componentes."
  },
  {
    "MATERIA": "Dinámica Estructural y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Análisis de vibraciones y resonancia en estructuras aeroespaciales. Ensayos con acelerómetros y software FEM."
  },
  {
    "MATERIA": "Análisis de Elemento Finito",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Simulación computacional de esfuerzos y deformaciones en estructuras complejas usando herramientas como ANSYS."
  },
  {
    "MATERIA": "Mécanica de Materiales y Lab.",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Propiedades mecánicas de materiales, ensayos de tracción, torsión y fatiga en laboratorio."
  },
  {
    "MATERIA": "Diseño del Producto Básico",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Metodologías para diseño ergonómico, funcional y estético de productos industriales."
  },
  {
    "MATERIA": "CAE",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Simulación de esfuerzos, fluidos y térmica usando software de ingeniería asistida (ANSYS, SolidWorks)."
  },
  {
    "MATERIA": "Evaluación y Rediseño del Producto",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 3,
    "DESCRIPCION": "Análisis de ciclo de vida, mejora de diseños existentes y sostenibilidad en manufactura."
  },
  {
    "MATERIA": "Estadística Inferencial",
    "DEPARTAMENTO": "67e759804ae0525d4b081c9d",
    "CREDITOS": 4,
    "DESCRIPCION": "Análisis de datos, pruebas de hipótesis y modelos predictivos aplicados a toma de decisiones empresariales."
  },
  {
    "MATERIA": "Instrumentación Aérea y Lab.",
    "DEPARTAMENTO": "Ingenierpia Aeroespacial",
    "CREDITOS": 3,
    "DESCRIPCION": "Sensores y sistemas de medición en aeronaves: altímetros, giroscopios. Prácticas con dispositivos reales."
  },
  {
    "MATERIA": "Dibujo y Manufactura asistido por Computadora y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Desarrollara el estudiante la habilidad del manejo de software de CAD, donde obtendrá las bases para utilizar las herramientas necesarias para su desarrollo en el ámbito industrial."
  },
  {
    "MATERIA": "Maquinabilidad y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Estudio de procesos de mecanizado (fresado, torneado) y optimización de parámetros de corte."
  },
  {
    "MATERIA": "Diseño de Máquinas y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Cálculo de esfuerzos en componentes mecánicos (ejes, rodamientos) y prototipado en CAD."
  },
  {
    "MATERIA": "Manufactura Computacional I y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Uso de software CAM para generación de trayectorias de herramientas y simulación de procesos."
  },
  {
    "MATERIA": "Manufactura Computacional II y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Optimización avanzada de procesos CNC y simulación de manufactura aditiva (impresión 3D)."
  },
  {
    "MATERIA": "Manufactura Asistida por Computadora",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Programación de máquinas CNC, postprocesadores y control numérico en laboratorio."
  },
  {
    "MATERIA": "Sistemas de Inspección",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Tecnologías de inspección automatizada (visión artificial, CMM) para control de calidad."
  },
  {
    "MATERIA": "Tecnologías de Fabricación y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Los estudiantes analizan una tecnología de fabricación específica, aprenden a diseñar, analizar e inspeccionar las diferentes formas de producción."
  },
  {
    "MATERIA": "Máquinas de CNC y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Programación, operación y mantenimiento de máquinas CNC. Prácticas en fresado, torneado y control numérico."
  },
  {
    "MATERIA": "Dimensiones y Tolerancias Geométricas y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 4,
    "DESCRIPCION": "Normas GD&T, medición de precisión y verificación de piezas con CMM y perfilómetros."
  },
  {
    "MATERIA": "Metrología y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 4,
    "DESCRIPCION": "Técnicas de medición dimensional, calibración de instrumentos y trazabilidad metrológica."
  },
  {
    "MATERIA": "Taller de Ingeniería de la Fundición",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Prácticas en diseño de moldes, colada y control de defectos en procesos de fundición."
  },
  {
    "MATERIA": "Ingeniería de la Fundición",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Optimización de parámetros (temperatura, velocidad) para producción de piezas metálicas por fundición."
  },
  {
    "MATERIA": "Digitalizadores 3D y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Escaneo 3D de objetos y superficies usando láser o fotogrametría. Reconstrucción digital en software."
  },
  {
    "MATERIA": "Fabricación Digital y Lab.",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2ee",
    "CREDITOS": 3,
    "DESCRIPCION": "Técnicas avanzadas (impresión 3D, CNC) para diseño y producción automatizada. Prácticas con software CAD/CAM."
  },
  {
    "MATERIA": "Robótica y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Programación de robots industriales (ABB, Fanuc), cinemática y aplicaciones en automatización."
  },
  {
    "MATERIA": "Introducción a la Mecatrónica",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Integración de sistemas mecánicos, electrónicos y computacionales. Conceptos básicos de automatización."
  },
  {
    "MATERIA": "Sensores y Actuadores y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Tipos de sensores (temperatura, presión) y actuadores (eléctricos, neumáticos). Calibración e integración."
  },
  {
    "MATERIA": "Sistemas de Visión y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Procesamiento de imágenes para inspección automatizada: cámaras, algoritmos de OpenCV y Machine Learning."
  },
  {
    "MATERIA": "CAD/CAM y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño 3D (SolidWorks, AutoCAD) y generación de códigos CNC para fabricación asistida por computadora."
  },
  {
    "MATERIA": "Mecatrónica Computacional y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Simulación de sistemas mecatrónicos en entornos virtuales (ROS, Gazebo) y co-simulación hardware-software."
  },
  {
    "MATERIA": "Prototipos Rápidos y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Tecnologías de impresión 3D, corte láser y CNC para fabricación ágil de componentes funcionales."
  },
  {
    "MATERIA": "Automatización y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Integración de PLCs, robots y sistemas SCADA para optimización de procesos industriales."
  },
  {
    "MATERIA": "Ingeniería de Control y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño de sistemas automáticos y de control (PID, PLC), con simulación y experimentación en laboratorio para estabilidad, respuesta dinámica y aplicaciones industriales."
  },
  {
    "MATERIA": "Controladores y Microcontroladores y Programables y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 4,
    "DESCRIPCION": "Programación de PLCs y microcontroladores (PIC, ARM). Proyectos de automatización."
  },
  {
    "MATERIA": "Automatización y Control de Sistemas Dinámicos y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 4,
    "DESCRIPCION": "Control PID, sistemas en lazo cerrado y prácticas con robots/actuadores."
  },
  {
    "MATERIA": "Tópicos Selectos de Control",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Sistemas de control aplicados a prótesis o dispositivos médicos. Técnicas PID y adaptativas."
  },
  {
    "MATERIA": "Administración, Configuración e Instalación de Sistemas y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 4,
    "DESCRIPCION": "Despliegue de servidores, virtualización y mantenimiento de infraestructuras IT en laboratorio."
  },
  {
    "MATERIA": "Automatización de Sistemas y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Integración de PLCs, sensores y actuadores en líneas de producción automatizadas."
  },
  {
    "MATERIA": "Adquisición de Datos y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Configuración de sistemas DAQ, sensores y software (LabVIEW) para captura y procesamiento de señales."
  },
  {
    "MATERIA": "Interfaces I/O y Hombre-Máquina",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño de interfaces físicas (PLC, puertos) y pantallas táctiles para interacción usuario-máquina."
  },
  {
    "MATERIA": "Diseño de Sistemas Embebidos",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Programación de microcontroladores (ARM, PIC) para aplicaciones en tiempo real con restricciones de recursos."
  },
  {
    "MATERIA": "Instrumentación Virtual y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Creación de instrumentos virtuales (LabVIEW) para medición, control y automatización de procesos."
  },
  {
    "MATERIA": "Diseño de Sistemas Mecatrónicos y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 4,
    "DESCRIPCION": "Integración de componentes mecánicos, electrónicos y software en proyectos multidisciplinarios."
  },
  {
    "MATERIA": "Servomecanismos y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Control preciso de posición, velocidad y torque en sistemas automatizados usando motores y retroalimentación."
  },
  {
    "MATERIA": "Percepción y Lab.",
    "DEPARTAMENTO": "67e759ee4ae0525d4b081cb5",
    "CREDITOS": 3,
    "DESCRIPCION": "Técnicas de fusión sensorial (LiDAR, ultrasonido) para navegación autónoma y entornos inteligentes."
  },
  {
    "MATERIA": "Proyecto IME: Térmica",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 3,
    "DESCRIPCION": "Proyecto integrador en sistemas térmicos: diseño, simulación y validación de soluciones energéticas o industriales."
  },
  {
    "MATERIA": "Proyecto IME: Ingeniería Eléctrica",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 3,
    "DESCRIPCION": "Desarrollo de un sistema eléctrico integral, desde generación hasta distribución, con enfoque en innovación."
  },
  {
    "MATERIA": "Proyecto IME: Mecánica",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 3,
    "DESCRIPCION": "Proyecto práctico en análisis y diseño mecánico, aplicando principios de dinámica, materiales y manufactura."
  },
  {
    "MATERIA": "Proyecto IME: Diseño Mecánico",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 3,
    "DESCRIPCION": "Creación de un dispositivo mecánico funcional, integrando CAD, prototipado y pruebas de rendimiento."
  },
  {
    "MATERIA": "Administración de Proyectos de Software",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 2,
    "DESCRIPCION": "Metodologías (Scrum, Kanban), gestión de riesgos y uso de herramientas como Jira/Trello."
  },
  {
    "MATERIA": "Proyecto Integrador I",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 4,
    "DESCRIPCION": "Desarrollo de un sistema integral (software/hardware) aplicando conocimientos multidisciplinarios."
  },
  {
    "MATERIA": "Proyecto Integrador II",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 4,
    "DESCRIPCION": "Solución tecnológica compleja: desde diseño hasta implementación y documentación final."
  },
  {
    "MATERIA": "Proyecto IAE I",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 3,
    "DESCRIPCION": "Diseño conceptual de un sistema aeroespacial: requisitos, análisis preliminar y propuesta técnica."
  },
  {
    "MATERIA": "Proyecto IAE II",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 3,
    "DESCRIPCION": "Implementación y pruebas de un prototipo aeroespacial, integrando aerodinámica, estructuras y sistemas."
  },
  {
    "MATERIA": "Proyecto Integrador I A",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 4,
    "DESCRIPCION": "Desarrollo de un sistema funcional aplicando metodologías de análisis, diseño y programación."
  },
  {
    "MATERIA": "Proyecto Integrador I B",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 4,
    "DESCRIPCION": "Implementación y pruebas de un prototipo de software, integrando bases de datos y redes."
  },
  {
    "MATERIA": "Proyecto Integrador II A",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 4,
    "DESCRIPCION": "Solución tecnológica escalable, integrando IoT, cloud computing y sistemas empresariales."
  },
  {
    "MATERIA": "Proyecto Integrador II B",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 4,
    "DESCRIPCION": "Implementación y auditoría de un sistema complejo, con enfoque en seguridad y rendimiento."
  },
  {
    "MATERIA": "Proyecto IMF I",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 4,
    "DESCRIPCION": "Diseño de un sistema de manufactura, integrando procesos, calidad y automatización."
  },
  {
    "MATERIA": "Proyecto IMF II",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 4,
    "DESCRIPCION": "Desarrollo de un sistema de manufactura automatizado, desde prototipo hasta validación final."
  },
  {
    "MATERIA": "Proyecto IMT I",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 2,
    "DESCRIPCION": "Desarrollo de un material o proceso innovador, desde diseño teórico hasta prototipo funcional."
  },
  {
    "MATERIA": "Proyecto IMT II",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 2,
    "DESCRIPCION": "Implementación y validación industrial de soluciones en materiales, con enfoque en sostenibilidad."
  },
  {
    "MATERIA": "Proyecto de IMTC",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 3,
    "DESCRIPCION": "Desarrollo de un sistema mecatrónico completo: desde conceptualización hasta prototipo funcional."
  },
  {
    "MATERIA": "Proyecto IMA I",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 4,
    "DESCRIPCION": "Diseño de un plan integral de administración, integrando producción, finanzas y recursos humanos."
  },
  {
    "MATERIA": "Proyecto IMA II",
    "DEPARTAMENTO": "67e99461be4f5fad91aaf2f0",
    "CREDITOS": 3,
    "DESCRIPCION": "Implementación y evaluación de un sistema administrativo real, con enfoque en sostenibilidad y calidad."
  }
];

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB...');

    for (const [index, materia] of materias.entries()) {
      try {
        const normalized = normalizeName(materia.MATERIA);
        
        // Verificar existencia
        if (await Subject.findOne({ normalizedName: normalized })) {
          console.log(`[${index + 1}/${materias.length}] Saltando: ${materia.MATERIA}`);
          continue;
        }

        // Validar departamento
        const departamento = await Department.findOne({
          _id: materia.DEPARTAMENTO,
          faculty: FACULTY_ID
        });

        if (!departamento) {
          console.log(`[${index + 1}/${materias.length}] Departamento inválido: ${materia.MATERIA}`);
          continue;
        }

        // Crear materia
        await new Subject({
          name: materia.MATERIA,
          credits: materia.CREDITOS,
          description: materia.DESCRIPCION,
          department: departamento._id,
          faculty: FACULTY_ID,
          normalizedName: normalized,
          professors: []
        }).save();

        console.log(`[${index + 1}/${materias.length}] Creada: ${materia.MATERIA}`);

      } catch (error: any) {
        console.error(`Error en ${materia.MATERIA}:`, error.message);
      }
    }

    console.log('Proceso completado!');
    process.exit(0);

  } catch (error: any) {
    console.error('Error general:', error.message);
    process.exit(1);
  }
}

main();