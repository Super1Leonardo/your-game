<script lang="ts" context="module">
  import { createToaster } from "@melt-ui/svelte";

  export type ToastData = {
    title?: string;
    description?: string;
    type: "success" | "error" | "info" | "warning";
  };

  const toaster = createToaster<ToastData>({
    closeDelay: 3000,
  });

  const colors = {
    success: "bg-success",
    error: "bg-error",
    info: "bg-info",
    warning: "bg-warning",
  };

  export const {
    elements: { content, title, description, close },
    states: { toasts },
    actions: { portal },
  } = toaster;

  export const addToast = toaster.helpers.addToast;
</script>

<script lang="ts">
  import { melt } from "@melt-ui/svelte";
  import { flip } from "svelte/animate";
  import { fly } from "svelte/transition";
</script>

<div
  class="fixed right-0 top-0 z-50 m-4 flex flex-col items-end gap-2 md:bottom-0 md:top-auto"
  use:portal
>
  {#each $toasts as { id, data } (id)}
    <div
      use:melt={$content(id)}
      animate:flip={{ duration: 500 }}
      in:fly={{ duration: 150, x: "100%" }}
      out:fly={{ duration: 150, x: "100%" }}
      class="rounded-lg {colors[data.type]} text-white shadow-md"
    >
      <div
        class="relative flex w-84 max-w-[calc(100vw-2rem)] items-center justify-center gap-4 p-5"
      >
        <div>
          <h3
            use:melt={$title(id)}
            class="flex items-center gap-3 font-semibold"
          >
            {data.title}
          </h3>
          <div use:melt={$description(id)}>
            {data.description}
          </div>
        </div>
        <!-- <button
          use:melt={$close(id)}
          class="absolute right-4 top-4 grid size-12 place-items-center rounded-full text-primary
          hover:bg-primary"
        >
        </button> -->
      </div>
    </div>
  {/each}
</div>
