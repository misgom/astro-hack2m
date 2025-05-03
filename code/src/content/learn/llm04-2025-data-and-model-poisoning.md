---
title: LLM04:2025 - Data and Model Poisoning
description: Aprende sobre ataques de envenenamiento de datos y modelos y cómo protegerete
pubDate: 2024-04-22
author: Hack2m Team
---

El envenenamiento de datos y del modelo es una técnica maliciosa mediante la cual un atacante introduce información manipulada con el objetivo de alterar el comportamiento de un modelo de lenguaje, comprometer su integridad o insertar puertas traseras. En el contexto de los LLM, este tipo de ataque representa una amenaza creciente, especialmente cuando se utilizan procesos automáticos de entrenamiento o fine-tuning con datos dinámicos, como foros, redes sociales o bases de conocimiento abiertas.

A diferencia de los ataques de prompt injection, que manipulan la entrada en tiempo real, los ataques de envenenamiento actúan de forma más sutil y persistente, contaminando el modelo desde su base de conocimiento. Estos ataques pueden hacer que el modelo aprenda patrones incorrectos, sesgados o maliciosos que luego afecten sus respuestas durante la inferencia.

Este capítulo analiza en profundidad cómo funciona el envenenamiento de datos y modelos, los métodos más comunes de explotación y las técnicas defensivas más efectivas.

# Descripción de la vulnerabilidad
El data/model poisoning puede definirse como el proceso mediante el cual se introducen datos falsos, corruptos o manipulados durante las fases de entrenamiento o ajuste fino de un modelo, con el objetivo de alterar su comportamiento de manera predecible. Este ataque puede comprometer:
* La precisión del modelo, introduciendo ruido o datos inconsistentes.
* La imparcialidad y ética del modelo, fomentando respuestas sesgadas.
* La seguridad, creando puertas traseras que se activan con prompts específicos.

Existen dos grandes variantes de esta vulnerabilidad:
1. **Data poisoning**: el ataque se realiza manipulando los datos usados para entrenar o ajustar el modelo.
2. **Model poisoning**: el ataque altera directamente los parámetros del modelo o su estructura (normalmente en contextos federados o distribuidos).

# Métodos de explotación
### Envenenamiento por contenido (contaminación de datos)
El atacante introduce contenido manipulador en fuentes abiertas que sabe que serán utilizadas como parte del dataset de entrenamiento o fine-tuning.
Ejemplo: Un actor malicioso publica miles de entradas en Wikipedia o foros con desinformación sobre un tema técnico. Un modelo que se entrene posteriormente con estos datos podría aprender y replicar esa información errónea.
### Puertas traseras en el modelo
En esta variante, el atacante introduce patrones de activación específicos en los datos envenenados, de forma que el modelo solo responda de manera maliciosa ante ciertos triggers.
Ejemplo: Cada vez que el usuario escriba “modo especial: ON”, el modelo responde sin restricciones, ignorando filtros de seguridad.
### Envenenamiento federado
En contextos de aprendizaje federado, donde múltiples clientes contribuyen al entrenamiento de un modelo compartido, un cliente malicioso puede manipular sus aportaciones para insertar sesgos o errores.
Ejemplo: Un nodo en un sistema federado modifica los gradientes enviados durante el entrenamiento para reducir la precisión del modelo en ciertos dialectos o regiones.
### Envenenamiento gradual o persistente
Este ataque se basa en introducir cambios sutiles y acumulativos en el dataset a lo largo del tiempo, de modo que el modelo "aprenda" nuevas asociaciones que antes no existían.
Ejemplo: A lo largo de semanas, se publican cientos de reseñas que vinculan un medicamento seguro con efectos adversos falsos. El modelo acaba generando desinformación médica al respecto.

# Estrategias de mitigación
Dado que el envenenamiento puede ser difícil de detectar una vez que el modelo ha sido afectado, es crucial adoptar medidas preventivas rigurosas durante todo el ciclo de vida del modelo.
### Curación y auditoría de datasets
* Evaluar y filtrar las fuentes de datos utilizadas en el entrenamiento.
* Preferir fuentes verificadas y evitar datos dinámicos no moderados.
* Utilizar herramientas de detección de anomalías para identificar patrones sospechosos en los datos.
### Entrenamiento supervisado y controlado
* Evitar el fine-tuning automático con datos no verificados.
* Incorporar mecanismos de validación humana o supervisión en cada iteración de entrenamiento.
* Realizar pruebas de resistencia ante triggers específicos que puedan activar comportamientos inesperados.
### Verificación de comportamiento postentrenamiento
* Diseñar pruebas automáticas de comportamiento del modelo para validar su seguridad y consistencia.
* Aplicar análisis comparativos entre versiones del modelo para detectar desviaciones anómalas.
### Aislamiento de modelos preentrenados
* Evitar reutilizar modelos de terceros sin auditoría.
* Aplicar técnicas como pruning y distillation para eliminar partes sospechosas del modelo.
* Usar sandboxing para probar modelos antes de integrarlos en entornos de producción.

### Uso de métodos de defensa específicos
* Técnicas como Differential Privacy pueden proteger el modelo frente a ataques de extracción y limitar la sobre-memorización de datos sensibles.
* Algoritmos de robustez contra backdoor attacks, como Neural Cleanse o Spectral Signature Detection, pueden identificar y mitigar puertas traseras.

# Conclusión
El envenenamiento de datos y modelos representa una amenaza sofisticada pero cada vez más común en el desarrollo de sistemas de IA generativa. Estos ataques son especialmente peligrosos por su naturaleza encubierta y persistente, ya que el modelo afectado puede operar de forma aparentemente normal hasta que se activa el comportamiento malicioso.

Adoptar una postura de "seguridad desde el diseño" en el entrenamiento de modelos, curar cuidadosamente los datasets y utilizar técnicas de validación y detección de anomalías son pasos críticos para mitigar este riesgo. En contextos de aplicaciones críticas, como el sector sanitario, jurídico o financiero, estas medidas son aún más importantes para evitar consecuencias graves.

En un entorno donde los datos son dinámicos y las arquitecturas colaborativas son cada vez más comunes, la protección frente al data/model poisoning debe ser una prioridad estratégica.

# Referencias
* <a href="https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/" style="color: red; text-decoration: underline;">OWASP TOP 10 for LLM Application - LLM04:2025 Data and Model Poisoning</a>
