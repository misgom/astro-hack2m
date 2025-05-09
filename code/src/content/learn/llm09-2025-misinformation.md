---
title: LLM09:2025 - Misinformation
description: Conoce cómo la desinformación puede afectar a los modelos LLM y cómo evitarlo
pubDate: 2024-04-22
author: Miguel M.
---

Una de las amenazas más sutiles pero peligrosas en el uso de modelos de lenguaje es la generación y difusión de desinformación. Esta vulnerabilidad no proviene necesariamente de un actor malicioso externo, sino que muchas veces es el propio modelo el que (sin intención) produce información falsa, imprecisa o engañosa.

En el contexto de aplicaciones que usan LLMs como fuente de conocimiento o soporte a la toma de decisiones, la confianza en la veracidad de las respuestas es crítica. Cuando un modelo genera respuestas erróneas, especulativas o inventadas (hallucinations), puede inducir a usuarios humanos o sistemas automáticos a cometer errores graves.

Este artículo aborda la vulnerabilidad de desinformación desde el punto de vista técnico, ético y de mitigación, analizando cómo se produce, cómo puede ser explotada y qué mecanismos existen para reducir su impacto.

# Descripción de la vulnerabilidad

Los modelos de lenguaje no "saben" si lo que dicen es verdadero o falso. Generan texto en función de patrones estadísticos aprendidos durante el entrenamiento, optimizando por plausibilidad, no por veracidad.

Esto conlleva los siguientes riesgos:
* Alucinaciones de hechos: El modelo inventa datos, cifras, nombres o eventos que suenan creíbles pero no existen.
* Errores de precisión: Confusiones entre conceptos parecidos, explicaciones erróneas o desactualizadas.
* Desinformación amplificada: Repetición y validación de contenidos falsos previamente introducidos por usuarios o presentes en los datos de entrenamiento.
* Contaminación de respuestas en cadena: Cuando una respuesta falsa es aceptada como base de una conversación, todo el razonamiento posterior también puede estar viciado.

En contextos críticos (como podrían ser salud, derecho, educación o finanzas), estas alucinaciones pueden tener consecuencias reales.

# Métodos de explotación

### Uso como vehículo de desinformación dirigida
Un atacante puede usar un modelo LLM para generar narrativas falsas de forma automatizada y coherente, adaptadas a públicos específicos, lo que facilita campañas de desinformación a gran escala.

Ejemplo: Usar el modelo para redactar noticias falsas con tono periodístico creíble sobre eventos políticos o crisis sanitarias.

### Prompt engineering para inducir alucinaciones
Mediante el diseño intencional de prompts ambiguos o contradictorios, se puede inducir al modelo a dar respuestas falsas, incluso si en otras condiciones evitaría hacerlo.

Ejemplo:

"Actúa como un experto que sabe una verdad que los medios no quieren que sepamos…"

Resultado: narrativa conspirativa generada por el modelo.

### Ataques a través del entrenamiento o fine-tunning
En sistemas con fine-tuning o RLHF (Reinforcement Learning with Human Feedback), un atacante puede insertar datos falsos que luego se convierten en "verdades" para el modelo.

Ejemplo: Manipulación del contenido en foros, wikis o redes sociales que alimentan sistemas de entrenamiento público.

### Generación de contenido falso de apoyo
El modelo no solo inventa hechos, sino también fuentes ficticias, enlaces rotos o citas inventadas que refuerzan la ilusión de veracidad.

Ejemplo:

“Según el artículo de Harvard de 2019 titulado The Mind’s AI…” (Ese artículo no existe, pero suena legítimo).

# Estrategias de mitigación

### Verificación de fuentes y verificación de hechos automático
* Integrar verificadores de hechos externos (fact-checkers) y APIs de búsqueda real en tiempo real.
* Marcar las respuestas que contienen información no verificada.

### Entrenamiento con datos de alta calidad y curación activa
* Usar set de datos curados y confiables para el pre-entrenamiento y el fine-tunning.
* Aplicar técnicas de data pruning y eliminación de datos contradictorios o erróneos.

### Uso de técnicas como Retrieval-Augmented Generation (RAG)
* Complementar el modelo con bases de conocimiento verificadas y actualizadas.
* El modelo genera respuestas basadas en documentos reales recuperados, no solo en su memoria interna.

### Transparencia y explicabilidad
* Mostrar referencias o fuentes para las afirmaciones generadas por el modelo.
* Implementar respuestas con niveles de certeza o advertencias cuando no haya seguridad.

### Clasificadores de alucinaciones y contenido falso
* Desarrollar modelos secundarios que analicen las respuestas del modelo principal y determinen si contienen información inventada.
* Filtrar o moderar contenidos de alto riesgo antes de mostrarlos al usuario final.

# Conclusión

La desinformación es una vulnerabilidad transversal que afecta a todos los niveles del desarrollo de aplicaciones con LLMs. No se trata solo de evitar errores técnicos, sino de prevenir la propagación de falsedades con impacto real sobre la sociedad y los individuos.

A medida que los modelos se vuelven más persuasivos y accesibles, su capacidad para generar contenido verosímil (pero falso) se convierte en una amenaza latente. Por ello, cualquier sistema que utilice LLMs en contextos de consulta o generación de conocimiento debe implementar controles robustos que garanticen la calidad, la veracidad y la trazabilidad de la información.

# Referencias
* <a href="https://genai.owasp.org/llmrisk/llm092025-misinformation/" style="color: red; text-decoration: underline;">OWASP TOP 10 for LLM Application - LLM09:2025 Misinformation</a>
