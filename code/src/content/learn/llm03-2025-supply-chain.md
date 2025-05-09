---
title: LLM03:2025 - Supply Chain
description: Conoce los fundamentos de los ataques a la cadena de suministro y cómo defenderte de ellos
pubDate: 2024-04-22
author: Miguel M.
---

La adopción de modelos de lenguaje de gran tamaño (LLM) suele apoyarse en una compleja cadena de suministro que incluye modelos preentrenados, librerías de terceros, fuentes de datos externas y servicios en la nube. Esta dependencia conlleva una serie de riesgos, especialmente si alguno de los elementos de esta cadena es malicioso, vulnerable o no confiable.

Los ataques a la cadena de suministro no son nuevos en el mundo de la ciberseguridad, pero en el contexto de LLM adquieren nuevas formas: desde modelos contaminados con datos manipulados, hasta paquetes maliciosos integrados en bibliotecas de procesamiento de lenguaje. Dado que muchas aplicaciones de IA reutilizan componentes disponibles públicamente, a menudo sin auditorías rigurosas, la superficie de ataque es considerable.

Este capítulo analiza los vectores de ataque más comunes en la cadena de suministro de aplicaciones con LLM, ejemplos de explotación, y estrategias para reducir la exposición al riesgo.

# Descripción de la vulnerabilidad
Los riesgos en la cadena de suministro surgen cuando uno o más componentes de software, hardware o datos externos integrados en una solución basada en LLM comprometen su seguridad. Estos componentes pueden incluir:
* Modelos preentrenados descargados de fuentes públicas.
* Datos de entrenamiento obtenidos de terceros o recopilados automáticamente.
* Librerías de procesamiento o servicios auxiliares (como tokenizers, embeddings, etc.).
* Integraciones con APIs externas no seguras.
Una aplicación es tan segura como el eslabón más débil de su cadena de suministro. Si un atacante logra introducir una puerta trasera, una instrucción oculta o una función comprometida en uno de esos eslabones, puede afectar al comportamiento de toda la aplicación.
# Métodos de explotación
A continuación, se detallan los vectores más habituales de explotación de vulnerabilidades en la cadena de suministro de aplicaciones con LLM.
## Modelos preentrenados maliciosos
Muchos desarrolladores descargan modelos desde repositorios públicos (como Hugging Face) sin verificar su integridad. Un atacante podría publicar un modelo que incluya instrucciones ocultas, sesgos maliciosos o "bombas lógicas" que se activan con ciertos prompts.

Por ejemplo, un modelo aparentemente benigno podría responder de forma normal ante preguntas comunes, pero entregar instrucciones peligrosas si detecta una frase como "modo administrador activado".

## Contaminación de datos de entrenamiento
En contextos donde el modelo se entrena o adapta automáticamente a nuevos datos, un atacante puede inyectar contenido manipulado en las fuentes de datos (foros, redes sociales, correos, etc.) para influir en el comportamiento del modelo.

Por ejemplo, un atacante llena una base de datos de reseñas con ejemplos sesgados que glorifican un producto específico. El modelo adaptado comienza a recomendar ese producto con mayor frecuencia sin una razón objetiva.

## Librerías de terceros comprometidas
El uso de bibliotecas de código abierto, especialmente si no están mantenidas activamente, puede ser una vía de entrada para código malicioso.

Por ejemplo, una dependencia usada para convertir texto a tokens incluye una función oculta que registra consultas del usuario y las envía a un servidor remoto.

## APIs o servicios externos no seguros
Muchas aplicaciones con LLM consultan APIs externas (para verificación de hechos, traducciones, análisis de sentimientos, etc.). Si estas APIs no están bien protegidas, podrían devolver respuestas manipuladas o interceptar datos sensibles.

Por ejemplo, una API que proporciona contexto para un modelo devuelve intencionalmente información incorrecta para manipular la salida del LLM.

# Estrategias de mitigación
Para proteger una solución basada en LLM frente a riesgos en la cadena de suministro, se deben aplicar buenas prácticas de seguridad y gobernanza tecnológica en todos los niveles del sistema.
### Auditoría y verificación de modelos
* Verificar la autenticidad e integridad de los modelos descargados.
* Priorizar el uso de modelos auditados, certificados o mantenidos por entidades confiables.
* Utilizar hashes y firmas digitales para validar modelos antes de incorporarlos a producción.
### Curación y control de datos de entrenamiento
* Evitar entrenamiento o ajuste automático sin revisión de los datos.
* Establecer mecanismos de procedencia de datos para rastrear el origen de la información.
* Usar técnicas de detección de contaminación de datos.
### Gestión segura de dependencias
* Utilizar herramientas de análisis de dependencias para detectar vulnerabilidades conocidas.
* Minimizar el número de librerías externas y mantenerlas actualizadas.
* Evitar incluir dependencias de mantenedores desconocidos o con bajo nivel de actividad.
### Revisión de APIs y servicios integrados
* Evaluar la seguridad y fiabilidad de cualquier API o servicio externo antes de integrarlo.
* Implementar autenticación segura y validación de respuestas.
* Desconfiar de servicios gratuitos o sin documentación clara sobre seguridad.
### Políticas de ciclo de vida y supervisión continua
* Implementar un proceso de control de cambios para cualquier componente externo.
* Automatizar pruebas de regresión y escaneo de seguridad en cada actualización.
* Adoptar marcos como SBOM (Software Bill of Materials) para trazar los componentes del sistema.

# Conclusión
La cadena de suministro de software es uno de los vectores de ataque más sutiles y peligrosos, especialmente en el desarrollo de soluciones con LLM, donde gran parte del stack tecnológico proviene de fuentes abiertas o de terceros. La confianza ciega en modelos preentrenados, datos no verificados o librerías poco mantenidas puede resultar en una brecha de seguridad crítica.

Aplicar controles rigurosos en la verificación de componentes, establecer procesos de validación de datos y utilizar herramientas para la monitorización activa son medidas esenciales para mitigar estos riesgos. Las organizaciones deben adoptar una postura proactiva para asegurar la trazabilidad y confiabilidad de todos los elementos que componen sus soluciones basadas en IA generativa.

# Referencias
* <a href="https://genai.owasp.org/llmrisk/llm032025-supply-chain/" style="color: red; text-decoration: underline;">OWASP TOP 10 for LLM Application - LLM03:2025 Supply Chain</a>
