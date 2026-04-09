<script>
  import Genesis  from './Genesis.svelte';
  import DocsView from './DocsView.svelte';

  let mode = $state('genesis');
</script>

{#if mode === 'genesis'}
  <Genesis onEnterDocs={() => (mode = 'docs')} />
{:else}
  <DocsView onBack={() => (mode = 'genesis')} />
{/if}

<style>
  :global(body) {
    margin: 0;
    font-family: 'Space Grotesk', sans-serif;
    color: #e0e0e0;
    line-height: 1.6;
    background: #050505;
  }
</style>
