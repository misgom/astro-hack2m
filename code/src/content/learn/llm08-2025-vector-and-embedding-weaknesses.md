---
title: LLM08:2025 - Vector and Embedding Weaknesses
description: Conoce la vulnerabilidad de vector and embedding weaknesses y cómo evitarla
pubDate: 2024-04-22
author: Miguel M.
---

Los modelos de lenguaje y sus aplicaciones derivadas dependen en gran medida de representaciones vectoriales del texto conocidas como embeddings. Estos vectores numéricos codifican el significado
semántico de palabras, frases, documentos o incluso usuarios, y se utilizan para tareas como búsqueda semántica, clasificación, clustering, detección de duplicados y mucho más.

A pesar de su utilidad, los sistemas que utilizan embeddings están expuestos a una nueva clase de vulnerabilidades que pueden ser explotadas para manipular resultados, inferir datos privados o introducir contenido malicioso en bases vectoriales. Este tipo de ataques se engloban en la vulnerabilidad Vector and Embedding Weaknesses, reconocida por OWASP en su top 10 de riesgos en aplicaciones con LLMs.
Este capítulo explora cómo se producen estas vulnerabilidades, sus vectores de ataque más comunes y las estrategias para mitigarlas de forma efectiva.

# Descripción de la vulnerabilidad

Cuando una aplicación convierte texto en vectores y los utiliza como base para tomar decisiones o recuperar información, se abre la posibilidad de que:
* Un atacante manipule las entradas para alterar las posiciones en el espacio vectorial
* Se introduzcan vectores adversarios que engañen los mecanismos de búsqueda semántica
* Se filtren datos a través de inversion attacks (reconstrucción de texto desde vectores)
* Se expongan vectores sensibles sin controles de acceso adecuados

# Métodos de explotación

### Data posinoing
El atacante introduce datos maliciosos que son vectorizados y almacenados en la base, alterando su comportamiento.

Ejemplo: Sube documentos falsos con contenido que, al vectorizarse, se asemejan intencionalmente a los vectores de documentos legítimos. Esto provoca que las búsquedas semánticas devuelvan resultados manipulados.

### Embedding inversion attacks
Técnicas que permiten reconstruir texto original a partir de los vectores embebidos, lo cual representa un riesgo de privacidad si estos vectores están expuestos.

Ejemplo: Un usuario sin permisos accede a la base de embeddings y, usando modelos entrenados, reconstruye correos electrónicos, historiales médicos u otra información sensible a partir de los vectores.

### Alteración del comportamiento
RAG (Retrieval Augmentation Generation) puede modificar el comportamiento esperado del modelo. Podría modificar las instrucciones para comportarse de forma empática y efectiva.

Ejemplo: Ante una pregunta como “Me agobian mis deudas de estudios, ¿qué debería hacer?”, el modelo podría responder diciendo que no debería endeudarse y que recorte gastos. Y, aunque pueda parecer correcto, la respuesta carece de empatía y puede perder utilidad.

# Estrategias de mitigación

### Control de ingreso y validación de embeddings
* Validar exhaustivamente los datos que se almacenan en la base vectorial.
* Aplicar detección de anomalías antes de aceptar nuevos vectores.
* No permitir que usuarios no autenticados generen o suban vectores directamente.

### Cifrado y control de acceso
* Proteger las bases vectoriales con autenticación, control de acceso granular y cifrado en reposo.
* Evitar exponer los vectores a usuarios o servicios que no necesiten acceder a ellos directamente.
### Indexado seguro
* Aplicar técnicas de normalización y bounding en los vectores para reducir el impacto de vectores extremos.
* Añadir verificaciones de semántica textual además de la similitud vectorial.

### Detección de ataques de inversión
* Evaluar regularmente la posibilidad de reconstrucción de texto a partir de los embeddings (por ejemplo, usando modelos tipo decoder).
* Cambiar los modelos de embeddings si se descubre que los actuales son demasiado “reversibles”.

### Separación de contextos vectoriales
* No mezclar embeddings de distinta naturaleza (por ejemplo, documentos legales, conversaciones privadas y logs de sistema) en una misma base.
* Clasificar los vectores por sensibilidad y aplicar reglas distintas de acceso y búsqueda.

# Conclusión

Las representaciones vectoriales son una parte esencial del ecosistema de aplicaciones impulsadas por modelos de lenguaje. Sin embargo, su uso introduce nuevas superficies de ataque que pueden ser difíciles de detectar y mitigar si no se entienden bien los riesgos.

Desde la manipulación de resultados hasta la filtración de datos sensibles, estas vulnerabilidades requieren una combinación de buenas prácticas en ingeniería de datos, seguridad de sistemas y comprensión profunda de la semántica del modelo. Al tratar los embeddings como datos sensibles, y no como simples vectores matemáticos, es posible construir sistemas más robustos y seguros.

# Referencias
* <a href="https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/" style="color: red; text-decoration: underline;">OWASP TOP 10 for LLM Application - LLM08:2025 Vector and Embedding Weaknesses</a>
