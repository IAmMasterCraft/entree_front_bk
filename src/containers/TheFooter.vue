<template>
  <CFooter :fixed="false">
    <div class="mfs-auto">
      <span class="p-1">&copy; {{new Date().getFullYear()}} EntreeLab.</span>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
