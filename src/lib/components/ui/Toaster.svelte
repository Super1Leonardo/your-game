<script lang="ts" module>
  import { Toaster } from "melt/builders";

  export type ToastData = {
    testid?: string;
    title?: string;
    description?: string;
    type: "success" | "error" | "info" | "warning";
  };

  const toaster = new Toaster<ToastData>({
    closeDelay: 3000,
  });

  const colors = {
    success: "bg-success",
    error: "bg-error",
    info: "bg-info",
    warning: "bg-warning",
  };

  export const addToast = toaster.addToast;
</script>

<script lang="ts">
  import { flip } from "svelte/animate";
  import { fly } from "svelte/transition";
</script>

<div
  {...toaster.root}
  class="fixed z-50 m-4 flex flex-col items-end bottom-0! right-0! left-auto! top-auto! gap-2 md:bottom-0 md:top-auto overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
>
  {#each toaster.toasts as toast (toast.id)}
    <div
      {...toast.content}
      data-test-id={toast.data.testid}
      animate:flip={{ duration: 500 }}
      in:fly={{ duration: 250, y: 50 }}
      out:fly={{ duration: -250, y: 50 }}
      class="rounded-lg {colors[toast.data.type]} text-white shadow-md"
    >
      <div
        class="relative flex w-84 max-w-[calc(100vw-2rem)] items-center justify-center gap-4 p-5"
      >
        <div>
          <h3
            {...toast.title}
            class="flex items-center gap-3 text-lg font-semibold"
          >
            {toast.data.title}
          </h3>

          <div {...toast.description}>
            {toast.data.description}
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
