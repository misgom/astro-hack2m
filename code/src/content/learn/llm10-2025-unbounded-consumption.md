---
title: LLM10:2025 - Unbounded consumption
description: Aprende cómo la aplicaciones LLM son vulnerables contra ataques DoS
pubDate: 2024-04-22
author: Miguel M.
---

Los modelos de lenguaje requieren recursos computacionales significativos para funcionar: memoria, CPU/GPU, espacio de almacenamiento, capacidad de red, y tiempo de ejecución. En entornos de producción, especialmente cuando hay múltiples usuarios o conexiones simultáneas, un mal manejo de estos recursos puede derivar en problemas graves de disponibilidad, coste y estabilidad.

La vulnerabilidad conocida como Unbounded Consumption se refiere a la posibilidad de que usuarios maliciosos (o incluso usuarios legítimos mal gestionados) puedan provocar un consumo descontrolado de recursos, ya sea de forma intencionada (ataques de denegación de servicio), accidental (mal diseño de la aplicación) o abusiva (explotación de límites laxos).

Este artículo examina las causas de esta vulnerabilidad, los vectores de explotación más comunes y las principales medidas para proteger aplicaciones basadas en LLMs contra estos riesgos.

# Descripción de la vulnerabilidad

A diferencia de servicios tradicionales con cargas predecibles, las aplicaciones que integran modelos generativos pueden tener un consumo variable y difícil de controlar. Los factores que contribuyen al consumo ilimitado son:
* Respuestas largas o sin límite de tokens
* Prompts complejos que requieren múltiples pasos de razonamiento
* Generación recursiva o en bucle
* Uso indiscriminado de herramientas externas (llamadas a funciones)
* Cargas masivas en endpoints públicos sin autenticación o con límites débiles

En sistemas mal protegidos, estos escenarios pueden llevar a:
* Agotamiento de memoria o ciclos de CPU
* Cuellos de botella en bases vectoriales o almacenamiento
* Costes elevados por uso excesivo de APIs o servicios cloud
* Bloqueo total o parcial del sistema (DoS)

# Métodos de explotación

### Prompt bombing
Prompts diseñados para forzar al modelo a generar una cantidad excesiva de texto o ejecutar tareas muy costosas.

Ejemplo:

“Resume la obra completa de Shakespeare en forma de tabla comparativa detallada por personaje, escena y tema.”

Este tipo de prompt, aunque parezca legítimo, puede requerir gigabytes de procesamiento y varios minutos de computación.

### Bucles infinitos
El usuario induce al modelo a entrar en un bucle de generación infinita, por ejemplo, pidiendo que repita algo hasta que se cumpla una condición imposible.

Ejemplo:

“Genera una lista de todos los números primos hasta que me digas uno que sea divisible por 2.”

### Token flooding
Ataques en los que se envían solicitudes masivas, repetitivas o con contextos extremadamente largos para consumir el límite de tokens del modelo y saturar el sistema.

Ejemplo: Mandar cientos de peticiones que cada una contenga miles de tokens contextuales (copia-pega de documentos completos) solo para generar una simple respuesta.

### External resource drain
Cuando el modelo puede usar herramientas externas (plugins, APIs, navegadores), un atacante puede hacer que el modelo realice cientos o miles de llamadas costosas.

Ejemplo:

“Haz una comparación de precios en 1000 webs distintas y analiza sus resultados.”

# Estrategias de mitigación

### Límites de uso y cuotas de recursos
* Establecer límites de tokens por prompt y por respuesta.
* Definir límites de llamadas por usuario (rate limit).
* Implementar cuotas diarias o mensuales por IP, cuenta o sesión.

### Timeouts y corta-circuitos
* Aplicar límites de tiempo por ejecución.
* Detener procesos que excedan un umbral de tiempo, CPU o memoria.

### Validación y análisis de prompts
* Detectar prompts que pueden causar bucles, explosiones combinatorias o consumo elevado antes de ser enviados al modelo.
* Implementar clasificadores de “prompt peligrosos” que impidan solicitudes con alta complejidad semántica o computacional.

### Gestión segura del contexto
* Limitar el número de mensajes anteriores almacenados en memoria conversacional.
* Aplicar compresión semántica o resúmenes de contexto para reducir la carga total.

### Control sobre herramientas externas
* Establecer un número máximo de llamadas externas por sesión.
* Priorizar herramientas con respuestas rápidas y bajo coste.
* Monitorear y auditar el uso de plugins y APIs externas.

# Conclusión

El consumo ilimitado de recursos no es solo un riesgo técnico, sino también económico y operacional. En un entorno donde cada token puede representar un coste monetario, y cada petición puede comprometer la disponibilidad del sistema, protegerse frente a esta vulnerabilidad es esencial para mantener la sostenibilidad y la fiabilidad de las aplicaciones basadas en LLMs.

Establecer límites, validar entradas, auditar el uso de recursos y aplicar controles inteligentes son prácticas fundamentales para evitar que un sistema potente y útil se convierta, por diseño o por abuso, en una carga incontrolable.

# Referencias
* <a href="https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/" style="color: red; text-decoration: underline;">OWASP TOP 10 for LLM Application - LLM10:2025 Unbounded Consumption</a>
