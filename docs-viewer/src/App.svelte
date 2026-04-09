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
    color: #333;
    line-height: 1.6;
    background: #fff;
  }
</style>
