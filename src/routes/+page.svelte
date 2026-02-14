<script lang="ts">
  import data from "$lib/data/data.json";

  const { round1 } = data;
</script>

<div class="grid grid-cols-6 gap-4 p-4">
  {#each round1 as theme}
    <div class="flex flex-col gap-2">
      <div
        class="bg-primary text-primary-content p-2 rounded-box font-bold text-center h-20 flex items-center justify-center"
      >
        {theme.theme}
      </div>

      {#each theme.questions as question}
        <button class="btn btn-secondary h-16 text-xl">
          {question.cost}
        </button>
      {/each}
    </div>
  {/each}
</div>
