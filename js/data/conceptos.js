/* *******************************************************************
   Infografías transversales · /infografia [Concepto o Procedimiento]
   Cada entrada puede invocarse por cualquiera de sus palabras clave.
   ******************************************************************* */

export const conceptos = [
  /* ---------------------------------------------------------------- */
  {
    id: 'C-FASES-PAC',
    titulo: 'Fases del procedimiento administrativo común (Ley 39/2015)',
    claves: ['fases del procedimiento', 'procedimiento administrativo comun', 'procedimiento administrativo común', 'fases pac', 'iniciacion', 'iniciación', 'instruccion', 'instrucción', 'terminacion', 'terminación'],
    normativa: 'Ley 39/2015, Títulos II, III y IV (arts. 54 a 105)',
    mermaid: `graph TD
    A["INICIACIÓN"] --> A1["De oficio<br/>arts. 58-59 LPAC<br/>acuerdo del órgano"]
    A --> A2["A solicitud del interesado<br/>arts. 66-68 LPAC<br/>modelo de solicitud"]
    A2 --> S{"¿Falta algún<br/>requisito?"}
    S -->|Sí| S1["REQUERIMIENTO DE SUBSANACIÓN<br/>art. 68 LPAC<br/>10 días hábiles"]
    S1 --> S2{"¿Se subsana?"}
    S2 -->|No| S3["Desistimiento tácito<br/>se archiva la solicitud"]
    S2 -->|Sí| B
    S -->|No| B["ORDENACIÓN E INSTRUCCIÓN<br/>arts. 71-83 LPAC"]
    B --> B1["Expediente administrativo<br/>art. 70 LPAC · orden sucesivo"]
    B1 --> B2["Alegaciones<br/>art. 76 LPAC"]
    B2 --> B3["Prueba<br/>arts. 77-78 LPAC<br/>periodo no superior a 30 días"]
    B3 --> B4["Informes<br/>art. 79-80 LPAC<br/>facultativo u obligatorio"]
    B4 --> B5["TRÁMITE DE AUDIENCIA<br/>art. 82 LPAC<br/>10 a 15 días"]
    B5 --> C["TERMINACIÓN<br/>arts. 84-95 LPAC"]
    C --> C1["Resolución expresa<br/>art. 88 LPAC<br/>plazo máximo: 3 meses"]
    C --> C2["Prescripción · Caducidad"]
    C --> C3["Desistimiento · Renuncia"]
    C1 --> D["NOTIFICACIÓN<br/>arts. 40-46 LPAC<br/>10 días desde la resolución"]
    D --> E["EJECUCIÓN<br/>arts. 97-105 LPAC"]`,
    descripcion: `Diagrama de flujo vertical en cuatro franjas de color progresivo (azul iniciación, ámbar instrucción, verde terminación, gris ejecución) con los plazos legales destacados en etiquetas rojas: subsanación 10 días hábiles, prueba no superior a 30 días, audiencia 10-15 días, resolución en 3 meses si la norma no fija otro plazo y notificación en 10 días. Se incluye una rama lateral de desistimiento tácito por no subsanar.`,
    promptImagen: `Vertical flowchart infographic, flat vector style, dark navy background, title "FASES DEL PROCEDIMIENTO ADMINISTRATIVO COMÚN · Ley 39/2015". Four color bands: blue "INICIACIÓN", amber "ORDENACIÓN E INSTRUCCIÓN", green "TERMINACIÓN", grey "EJECUCIÓN". Numbered circular badges on each phase, with red deadline tags reading "10 días hábiles", "30 días", "10-15 días", "3 meses", "10 días". A lateral dashed branch labeled "Desistimiento tácito". Clean administrative design, Spanish labels, article numbers in small captions, 16:9.`,
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'C-GASTO-ADOKP',
    titulo: 'Ejecución del gasto público: fases A – D – OK – P',
    claves: ['ejecucion del gasto', 'ejecución del gasto', 'fases del gasto', 'a d ok p', 'a-d-ok-p', 'adokp', 'gasto publico', 'gasto público', 'ordenacion del pago', 'ordenación del pago', 'documentos contables'],
    normativa: 'Ley 47/2003, General Presupuestaria (arts. 73-75) · Instrucción de Contabilidad de la AGE',
    mermaid: `graph LR
    A["FASE A<br/>AUTORIZACIÓN<br/>Se autoriza el gasto<br/>Documento: RC / A<br/>Órgano gestor"] --> D["FASE D<br/>DISPOSICIÓN o COMPROMISO<br/>Se concierta el gasto<br/>Documento: AD / D<br/>Órgano gestor"]
    D --> O["FASE O<br/>RECONOCIMIENTO DE LA OBLIGACIÓN<br/>OK<br/>Se reconoce la deuda<br/>Documento: OK<br/>Órgano gestor"]
    O --> K["PROPUESTA DE PAGO<br/>K<br/>Reserva de fondos<br/>Documento: K<br/>Órgano gestor"]
    K --> P["FASE P<br/>PAGO MATERIAL<br/>Salida efectiva de fondos<br/>Documento: P<br/>Ordenador de pagos"]
    P --> T["Extinción de la obligación"]
    G["CONTROL INTERNO<br/>IGAE · función interventora"] --> A
    G --> D
    G --> O
    G --> P
    P --> X["CONTROL EXTERNO<br/>Tribunal de Cuentas<br/>art. 136 CE"]`,
    descripcion: `Cadena horizontal de cuatro etapas con forma de cinta continua (A, D, OK, P), cada una con su color y su documento contable (RC/AD/OK/K/P). Bajo la cadena, una barra transversal azul representa el control interno de la IGAE que fiscaliza cada fase, y al final una barra verde representa el control externo del Tribunal de Cuentas. Se destacan los órganos competentes: órgano gestor para A, D y O; ordenador de pagos para la fase P.`,
    promptImagen: `Horizontal ribbon infographic, flat vector, dark slate background, title "CICLO DEL GASTO PÚBLICO · A - D - OK - P". Four large chevron shapes in sequence: "A AUTORIZACIÓN (RC)", "D DISPOSICIÓN (AD)", "O RECONOCIMIENTO DE LA OBLIGACIÓN (OK)", "P PAGO MATERIAL (P)". Under the ribbon, a blue horizontal bar "CONTROL INTERNO · IGAE - función interventora" touching each phase, and a green bar at the end "CONTROL EXTERNO · TRIBUNAL DE CUENTAS (art. 136 CE)". Small document icons next to each phase labeled RC, AD, OK, K, P. Spanish labels, corporate public-finance aesthetic, 16:9.`,
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'C-RECURSOS',
    titulo: 'Recursos administrativos: alzada, reposición y extraordinario de revisión',
    claves: ['recursos administrativos', 'recurso de alzada', 'recurso de reposicion', 'recurso de reposición', 'recurso extraordinario de revision', 'recurso extraordinario de revisión', 'reclamaciones', 'recursos'],
    normativa: 'Ley 39/2015, Título V (arts. 112 a 126)',
    mermaid: `graph TD
    A["ACTO ADMINISTRATIVO"] --> B{"¿Pone fin a la vía<br/>administrativa?"}
    B -->|No| C["RECURSO DE ALZADA<br/>art. 121-122 LPAC<br/>CARÁCTER OBLIGATORIO"]
    C --> C1["Interposición: 1 mes<br/>si el acto es expreso"]
    C --> C2["Interposición: en cualquier momento<br/>si el acto es presunto"]
    C --> C3["Resolución: 3 meses<br/>silencio DESESTIMATORIO"]
    C3 --> Z{"¿Resuelve el superior<br/>jerárquico?"}
    Z -->|Acto firme| Y["FIN DE LA VÍA<br/>ADMINISTRATIVA"]

    B -->|Sí| D{"¿Es un acto<br/>definitivo o de trámite cualificado?"}
    D -->|Sí| E["RECURSO POTESTATIVO DE REPOSICIÓN<br/>arts. 123-124 LPAC<br/>CARÁCTER VOLUNTARIO"]
    E --> E1["Interposición: 1 mes<br/>desde la notificación"]
    E --> E2["Resolución: 1 mes<br/>silencio DESESTIMATORIO"]

    A --> F["RECURSO EXTRAORDINARIO DE REVISIÓN<br/>arts. 125-126 LPAC<br/>SOLO causas tasadas"]
    F --> F1["Error de hecho<br/>plazo: 4 años"]
    F --> F2["Otros motivos del art. 125.1<br/>plazo: 3 meses"]
    F1 --> G["NO es un recurso ordinario<br/>Solo contra actos FIRMES"]
    F2 --> G`,
    descripcion: `Diagrama de decisión en tres columnas: izquierda el recurso de alzada (rojo, obligatorio), centro el potestativo de reposición (azul, voluntario) y derecha el extraordinario de revisión (ámbar, solo caus as tasadas y contra actos firmes). Cada columna muestra dos cifras destacadas: el plazo de interposición y el plazo de resolución, con una etiqueta de advertencia sobre el silencio desestimatorio. Un aviso final recuerda la incompatibilidad de sustanciar reposición y alzada de forma simultánea.`,
    promptImagen: `Three-column decision infographic, flat vector, dark navy background, title "RECURSOS ADMINISTRATIVOS · Ley 39/2015". Left column red card "ALZADA - obligatorio" with badges "1 mes interposición", "3 meses resolución", "silencio desestimatorio". Center column blue card "REPOSICIÓN - potestativo" with badges "1 mes interposición", "1 mes resolución". Right column amber card "EXTRAORDINARIO DE REVISIÓN - causas tasadas" with badges "4 años error de hecho", "3 meses otras causas". A warning banner at the bottom: "No pueden simultanearse reposición y alzada". Clean legal infographic style, Spanish text, 16:9.`,
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'C-CONTRATACION',
    titulo: 'Procedimiento de adjudicación de un contrato del sector público',
    claves: ['contratacion', 'contratación', 'contratos del sector publico', 'contratos del sector público', 'adjudicacion', 'adjudicación', 'licitacion', 'licitación', 'recurso especial en materia de contratacion', 'recurso especial'],
    normativa: 'Ley 9/2017, de Contratos del Sector Público (LCSP)',
    mermaid: `graph TD
    A["NECESIDAD DEL CONTRATO"] --> B["EXPEDIENTE DE CONTRATACIÓN<br/>arts. 116-120 LCSP<br/>pliego de cláusulas · gasto"]
    B --> C["PLIEGOS<br/>Pliego de Cláusulas Administrativas<br/>Pliego de Prescripciones Técnicas"]
    C --> D["PUBLICACIÓN<br/>Perfil de contratante<br/>Plataforma de Contratación"]
    D --> E["PRESENTACIÓN DE OFERTAS<br/>plazo general: 15 días hábiles"]
    E --> F["APERTURA Y VALORACIÓN<br/>Mesa de contratación<br/>criterios: precio y juicios de valor"]
    F --> G["CLASIFICACIÓN DE OFERTAS<br/>propuesta de adjudicación"]
    G --> H["ADJUDICACIÓN<br/>arts. 150-158 LCSP<br/>notificación a los licitadores"]
    H --> I{"¿Se presenta RECURSO<br/>ESPECIAL en materia de contratación?"}
    I -->|Sí| I1["arts. 44-60 LCSP<br/>15 días hábiles<br/>Órgano: Tribunal Administrativo Central<br/>de Recursos Contractuales"]
    I1 --> J["SUSPENSIÓN del procedimiento<br/>acto impugnado"]
    I -->|No| K["FORMALIZACIÓN DEL CONTRATO<br/>documento administrativo<br/>plazo: 15 días hábiles"]
    J --> K
    K --> L["EJECUCIÓN Y CUMPLIMIENTO<br/>arts. 189-206 LCSP<br/>prerrogativas de la Administración"]
    L --> M["EXTINCIÓN<br/>cumplimiento o resolución"]`,
    descripcion: `Diagrama de proceso vertical con las etapas de la licitación, desde la necesidad hasta la extinción del contrato. Se colorea en rojo el hito del recurso especial en materia de contratación y la suspensión del procedimiento que provoca, y en verde la formalización. Un panel lateral resume los criterios de adjudicación, la garantía definitiva y el régimen de invalidez de los contratos.`,
    promptImagen: `Vertical procurement process infographic, flat vector, deep navy background, title "ADJUDICACIÓN DE UN CONTRATO DEL SECTOR PÚBLICO · Ley 9/2017". Sequential stages as stacked cards: "Necesidad", "Expediente", "Pliegos", "Publicación", "Ofertas - 15 días hábiles", "Mesa de contratación", "Propuesta de adjudicación", "Adjudicación". A red branch labeled "RECURSO ESPECIAL · 15 días hábiles · TACRC" leading to a "SUSPENSIÓN" badge. Green card "FORMALIZACIÓN · 15 días hábiles", then "Ejecución" and "Extinción". Side panel with criteria icons: price tag, quality badge, guarantee shield. Spanish labels, 16:9.`,
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'C-SILENCIO',
    titulo: 'El silencio administrativo: estimatorio y desestimatorio',
    claves: ['silencio administrativo', 'silencio', 'silencio positivo', 'silencio negativo', 'plazo maximo para resolver', 'plazo máximo para resolver'],
    normativa: 'Ley 39/2015, arts. 21, 24 y 25',
    mermaid: `graph TD
    A["PROCEDIMIENTO INICIADO"] --> B["Transcurso del PLAZO MÁXIMO<br/>PARA RESOLVER Y NOTIFICAR<br/>art. 21 LPAC"]
    B --> B1["Regla general: 3 meses<br/>si la norma no fija otro plazo"]
    B1 --> C{"¿Se ha notificado<br/>resolución expresa?"}
    C -->|Sí| C1["Resolución expresa<br/>La Administración está obligada a resolver"]
    C -->|No| D{"¿Qué tipo de<br/>procedimiento es?"}
    D -->|Regla general| E["SILENCIO ESTIMATORIO<br/>art. 24.1 LPAC<br/>se entiende ESTIMADA la solicitud"]
    D -->|Excepciones del art. 24.1| F["SILENCIO DESESTIMATORIO<br/>art. 24.1 y 25 LPAC"]
    F --> F1["Procedimientos de ejercicio<br/>de facultades sancionadoras"]
    F --> F2["Procedimientos que impliquen<br/>efectos desfavorables para el interesado"]
    F --> F3["Procedimientos de responsabilidad<br/>patrimonial"]
    E --> G["Resolución tardía expresa<br/>solo puede confirmar el silencio estimatorio"]
    F --> H["Resolución tardía expresa<br/>la Administración puede resolver<br/>sin vincularse al silencio"]`,
    descripcion: `Diagrama de decisión con el eje temporal del transcurso del plazo máximo para resolver y notificar. Dos ramas finales contrastadas por color: verde para el silencio estimatorio con la regla de la resolución tardía que solo puede confirmar; rojo para el silencio desestimatorio con la lista de excepciones tasadas del art. 24.1 LPAC. Línea de tiempo superior marcando los hitos de inicio, plazo y notificación.`,
    promptImagen: `Decision flowchart infographic, flat vector, dark navy background, title "EL SILENCIO ADMINISTRATIVO · Ley 39/2015". A horizontal timeline at the top marking "Inicio", "Plazo máximo para resolver y notificar - 3 meses", "Notificación". Below, a decision diamond splitting into a green card "SILENCIO ESTIMATORIO - regla general" and a red card "SILENCIO DESESTIMATORIO - excepciones" listing three bullet chips: "sancionadores", "efectos desfavorables", "responsabilidad patrimonial". Two footnote panels comparing the effects of a late express resolution. Spanish labels, 16:9.`,
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'C-REFORMA-CE',
    titulo: 'Procedimiento de reforma constitucional: ordinario y agravado',
    claves: ['reforma constitucional', 'revision constitucional', 'revisión constitucional', 'art. 167', 'art. 168', 'reforma de la constitucion', 'reforma de la constitución'],
    normativa: 'Constitución Española, arts. 166 a 169',
    mermaid: `graph TD
    A["INICIATIVA DE REFORMA<br/>art. 166 CE<br/>Gobierno · Congreso · Senado<br/>Asambleas de las CCAA"] --> B{"¿Qué se quiere reformar?"}
    B -->|"Título Preliminar<br/>Cap. II Sección 1ª del Título I<br/>o REVISIÓN TOTAL"| C["PROCEDIMIENTO AGRAVADO<br/>art. 168 CE"]
    B -->|"Cualquier otro precepto"| D["PROCEDIMIENTO ORDINARIO<br/>art. 167 CE"]

    D --> D1["Aprobación por 3/5<br/>de cada Cámara"]
    D1 --> D2{"¿No hay acuerdo<br/>entre las Cámaras?"}
    D2 -->|Sí| D3["Comisión mixta<br/>Congreso-Senado"]
    D3 --> D4["Nueva votación:<br/>2/3 Congreso · mayoría absoluta Senado"]
    D4 --> D5{"¿Se solicita<br/>REFERÉNDUM?"}
    D5 -->|1/10 de Diputados<br/>o Senadores| D6["REFERÉNDUM<br/>facultativo"]
    D5 -->|No| D7["Reforma aprobada<br/>SANCIÓN Y PROMULGACIÓN"]

    C --> C1["Aprobación por 2/3<br/>de cada Cámara"]
    C1 --> C2["DISOLUCIÓN<br/>de las Cortes Generales"]
    C2 --> C3["Las nuevas Cámaras<br/>ratifican por 2/3"]
    C3 --> C4["Nuevo texto aprobado por<br/>2/3 Congreso y 2/3 Senado"]
    C4 --> C5["REFERÉNDUM<br/>OBLIGATORIO"]`,
    descripcion: `Diagrama de dos columnas comparadas: a la izquierda el procedimiento ordinario del art. 167 CE, con las mayorías 3/5 y 2/3 y el referéndum facultativo; a la derecha el agravado del art. 168 CE, con la mayoría de 2/3, la disolución de las Cortes, la ratificación por las nuevas Cámaras y el referéndum obligatorio. Encabezado con el precepto afectado como criterio de elección de la vía.`,
    promptImagen: `Two-column comparison infographic, flat vector, dark navy background, title "REFORMA DE LA CONSTITUCIÓN ESPAÑOLA · arts. 166-169". Left column blue "PROCEDIMIENTO ORDINARIO art. 167" with steps "3/5 de cada Cámara", "Comisión mixta", "2/3 Congreso y mayoría absoluta Senado", "Referéndum facultativo". Right column red "PROCEDIMIENTO AGRAVADO art. 168" with steps "2/3 de cada Cámara", "Disolución de las Cortes", "Ratificación por 2/3", "2/3 y 2/3", "Referéndum obligatorio". Majority fractions shown as bold badges. Spanish labels, solemn constitutional aesthetic, 16:9.`,
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'C-RESP-PATRIMONIAL',
    titulo: 'Responsabilidad patrimonial de las Administraciones Públicas',
    claves: ['responsabilidad patrimonial', 'responsabilidad de la administracion', 'responsabilidad de la administración', 'indemnizacion', 'indemnización', 'lesion antijuridica', 'lesión antijurídica'],
    normativa: 'Ley 40/2015, arts. 32 a 37 · Ley 39/2015, arts. 65, 67, 81, 91 y 92',
    mermaid: `graph TD
    A["LESIÓN SUFRIDA POR UN PARTICULAR"] --> B{"¿Concurren los<br/>REQUISITOS del art. 32 LRJSP?"}
    B --> B1["Daño EFECTIVO y EVALUABLE económicamente"]
    B --> B2["Daño INDIVIDUALIZADO<br/>respecto a un grupo de personas"]
    B --> B3["NEXO CAUSAL<br/>relación de causa a efecto"]
    B --> B4["LESIÓN ANTIJURÍDICA<br/>no hay deber de soportarla"]
    B1 --> C
    B2 --> C
    B3 --> C
    B4 --> C{"¿Cumple todos<br/>los requisitos?"}
    C -->|No| D["NO procede indemnización"]
    C -->|Sí| E["RECLAMACIÓN<br/>art. 65 LPAC<br/>plazo: 1 año desde el hecho"]
    E --> E1["Si el daño es de carácter físico o psíquico<br/>1 año desde la curación o determinación<br/>del alcance del daño"]
    E --> F["INSTRUCCIÓN<br/>art. 81 LPAC"]
    F --> G["DICTAMEN<br/>Consejo de Estado u órgano consultivo<br/>cuando la indemnización supera el límite legal"]
    G --> H["RESOLUCIÓN<br/>art. 91 LPAC<br/>plazo: 6 meses"]
    H --> H1["SILENCIO<br/>DESESTIMATORIO"]
    H --> I["INDEMNIZACIÓN<br/>valoración conforme a la Ley de Expropiación Forzosa"]`,
    descripcion: `Diagrama de flujo con el bloque central de los cuatro requisitos de la responsabilidad patrimonial como tarjetas en paralelo (daño efectivo, individualizado, nexo causal, lesión antijurídica) que convergen en un nodo de decisión. La rama inferior muestra el cauce procedimental con los plazos clave: 1 año para reclamar (con la especialidad del daño físico o psíquico) y 6 meses para resolver, subrayando el silencio desestimatorio.`,
    promptImagen: `Flowchart infographic, flat vector, dark navy background, title "RESPONSABILIDAD PATRIMONIAL DE LAS ADMINISTRACIONES · arts. 32-37 LRJSP". Four parallel requirement cards with icons: "Daño efectivo y evaluable", "Daño individualizado", "Nexo causal", "Lesión antijurídica", converging into a decision diamond. Branch to a red card "NO procede indemnización" and a green branch "RECLAMACIÓN - 1 año" leading to "Instrucción", "Dictamen del Consejo de Estado", "Resolución - 6 meses", "Silencio desestimatorio", "Indemnización". Spanish labels, judicial aesthetic with scales of justice icon, 16:9.`,
  },
];
