<template>
  <div>
    <p class="text-center text-gray-600">Redirecting...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'redirect-index' })
</script>
