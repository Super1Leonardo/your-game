<script lang="ts" module>
  import { createToaster } from "@melt-ui/svelte";

  export type ToastData = {
    testid?: string;
    title?: string;
    description?: string;
    type: "success" | "error" | "info" | "warning";
  };

  const toaster = createToaster<ToastData>({
    closeDelay: 3000,
  });

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

  const colors: Record<string, string> = {
    success: "bg-success",
    error: "bg-error",
    info: "bg-info",
    warning: "bg-warning",
  };
</script>

<div
  class="fixed bottom-0 right-0 z-100 m-6 flex flex-col items-end gap-2 pointer-events-none"
  use:portal
>
  {#each $toasts as { id, data } (id)}
    <div
      data-test-id={data.testid}
      use:melt={$content(id)}
      animate:flip={{ duration: 500 }}
      in:fly={{ duration: 250, y: 50 }}
      out:fly={{ duration: 250, y: 20 }}
      class="rounded-lg {colors[
        data.type
      ]} text-white shadow-md pointer-events-auto"
    >
      <div
        class="relative flex w-84 max-w-[calc(100vw-2rem)] items-center justify-center gap-4 p-5"
      >
        <div>
          <h3
            use:melt={$title(id)}
            class="flex items-center gap-3 text-lg font-semibold"
          >
            {data.title}
          </h3>

          <div use:melt={$description(id)}>
            {data.description}
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
