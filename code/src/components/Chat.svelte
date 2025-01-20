<script>
    import { Label, Input, Spinner } from "flowbite-svelte";

    let answer = ''
    let loading = false

    const handleSubmit = async (event) => {
        answer = ''
        event.preventDefault()
        loading = true
        const question = event.target.question.value

        const res = await fetch("http://localhost:8000/question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question}),
        })

        if (!res.ok) {
            loading = false
            return
        }
        const apiAnswer = await res.json()
        answer = apiAnswer.response[0].generated_text[2].content
        loading = false
    }
</script>

<form class="mt-8" on:submit={handleSubmit}>
     <div class="mb-6">
        <Label for="question" class="block mb-2">Pregunta</Label>
        <Input id="question" required placeholder="Intenta obtener la bandera!"></Input>
     </div>
</form>

{#if loading}
    <div class="flex justify-center items-center flex-col gap-y-2">
        <Spinner />
        <p class="font-medium text-white">Generando respuesta...</p>
    </div>
{/if}

{#if answer}
    <div class="mt-8">
        <p class="font-medium text-white">Respuesta:</p>
        <p class="font-medium text-white">{answer}</p>
    </div>
{/if}
